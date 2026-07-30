package com.memoryos.service;

import com.memoryos.dto.SearchResponse;

/**
 * Service for searching stored memories using natural language queries.
 */
public interface MemorySearchService {

    /**
     * Searches stored memories using a natural language query.
     *
     * @param query the natural language question
     * @return search results with a generated answer
     */
    SearchResponse search(String query);
}
