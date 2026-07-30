package com.memoryos.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.memoryos.dto.*;
import com.memoryos.exception.AudioProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

@Slf4j
@Service
public class EventExtractionServiceImpl implements EventExtractionService {

    private final GroqService groqService;
    private final TranscriptChunkingService chunkingService;
    private final EventMergeService mergeService;
    private final ObjectMapper objectMapper;
    private final ExecutorService executorService;

    private static final String EXTRACTION_PROMPT = """
            You are an event extraction engine. Analyze the following transcript chunk and extract all meaningful events.
            
            For each event, determine:
            1. type - One of: Assignment, Deadline, Meeting, Reminder, Academic, Work, Health, Shopping, Travel, Personal, Casual Conversation, Other
            2. title - A concise title for the event (if applicable)
            3. description - A brief description of the event details
            4. chunkOrigin - Set this strictly to the provided chunk ID.
            5. confidence - Float 0.0 to 1.0 representing extraction confidence
            6. estimatedImportance - Integer 0 to 100 representing priority
            
            Rules:
            - Extract ALL events, including casual conversations
            - Be precise with dates, names, and details mentioned
            - If no specific title applies, omit the title field
            - Return ONLY a valid JSON array, no additional text
            
            Return ONLY valid JSON.
            Never include markdown.
            Never include ```json.
            Never include explanations.
            Ensure every array and object is properly closed.
            
            Example output format:
            [
              {"type": "Assignment", "title": "Database Assignment", "description": "Submission deadline moved to August 15", "chunkOrigin": 1, "confidence": 0.95, "estimatedImportance": 90}
            ]
            
            Chunk ID: %d
            Transcript Chunk:
            %s
            """;

    public EventExtractionServiceImpl(GroqService groqService, TranscriptChunkingService chunkingService, EventMergeService mergeService) {
        this.groqService = groqService;
        this.chunkingService = chunkingService;
        this.mergeService = mergeService;
        this.objectMapper = new ObjectMapper();
        this.executorService = Executors.newVirtualThreadPerTaskExecutor(); // High-performance I/O concurrency
    }

    @Override
    public ExtractionResponse extractEvents(String transcript) {
        if (groqService == null) {
            throw new AudioProcessingException("Groq service is not configured.");
        }
        if (transcript == null || transcript.isBlank()) {
            throw new IllegalArgumentException("Transcript cannot be empty.");
        }

        long pipelineStart = System.currentTimeMillis();
        
        // 1. Chunking
        long chunkingStart = System.currentTimeMillis();
        List<TranscriptChunk> chunks = chunkingService.chunkTranscript(transcript);
        long chunkingMs = System.currentTimeMillis() - chunkingStart;

        // 2. Parallel Extraction
        List<CompletableFuture<ChunkResult>> futures = new ArrayList<>();
        
        for (TranscriptChunk chunk : chunks) {
            CompletableFuture<ChunkResult> future = CompletableFuture.supplyAsync(() -> processChunkWithRetry(chunk), executorService);
            futures.add(future);
        }

        List<ChunkResult> chunkResults = new ArrayList<>();
        List<EventDto> allEvents = new ArrayList<>();

        for (CompletableFuture<ChunkResult> future : futures) {
            try {
                ChunkResult result = future.get();
                chunkResults.add(result);
                if (result.getEvents() != null) {
                    allEvents.addAll(result.getEvents());
                }
            } catch (InterruptedException | ExecutionException e) {
                log.error("Failed to collect chunk result: {}", e.getMessage(), e);
            }
        }

        // 3. Merging & Deduplication
        long mergeStart = System.currentTimeMillis();
        List<EventDto> mergedEvents = mergeService.mergeEvents(allEvents);
        long mergeMs = System.currentTimeMillis() - mergeStart;

        long pipelineTotalMs = System.currentTimeMillis() - pipelineStart;

        log.info("========== PERFORMANCE METRICS ==========");
        log.info("Chunking: {} ms", chunkingMs);
        for (ChunkResult cr : chunkResults) {
            log.info("Groq Chunk {}: {} sec", cr.getChunkId(), cr.getLatencySec());
        }
        log.info("Merge: {} ms", mergeMs);
        log.info("Total Pipeline: {} sec", pipelineTotalMs / 1000.0);
        log.info("=========================================");

        ProcessMetrics metrics = ProcessMetrics.builder()
                .chunkingMs(chunkingMs)
                .mergeMs(mergeMs)
                .totalSec(pipelineTotalMs / 1000.0)
                .totalChunks(chunks.size())
                .duplicatesRemoved(allEvents.size() - mergedEvents.size())
                .build();

        return ExtractionResponse.builder()
                .chunkResults(chunkResults)
                .mergedEvents(mergedEvents)
                .metrics(metrics)
                .build();
    }

