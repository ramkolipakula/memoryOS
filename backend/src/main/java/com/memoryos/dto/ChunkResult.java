package com.memoryos.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChunkResult {
    private int chunkId;
    private int estimatedTokens;
    private int eventCount;
    private String status;
    private double latencySec;
    private String rawLlmResponse;
    private String chunkContent;
    private List<EventDto> events;
}
