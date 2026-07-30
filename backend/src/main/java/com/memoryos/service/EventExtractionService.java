package com.memoryos.service;

import com.memoryos.dto.EventDto;

import java.util.List;

/**
 * Service for extracting structured events from a transcript using Azure OpenAI.
 */
public interface EventExtractionService {

    /**
     * Extracts structured events from a transcript.
     *
     * @param transcript the text transcript to analyze
     * @return a list of extracted events
     */
    List<EventDto> extractEvents(String transcript);
}
