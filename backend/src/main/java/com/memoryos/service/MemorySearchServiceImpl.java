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

    private final MemorySearchStrategy searchStrategy;
    private final GroqService groqService;

    public MemorySearchServiceImpl(
            MemorySearchStrategy searchStrategy,
            GroqService groqService) {
        this.searchStrategy = searchStrategy;
        this.groqService = groqService;
    }

    @Override
    public SearchResponse search(String query) {
        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException("Search query cannot be empty.");
        }

        log.info("Searching memories for query: '{}'", query);

        long startTime = System.currentTimeMillis();
        List<Memory> memoryList = searchStrategy.executeSearch(query);
        long searchLatencyMs = System.currentTimeMillis() - startTime;
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
