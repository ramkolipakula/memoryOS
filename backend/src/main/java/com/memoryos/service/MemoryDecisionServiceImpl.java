package com.memoryos.service;

import com.memoryos.dto.EventDto;
import com.memoryos.dto.MemoryDecisionDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

/**
 * Rule-based Memory Decision Engine.
 * 
 * Determines whether an extracted event deserves to become a long-term memory
 * based entirely on event type classification and content heuristics.
 * 
 * NO LLM involvement in decision-making. All logic is implemented in Java.
 */
@Slf4j
@Service
public class MemoryDecisionServiceImpl implements MemoryDecisionService {

    /**
     * Event types that should be REMEMBERED with their base importance scores.
     */
    private static final Map<String, Integer> REMEMBER_TYPES = Map.ofEntries(
            Map.entry("assignment", 95),
            Map.entry("deadline", 98),
            Map.entry("reminder", 90),
            Map.entry("meeting", 88),
            Map.entry("work", 85),
            Map.entry("health", 92),
            Map.entry("academic", 90),
            Map.entry("exam", 97),
            Map.entry("appointment", 88),
            Map.entry("shopping", 70),
            Map.entry("travel", 80)
    );

    /**
     * Event types that should be FORGOTTEN with their low scores.
     */
    private static final Map<String, Integer> FORGET_TYPES = Map.ofEntries(
            Map.entry("casual conversation", 12),
            Map.entry("casual", 12),
            Map.entry("other", 20),
            Map.entry("personal", 35)
    );

    /**
     * Keywords that boost importance — indicate actionable content.
     */
    private static final Set<String> IMPORTANCE_KEYWORDS = Set.of(
            "deadline", "due", "submit", "submission", "exam", "test", "quiz",
            "appointment", "meeting", "schedule", "reminder", "important",
            "urgent", "asap", "tomorrow", "next week", "date", "time",
            "postponed", "rescheduled", "cancelled", "moved", "extended",
            "assignment", "project", "presentation", "report", "homework",
            "doctor", "hospital", "medication", "prescription",
            "flight", "booking", "reservation", "checkout"
    );

    /**
     * Keywords that reduce importance — indicate casual/trivial content.
     */
    private static final Set<String> TRIVIAL_KEYWORDS = Set.of(
            "hello", "hi", "hey", "goodbye", "bye", "see you",
            "lunch", "dinner", "breakfast", "coffee",
            "weather", "rain", "sunny", "cloudy",
            "joke", "funny", "lol", "haha",
            "how are you", "what's up", "sup", "fine", "good morning"
    );

    @Override
    public MemoryDecisionDto evaluate(EventDto event) {
        if (event == null || event.getType() == null) {
            return buildDecision("FORGET", 5, "Event data is incomplete.");
        }

        String type = event.getType().toLowerCase().trim();
        String description = event.getDescription() != null ? event.getDescription().toLowerCase() : "";
        String title = event.getTitle() != null ? event.getTitle().toLowerCase() : "";
        String combinedText = title + " " + description;

        // Step 1: Check against REMEMBER types
        if (REMEMBER_TYPES.containsKey(type)) {
            int baseScore = REMEMBER_TYPES.get(type);
            int adjustedScore = adjustScoreWithKeywords(baseScore, combinedText);
            String reason = generateRememberReason(type, event);
            log.debug("REMEMBER decision for event '{}': score={}", event.getTitle(), adjustedScore);
            return buildDecision("REMEMBER", Math.min(adjustedScore, 100), reason);
        }

        // Step 2: Check against FORGET types
        if (FORGET_TYPES.containsKey(type)) {
            int baseScore = FORGET_TYPES.get(type);

            // Check if casual event actually contains important info (score boost)
            int importanceBoost = countImportanceKeywords(combinedText) * 15;
            if (importanceBoost > 30) {
                int boostedScore = Math.min(baseScore + importanceBoost, 85);
                String reason = "Initially classified as " + event.getType() +
                        " but contains actionable information.";
                log.debug("RECLASSIFIED to REMEMBER for event: {}", combinedText);
                return buildDecision("REMEMBER", boostedScore, reason);
            }

            String reason = generateForgetReason(type, event);
            log.debug("FORGET decision for event type '{}': score={}", type, baseScore);
            return buildDecision("FORGET", baseScore, reason);
        }

        // Step 3: Unknown type — use content analysis as fallback
        int importanceCount = countImportanceKeywords(combinedText);
        int trivialCount = countTrivialKeywords(combinedText);

        if (importanceCount > trivialCount) {
            int score = Math.min(60 + (importanceCount * 10), 90);
            return buildDecision("REMEMBER", score,
                    "Contains actionable keywords suggesting this is important information.");
        } else if (trivialCount > 0) {
            return buildDecision("FORGET", 15,
                    "Content appears to be casual or trivial in nature.");
        }

        // Default: moderate importance for unclassified events
        return buildDecision("REMEMBER", 55,
                "Unclassified event type preserved as potentially important.");
    }

    private int adjustScoreWithKeywords(int baseScore, String text) {
        int boost = countImportanceKeywords(text) * 2;
        return Math.min(baseScore + boost, 100);
    }

    private int countImportanceKeywords(String text) {
        return (int) IMPORTANCE_KEYWORDS.stream()
                .filter(text::contains)
                .count();
    }

    private int countTrivialKeywords(String text) {
        return (int) TRIVIAL_KEYWORDS.stream()
                .filter(text::contains)
                .count();
    }

    private String generateRememberReason(String type, EventDto event) {
        return switch (type) {
            case "assignment" -> "Contains an academic assignment that requires action.";
            case "deadline" -> "Contains a deadline that must be tracked.";
            case "reminder" -> "Contains a reminder for a future action.";
            case "meeting" -> "Contains meeting information to be remembered.";
            case "work" -> "Contains work-related task or information.";
            case "health" -> "Contains health-related information that should be tracked.";
            case "academic" -> "Contains academic information relevant to studies.";
            case "exam" -> "Contains exam or test information — critical academic event.";
            case "appointment" -> "Contains an appointment that needs to be kept.";
            case "shopping" -> "Contains a shopping task or purchase reminder.";
            case "travel" -> "Contains travel plans or booking information.";
            default -> "Contains important information worth remembering.";
        };
    }

    private String generateForgetReason(String type, EventDto event) {
        return switch (type) {
            case "casual conversation", "casual" -> "Casual conversation with no actionable content.";
            case "other" -> "General conversation without specific importance.";
            case "personal" -> "Personal chat without actionable items.";
            default -> "Content is not important enough to store as a memory.";
        };
    }

    private MemoryDecisionDto buildDecision(String decision, int score, String reason) {
        return MemoryDecisionDto.builder()
                .decision(decision)
                .score(score)
                .reason(reason)
                .build();
    }
}
