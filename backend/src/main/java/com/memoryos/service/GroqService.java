package com.memoryos.service;

/**
 * Service for interacting with the Groq API.
 */
public interface GroqService {
    
    /**
     * Sends a chat completion request to Groq.
     *
     * @param systemPrompt the system instructions
     * @param userPrompt the user input
     * @return the content of the generated response
     */
    String chat(String systemPrompt, String userPrompt);
}
