package com.memoryos.service;

import com.memoryos.dto.EventDto;
import com.memoryos.dto.ProcessResponse;

import java.util.List;

/**
 * Service for processing events through the Memory Decision Engine and persisting results.
 */
public interface MemoryService {

    /**
     * Processes a list of events through the decision engine,
     * stores remembered events, and returns the full results.
     *
     * @param events     the extracted events to process
     * @param transcript the original transcript for context
     * @return the processing results with remembered and forgotten events
     */
    ProcessResponse processEvents(List<EventDto> events, String transcript);
}
