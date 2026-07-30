package com.memoryos.service;

import com.memoryos.dto.TranscriptResponse;
import com.memoryos.exception.AudioProcessingException;
import com.microsoft.cognitiveservices.speech.*;
import com.microsoft.cognitiveservices.speech.audio.AudioConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.nio.file.Files;
import java.nio.file.Path;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Semaphore;

@Slf4j
@Service
public class SpeechToTextServiceImpl implements SpeechToTextService {

    private final SpeechConfig speechConfig;

    public SpeechToTextServiceImpl(@Autowired(required = false) SpeechConfig speechConfig) {
        this.speechConfig = speechConfig;
    }

    @Override
    public TranscriptResponse transcribe(Path audioFilePath) {
        if (speechConfig == null) {
            throw new AudioProcessingException(
                    "Azure Speech service is not configured. Please set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION environment variables.");
        }

        log.info("Starting transcription for file: {}", audioFilePath.getFileName());
        long startTime = System.currentTimeMillis();

        Path processedFilePath = audioFilePath;
        boolean isConverted = false;

        try {
            processedFilePath = convertToWavIfNeeded(audioFilePath);
            isConverted = !processedFilePath.equals(audioFilePath);
        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new AudioProcessingException("Failed to prepare audio format for Azure: " + e.getMessage(), e);
        }

        List<String> transcriptParts = new ArrayList<>();
        Semaphore stopSemaphore = new Semaphore(0);
        final double[] audioDuration = {0};

        try (AudioConfig audioConfig = AudioConfig.fromWavFileInput(processedFilePath.toString());
             SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, audioConfig)) {

            // Handle recognized speech segments
            recognizer.recognized.addEventListener((s, e) -> {
                if (e.getResult().getReason() == ResultReason.RecognizedSpeech) {
                    String text = e.getResult().getText();
                    if (text != null && !text.isBlank()) {
                        transcriptParts.add(text);
                        log.debug("Recognized: {}", text);
                    }
                    // Track duration from offset
                    long offsetTicks = e.getResult().getOffset().longValue();
                    long durationTicks = e.getResult().getDuration().longValue();
                    double endSeconds = (offsetTicks + durationTicks) / 10_000_000.0;
                    if (endSeconds > audioDuration[0]) {
                        audioDuration[0] = endSeconds;
                    }
                }
            });

            // Handle cancellation
            recognizer.canceled.addEventListener((s, e) -> {
                if (e.getReason() == CancellationReason.Error) {
                    log.error("Speech recognition error: {} - {}", e.getErrorCode(), e.getErrorDetails());
                }
                stopSemaphore.release();
            });

            // Handle session stopped
            recognizer.sessionStopped.addEventListener((s, e) -> {
                log.info("Speech recognition session stopped");
                stopSemaphore.release();
            });

            // Start continuous recognition
            recognizer.startContinuousRecognitionAsync().get();
            log.info("Continuous recognition started...");

            // Wait for recognition to complete
            stopSemaphore.acquire();

            // Stop recognition
            recognizer.stopContinuousRecognitionAsync().get();

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new AudioProcessingException("Transcription was interrupted", e);
        } catch (ExecutionException e) {
            throw new AudioProcessingException("Transcription failed: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new AudioProcessingException("Error during transcription: " + e.getMessage(), e);
        } finally {
            if (isConverted) {
                try {
                    Files.deleteIfExists(processedFilePath);
                    log.debug("Deleted temporary converted WAV file: {}", processedFilePath);
                } catch (IOException e) {
                    log.warn("Failed to delete temporary converted WAV file: {}", processedFilePath, e);
                }
            }
        }

        if (transcriptParts.isEmpty()) {
            throw new AudioProcessingException("No speech could be recognized in the audio file.");
        }

        String fullTranscript = String.join(" ", transcriptParts);
        double processingTime = (System.currentTimeMillis() - startTime) / 1000.0;

        log.info("Transcription complete: {} characters, {}s processing time",
                fullTranscript.length(), processingTime);

        return TranscriptResponse.builder()
                .transcript(fullTranscript)
                .language("en")
                .duration(Math.round(audioDuration[0] * 10.0) / 10.0)
                .processingTime(Math.round(processingTime * 10.0) / 10.0)
                .build();
    }

    private Path convertToWavIfNeeded(Path originalPath) throws IOException, InterruptedException {
        String fileName = originalPath.getFileName().toString().toLowerCase();
        if (fileName.endsWith(".wav")) {
            return originalPath; // Already a WAV file
        }

        log.info("Audio format requires conversion to 16-bit PCM WAV: {}", fileName);
        Path outputPath = originalPath.resolveSibling(originalPath.getFileName() + "_converted.wav");

        // Use FFmpeg to convert to 16kHz, mono, 16-bit PCM WAV (which Azure Speech requires)
        ProcessBuilder processBuilder = new ProcessBuilder(
                "ffmpeg", "-y",
                "-i", originalPath.toString(),
                "-ar", "16000",
                "-ac", "1",
                "-c:a", "pcm_s16le",
                outputPath.toString()
        );

        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        // Read the output to prevent the process from blocking if the output buffer fills
        try (java.io.BufferedReader reader = new java.io.BufferedReader(
                new java.io.InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                log.trace("ffmpeg: {}", line);
            }
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            Files.deleteIfExists(outputPath);
            throw new AudioProcessingException("FFmpeg conversion failed with exit code " + exitCode);
        }

        log.info("Successfully converted audio to WAV format: {}", outputPath.getFileName());
        return outputPath;
    }
}
