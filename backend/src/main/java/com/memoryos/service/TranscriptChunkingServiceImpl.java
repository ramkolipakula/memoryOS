package com.memoryos.service;

import com.memoryos.dto.TranscriptChunk;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

@Slf4j
@Service
public class TranscriptChunkingServiceImpl implements TranscriptChunkingService {

    private static final int MAX_WORDS = 1200;
    private static final int OVERLAP_WORDS = 150;

    @Override
    public List<TranscriptChunk> chunkTranscript(String transcript) {
        long startTime = System.currentTimeMillis();
        
        List<TranscriptChunk> chunks = new ArrayList<>();
        if (transcript == null || transcript.isBlank()) {
            return chunks;
        }

        // Split by sentences or punctuation for semantic boundaries.
        // A simple approach is to split by words, and when reaching max capacity,
        // backtrack to the nearest sentence boundary.
        String[] words = transcript.split("\\s+");
        
        int currentWordIndex = 0;
        int chunkId = 1;

        while (currentWordIndex < words.length) {
            int endWordIndex = Math.min(currentWordIndex + MAX_WORDS, words.length);
            
            // Try to find a semantic boundary (e.g., period, question mark) near the end
            if (endWordIndex < words.length) {
                int backtrackLimit = Math.max(currentWordIndex, endWordIndex - 200);
                for (int i = endWordIndex - 1; i >= backtrackLimit; i--) {
                    if (words[i].endsWith(".") || words[i].endsWith("?") || words[i].endsWith("!")) {
                        endWordIndex = i + 1; // Include the punctuation word
                        break;
                    }
                }
            }

            StringBuilder contentBuilder = new StringBuilder();
            for (int i = currentWordIndex; i < endWordIndex; i++) {
                contentBuilder.append(words[i]).append(" ");
            }
            String content = contentBuilder.toString().trim();

            int estimatedTokens = (int) (words.length * 1.3); // Rough estimate
            int chunkEstimatedTokens = (int) ((endWordIndex - currentWordIndex) * 1.3);

            TranscriptChunk chunk = TranscriptChunk.builder()
                    .chunkId(chunkId++)
                    .startWord(currentWordIndex)
                    .endWord(endWordIndex)
                    .content(content)
                    .estimatedTokens(chunkEstimatedTokens)
                    .build();

            chunks.add(chunk);

            if (endWordIndex >= words.length) {
                break;
            }

            // Calculate overlap
            currentWordIndex = Math.max(currentWordIndex + 1, endWordIndex - OVERLAP_WORDS);
            
            // Move forward to next sentence boundary to start chunk cleanly if possible
            int forwardLimit = Math.min(words.length, currentWordIndex + 100);
            for (int i = currentWordIndex; i < forwardLimit; i++) {
                 if (words[i].endsWith(".") || words[i].endsWith("?") || words[i].endsWith("!")) {
                     currentWordIndex = i + 1;
                     break;
                 }
            }
        }

        long latency = System.currentTimeMillis() - startTime;
        log.info("Chunking completed in {} ms. Created {} chunks.", latency, chunks.size());

        return chunks;
    }
}
