package com.memoryos.service;

import com.memoryos.dto.EventDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class EventMergeServiceImpl implements EventMergeService {

    private static final double SIMILARITY_THRESHOLD = 0.85;

    @Override
    public List<EventDto> mergeEvents(List<EventDto> events) {
        long startTime = System.currentTimeMillis();
        
        List<EventDto> mergedList = new ArrayList<>();
        int duplicatesRemoved = 0;

        for (EventDto current : events) {
            boolean isDuplicate = false;

            for (EventDto existing : mergedList) {
                // If they are different types, they might not be duplicates
                if (!current.getType().equalsIgnoreCase(existing.getType())) {
                    continue;
                }

                double titleSim = calculateSimilarity(current.getTitle(), existing.getTitle());
                double descSim = calculateSimilarity(current.getDescription(), existing.getDescription());
                
                // Average similarity
                double overallSim = (titleSim + descSim) / 2.0;

                if (overallSim >= SIMILARITY_THRESHOLD) {
                    isDuplicate = true;
                    // Merge fields if necessary, e.g. keeping the longer description
                    if (current.getDescription() != null && existing.getDescription() != null 
                            && current.getDescription().length() > existing.getDescription().length()) {
                        existing.setDescription(current.getDescription());
                    }
                    duplicatesRemoved++;
                    break;
                }
            }

            if (!isDuplicate) {
                mergedList.add(current);
            }
        }

        log.info("Before Merge: {} events", events.size());
        log.info("Duplicates Removed: {}", duplicatesRemoved);
        log.info("Final Events: {}", mergedList.size());
        log.info("Merge completed in {} ms.", (System.currentTimeMillis() - startTime));

        return mergedList;
    }

    private double calculateSimilarity(String s1, String s2) {
        if (s1 == null && s2 == null) return 1.0;
        if (s1 == null || s2 == null) return 0.0;
        
        String clean1 = s1.toLowerCase().trim();
        String clean2 = s2.toLowerCase().trim();
        
        if (clean1.equals(clean2)) return 1.0;

        int distance = levenshteinDistance(clean1, clean2);
        int maxLength = Math.max(clean1.length(), clean2.length());
        
        if (maxLength == 0) return 1.0;
        
        return 1.0 - ((double) distance / maxLength);
    }

    private int levenshteinDistance(String s1, String s2) {
        int[] costs = new int[s2.length() + 1];
        for (int i = 0; i <= s1.length(); i++) {
            int lastValue = i;
            for (int j = 0; j <= s2.length(); j++) {
                if (i == 0)
                    costs[j] = j;
                else {
                    if (j > 0) {
                        int newValue = costs[j - 1];
                        if (s1.charAt(i - 1) != s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0)
                costs[s2.length()] = lastValue;
        }
        return costs[s2.length()];
    }
}
