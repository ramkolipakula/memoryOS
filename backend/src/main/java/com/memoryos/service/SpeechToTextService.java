package com.memoryos.service;

import com.memoryos.dto.TranscriptResponse;

import java.nio.file.Path;

/**
 * Service for converting audio files to text using Azure AI Speech.
 */
public interface SpeechToTextService {

    /**
     * Transcribes an audio file to text.
     *
     * @param audioFilePath path to the audio file
     * @return the transcription result with metadata
     */
    TranscriptResponse transcribe(Path audioFilePath);
}
