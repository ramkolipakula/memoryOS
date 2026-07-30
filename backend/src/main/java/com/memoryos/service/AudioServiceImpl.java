package com.memoryos.service;

import com.memoryos.exception.AudioProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class AudioServiceImpl implements AudioService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "mp3", "wav", "m4a", "ogg", "flac", "webm"
    );

    @Value("${memoryos.upload.temp-dir}")
    private String uploadDir;

    private Path uploadPath;

    @PostConstruct
    public void init() {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadPath);
            log.info("Upload directory initialized: {}", uploadPath);
        } catch (IOException e) {
            throw new AudioProcessingException("Failed to create upload directory", e);
        }
    }

    @Override
    public Path saveAudioFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AudioProcessingException("No audio file provided or file is empty.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new AudioProcessingException("File name is missing.");
        }

        String extension = getFileExtension(originalFilename);
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new AudioProcessingException(
                    "Unsupported audio format: ." + extension +
                    ". Supported formats: " + String.join(", ", ALLOWED_EXTENSIONS));
        }

        String uniqueFilename = UUID.randomUUID() + "." + extension;
        Path targetPath = uploadPath.resolve(uniqueFilename);

        try {
            Files.copy(file.getInputStream(), targetPath);
            log.info("Audio file saved: {} ({} bytes)", targetPath, file.getSize());
            return targetPath;
        } catch (IOException e) {
            throw new AudioProcessingException("Failed to save audio file: " + e.getMessage(), e);
        }
    }

    @Override
    public void cleanupFile(Path filePath) {
        try {
            if (filePath != null && Files.exists(filePath)) {
                Files.delete(filePath);
                log.debug("Cleaned up temporary file: {}", filePath);
            }
        } catch (IOException e) {
            log.warn("Failed to clean up file: {}", filePath, e);
        }
    }

    private String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        if (lastDot == -1 || lastDot == filename.length() - 1) {
            throw new AudioProcessingException("File has no extension: " + filename);
        }
        return filename.substring(lastDot + 1);
    }
}