    private ChunkResult processChunkWithRetry(TranscriptChunk chunk) {
        try {
            return processChunk(chunk);
        } catch (Exception e) {
            log.warn("Chunk {} Failed: {}. Retrying once...", chunk.getChunkId(), e.getMessage());
            try {
                return processChunk(chunk);
            } catch (Exception ex) {
                log.error("Chunk {} Failed permanently. Skipped. Error: {}", chunk.getChunkId(), ex.getMessage());
                return ChunkResult.builder()
                        .chunkId(chunk.getChunkId())
                        .status("Failed: " + ex.getMessage())
                        .build();
            }
        }
    }

    private ChunkResult processChunk(TranscriptChunk chunk) {
        long startTime = System.currentTimeMillis();
        
        log.info("====================================================");
        log.info("CHUNK #{} / (Parallel)", chunk.getChunkId());
        log.info("====================================================");
        log.info("Characters: {} - {}", chunk.getStartCharacter(), chunk.getEndCharacter());
        log.info("Estimated Tokens: {}", chunk.getEstimatedTokens());
        log.info("Words: {}", chunk.getEndWord() - chunk.getStartWord());
        log.info("API Model: openai/gpt-oss-20b");
        
        String preview = chunk.getContent().length() > 50 ? chunk.getContent().substring(0, 50) + "..." : chunk.getContent();
        log.info("Chunk Preview: \"{}\"", preview);
        log.info("--------------------------------------------");
        log.info("FULL CHUNK CONTENT\n{}", chunk.getContent());
        log.info("--------------------------------------------");
        log.info("Sending request to Groq for Chunk {}...", chunk.getChunkId());

        String systemPrompt = "You are a precise event extraction engine. Return only valid JSON arrays.";
        String userPrompt = String.format(EXTRACTION_PROMPT, chunk.getChunkId(), chunk.getContent());

        String responseContent = groqService.chat(systemPrompt, userPrompt);
        double latencySec = (System.currentTimeMillis() - startTime) / 1000.0;

        String jsonContent = responseContent.trim();
        if (jsonContent.startsWith("```json")) {
            jsonContent = jsonContent.substring(7);
        } else if (jsonContent.startsWith("```")) {
            jsonContent = jsonContent.substring(3);
        }
        if (jsonContent.endsWith("```")) {
            jsonContent = jsonContent.substring(0, jsonContent.length() - 3);
        }
        jsonContent = jsonContent.trim();

        List<EventDto> events = new ArrayList<>();
        try {
            events = objectMapper.readValue(jsonContent, new TypeReference<List<EventDto>>() {});
        } catch (Exception e) {
            log.error("JSON Parsing failed for chunk {}. Raw: {}", chunk.getChunkId(), responseContent);
            throw new RuntimeException("JSON Parse Error", e);
        }

        log.info("Groq Response Received for Chunk {}", chunk.getChunkId());
        log.info("Latency: {} seconds", latencySec);
        log.info("Events Extracted: {}", events.size());
        for (EventDto ev : events) {
            log.info(" - {}", ev.getType());
            // Ensure chunk origin is set just in case the LLM misses it
            ev.setChunkOrigin(chunk.getChunkId());
        }
        log.info("Chunk {} Completed Successfully", chunk.getChunkId());

        return ChunkResult.builder()
                .chunkId(chunk.getChunkId())
                .estimatedTokens(chunk.getEstimatedTokens())
                .eventCount(events.size())
                .status("Completed")
                .latencySec(latencySec)
                .rawLlmResponse(responseContent)
                .chunkContent(chunk.getContent())
                .events(events)
                .build();
    }
}
