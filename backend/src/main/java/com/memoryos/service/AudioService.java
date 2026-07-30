package com.memoryos.service;

import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;

/**
 * Service for handling audio file upload and validation.
 */
public interface AudioService {

    /**
     * Validates and saves the uploaded audio file to a temporary directory.
     *
     * @param file the uploaded audio file
     * @return the path to the saved file
     */
    Path saveAudioFile(MultipartFile file);

    /**
     * Cleans up a temporary audio file after processing.
     *
     * @param filePath the path to the file to delete
     */
    void cleanupFile(Path filePath);
}
