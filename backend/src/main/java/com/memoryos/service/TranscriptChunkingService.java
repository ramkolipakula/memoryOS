package com.memoryos.service;

import com.memoryos.dto.TranscriptChunk;
import java.util.List;

public interface TranscriptChunkingService {
    List<TranscriptChunk> chunkTranscript(String transcript);
}
