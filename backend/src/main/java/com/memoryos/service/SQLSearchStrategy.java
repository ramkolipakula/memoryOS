package com.memoryos.service;

import com.memoryos.entity.Memory;
import com.memoryos.repository.MemoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class SQLSearchStrategy implements MemorySearchStrategy {

    private final MemoryRepository memoryRepository;

    @Override
    public List<Memory> executeSearch(String query) {
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

        return new ArrayList<>(matchedMemories);
    }

    private String[] extractKeywords(String query) {
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
}
