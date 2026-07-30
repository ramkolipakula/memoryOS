package com.memoryos.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.memoryos.exception.AudioProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Slf4j
@Service
public class GroqServiceImpl implements GroqService {

    private final String apiKey;
    private final String model;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final int TIMEOUT_SECONDS = 30;

    public GroqServiceImpl(
            @Value("${groq.api-key:}") String apiKey,
            @Value("${groq.model:openai/gpt-oss-20b}") String model) {
        this.apiKey = apiKey;
        this.model = model;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public String chat(String systemPrompt, String userPrompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new AudioProcessingException("Groq API key is not configured. Please set the GROQ_API_KEY environment variable.");
        }

        try {
            String requestBody = buildRequestBody(systemPrompt, userPrompt);
            HttpRequest request = buildRequest(requestBody);
            
            long startTime = System.currentTimeMillis();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            // Handle rate limiting (HTTP 429) with a single retry
            if (response.statusCode() == 429) {
                log.warn("Received HTTP 429 Too Many Requests from Groq. Retrying after 2 seconds...");
                Thread.sleep(2000);
                response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            }

            long duration = System.currentTimeMillis() - startTime;
            
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Groq request successful ({}ms)", duration);
                
                log.info("========== GROQ RAW RESPONSE ==========\n{}\n=======================================", response.body());
                
                String extractedContent = parseResponse(response.body());
                
                log.info("========== EXTRACTED CONTENT ==========\n{}\n=======================================", extractedContent);
                
                if (extractedContent == null || extractedContent.isBlank()) {
                    throw new AudioProcessingException("Groq returned an empty response.");
                }
                
                return extractedContent;
            } else {
                log.error("Groq response body:\n{}", response.body());

                throw new AudioProcessingException(
                    "Groq request failed.\nStatus: "
                    + response.statusCode()
                    + "\n\n"
                    + response.body()
                );
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new AudioProcessingException("Groq request was interrupted", e);
        } catch (Exception e) {
            log.error("Failed to communicate with Groq: {}", e.getMessage(), e);
            throw new AudioProcessingException("Failed to communicate with Groq: " + e.getMessage(), e);
        }
    }

    private String buildRequestBody(String systemPrompt, String userPrompt) throws Exception {
        ObjectNode rootNode = objectMapper.createObjectNode();
        rootNode.put("model", model);
        rootNode.put("temperature", 0.1);
        rootNode.put("max_tokens", 4000);

        ArrayNode messagesArray = rootNode.putArray("messages");

        // System message
        ObjectNode systemMessage = objectMapper.createObjectNode();
        systemMessage.put("role", "system");
        systemMessage.put("content", systemPrompt);
        messagesArray.add(systemMessage);

        // User message
        ObjectNode userMessage = objectMapper.createObjectNode();
        userMessage.put("role", "user");
        userMessage.put("content", userPrompt);
        messagesArray.add(userMessage);

        return objectMapper.writeValueAsString(rootNode);
    }

    private HttpRequest buildRequest(String jsonBody) {
        return HttpRequest.newBuilder()
                .uri(URI.create(GROQ_API_URL))
                .timeout(Duration.ofSeconds(TIMEOUT_SECONDS))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();
    }

    private String parseResponse(String jsonResponse) throws Exception {
        JsonNode rootNode = objectMapper.readTree(jsonResponse);
        JsonNode choicesNode = rootNode.path("choices");
        
        if (choicesNode.isArray() && !choicesNode.isEmpty()) {
            JsonNode choiceNode = choicesNode.get(0);
            
            JsonNode finishReasonNode = choiceNode.path("finish_reason");
            if (!finishReasonNode.isMissingNode() && "length".equals(finishReasonNode.asText())) {
                throw new AudioProcessingException("LLM response was truncated because max_completion_tokens was reached.");
            }
            
            JsonNode messageNode = choiceNode.path("message");
            if (!messageNode.isMissingNode()) {
                JsonNode contentNode = messageNode.path("content");
                if (!contentNode.isMissingNode() && !contentNode.isNull()) {
                    return contentNode.asText();
                } else {
                    return "";
                }
            }
        }
        
        throw new AudioProcessingException("Unexpected response format from Groq: " + jsonResponse);
    }
}
