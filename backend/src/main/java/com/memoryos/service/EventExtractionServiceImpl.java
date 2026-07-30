package com.memoryos.service;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.memoryos.dto.EventDto;
import com.memoryos.exception.AudioProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class EventExtractionServiceImpl implements EventExtractionService {

    private final GroqService groqService;
    private final ObjectMapper objectMapper;

    private static final String EXTRACTION_PROMPT = """
            You are an event extraction engine. Analyze the following transcript and extract all meaningful events.
            
            For each event, determine:
            1. type - One of: Assignment, Deadline, Meeting, Reminder, Academic, Work, Health, Shopping, Travel, Personal, Casual Conversation, Other
            2. title - A concise title for the event (if applicable)
            3. description - A brief description of the event details
            
            Rules:
            - Extract ALL events, including casual conversations
            - Be precise with dates, names, and details mentioned
            - If no specific title applies, omit the title field
            - Return ONLY a valid JSON array, no additional text
            
            Return ONLY valid JSON.
            Never include markdown.
            Never include ```json.
            Never include explanations.
            Never truncate the JSON.
            Ensure every array and object is properly closed.
            
            Example output format:
            [
              {"type": "Assignment", "title": "Database Assignment", "description": "Submission deadline moved to August 15"},
              {"type": "Casual Conversation", "description": "Students discussed lunch plans"}
            ]
            
            Transcript:
            """;

    public EventExtractionServiceImpl(GroqService groqService) {
        this.groqService = groqService;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public List<EventDto> extractEvents(String transcript) {
        if (groqService == null) {
            throw new AudioProcessingException(
                    "Groq service is not configured.");
        }

        if (transcript == null || transcript.isBlank()) {
            throw new IllegalArgumentException("Transcript cannot be empty.");
        }

        log.info("Extracting events from transcript ({} characters)", transcript.length());

        try {
            String systemPrompt = "You are a precise event extraction engine. Return only valid JSON arrays.";
            String userPrompt = EXTRACTION_PROMPT + transcript;

            String responseContent = groqService.chat(systemPrompt, userPrompt);
            log.debug("Groq response: {}", responseContent);

            log.info("========== RAW LLM RESPONSE ==========\n{}\n=====================================", responseContent);

            // Clean the response — remove markdown code block markers if present
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

            List<EventDto> events = objectMapper.readValue(jsonContent, new TypeReference<List<EventDto>>() {});
            log.info("Extracted {} events from transcript", events.size());

            return events;

        } catch (Exception e) {
            log.error("Failed to extract events: {}", e.getMessage(), e);
            throw new AudioProcessingException("Failed to extract events from transcript: " + e.getMessage(), e);
        }
    }
}
