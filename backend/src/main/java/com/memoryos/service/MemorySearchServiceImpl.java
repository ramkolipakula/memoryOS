package com.memoryos.service;


import com.memoryos.dto.MemoryResponse;
import com.memoryos.dto.SearchResponse;
import com.memoryos.entity.Memory;
import com.memoryos.mapper.MemoryMapper;
import com.memoryos.repository.MemoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MemorySearchServiceImpl implements MemorySearchService {

    private final MemoryRepository memoryRepository;
    private final GroqService groqService;

    public MemorySearchServiceImpl(
            MemoryRepository memoryRepository,
            GroqService groqService) {
        this.memoryRepository = memoryRepository;
        this.groqService = groqService;
    }

    @Override
    public SearchResponse search(String query) {
        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException("Search query cannot be empty.");
        }

        log.info("Searching memories for query: '{}'", query);

        // Tokenize query and search across multiple keywords
        Set<Memory> matchedMemories = new LinkedHashSet<>();
        String[] keywords = extractKeywords(query);

        for (String keyword : keywords) {
            if (keyword.length() >= 2) {
                List<Memory> results = memoryRepository.findTop20ByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(keyword, keyword);
                matchedMemories.addAll(results);
            }
        }

        // Also search with the full query
        matchedMemories.addAll(memoryRepository.findTop20ByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(query, query));

        List<Memory> memoryList = new ArrayList<>(matchedMemories);
        List<MemoryResponse> memoryResponses = MemoryMapper.toResponseList(memoryList);

        log.info("========== MEMORY RETRIEVAL ==========");
        log.info("Question: {}", query);
        log.info("SQL search: Title/Content LIKE");
        log.info("Rows retrieved: {}", memoryList.size());
        log.info("Titles retrieved: {}", memoryList.stream().map(Memory::getTitle).collect(Collectors.toList()));
        log.info("======================================");

        // Generate natural language answer
        String answer = generateAnswer(query, memoryList);

        return SearchResponse.builder()
                .answer(answer)
                .memories(memoryResponses)
                .query(query)
                .build();
    }

    private String[] extractKeywords(String query) {
        // Remove common stop words and extract meaningful keywords
        Set<String> stopWords = Set.of(
                "what", "when", "where", "who", "how", "is", "are", "was",
                "were", "the", "a", "an", "in", "on", "at", "to", "for",
                "of", "with", "by", "from", "my", "your", "our", "their",
                "this", "that", "it", "do", "does", "did", "has", "have",
                "had", "will", "would", "can", "could", "should", "may"
        );

        return Arrays.stream(query.toLowerCase().split("\\s+"))
                .map(w -> w.replaceAll("[^a-zA-Z0-9]", ""))
                .filter(w -> !w.isEmpty() && !stopWords.contains(w))
                .toArray(String[]::new);
    }

    private String generateAnswer(String query, List<Memory> memories) {
        if (memories.isEmpty()) {
            return "I don't have any stored memories related to your question.";
        }

        if (groqService == null) {
            // Fallback: build a simple answer without LLM
            return buildSimpleAnswer(memories);
        }

        try {
            String memoryContext = memories.stream()
                    .map(m -> String.format("- [%s] %s: %s", m.getType(), m.getTitle(), m.getContent()))
                    .collect(Collectors.joining("\n"));

            String prompt = String.format(
                    "Based on these stored memories, answer the user's question concisely and naturally.\n\n" +
                    "Memories:\n%s\n\nQuestion: %s\n\n" +
                    "Answer naturally as if you are a personal memory assistant. " +
                    "Be specific with dates, names, and details from the memories.",
                    memoryContext, query);

            String systemPrompt = "You are a personal memory assistant. Answer questions based only on the provided memories.";
            
            log.info("========== GROQ PROMPT ==========\nSystem: {}\n\nUser: {}\n=================================", systemPrompt, prompt);
            
            String answer = groqService.chat(systemPrompt, prompt);

            log.debug("Generated answer: {}", answer);
            return answer;

        } catch (Exception e) {
            log.error("Failed to generate answer with Groq: {}", e.getMessage());
            return buildSimpleAnswer(memories);
        }
    }

    private String buildSimpleAnswer(List<Memory> memories) {
        Memory topMemory = memories.get(0);
        return String.format("Based on your memories: %s — %s",
                topMemory.getTitle(), topMemory.getContent());
    }
}
