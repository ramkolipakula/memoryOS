package com.memoryos.config;

import com.microsoft.cognitiveservices.speech.SpeechConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class AzureSpeechConfig {

    @Value("${azure.speech.key}")
    private String speechKey;

    @Value("${azure.speech.region}")
    private String speechRegion;

    @Bean
    public SpeechConfig speechConfig() {
        if (speechKey == null || speechKey.isBlank()) {
            log.warn("Azure Speech key is not configured. Speech-to-text will not work.");
            return null;
        }
        log.info("Initializing Azure Speech SDK for region: {}", speechRegion);
        SpeechConfig config = SpeechConfig.fromSubscription(speechKey, speechRegion);
        config.setSpeechRecognitionLanguage("en-US");
        return config;
    }
}
