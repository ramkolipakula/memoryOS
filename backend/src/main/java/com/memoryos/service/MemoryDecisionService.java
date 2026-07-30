package com.memoryos.service;

import com.memoryos.dto.EventDto;
import com.memoryos.dto.MemoryDecisionDto;

/**
 * Rule-based engine that decides whether an event should be remembered or forgotten.
 * No LLM involvement — pure Java logic.
 */
public interface MemoryDecisionService {

    /**
     * Evaluates an event and decides whether it should be stored as a memory.
     *
     * @param event the event to evaluate
     * @return the decision with score and reasoning
     */
    MemoryDecisionDto evaluate(EventDto event);
}
