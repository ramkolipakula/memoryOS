package com.memoryos.controller;

import com.memoryos.dto.TranscriptResponse;
import com.memoryos.service.AudioService;
import com.memoryos.service.SpeechToTextService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;

@Slf4j
@RestController
@RequestMapping("/api/audio")
@RequiredArgsConstructor
public class AudioController {

    private final AudioService audioService;
    private final SpeechToTextService speechToTextService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TranscriptResponse> uploadAudio(@RequestParam("file") MultipartFile file) {
        log.info("Received audio upload: {} ({} bytes)", file.getOriginalFilename(), file.getSize());

        // Save the uploaded file
        Path savedPath = audioService.saveAudioFile(file);

        try {
            // Transcribe the audio
            TranscriptResponse transcript = speechToTextService.transcribe(savedPath);
            log.info("Transcription successful: {} characters", transcript.getTranscript().length());
            return ResponseEntity.ok(transcript);
        } finally {
            // Clean up the temporary file
            audioService.cleanupFile(savedPath);
        }
    }
}
