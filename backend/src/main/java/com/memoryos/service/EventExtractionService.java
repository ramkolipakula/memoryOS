package com.memoryos.service;

import com.memoryos.dto.ExtractionResponse;

/**
 * Service responsible for passing transcripts to an LLM
 * to extract structured events.
 */
public interface EventExtractionService {

    /**
     * Extracts events from the given text transcript.
     *
     * @param transcript the text transcript to analyze
     * @return an ExtractionResponse
     */
    ExtractionResponse extractEvents(String transcript);
}
