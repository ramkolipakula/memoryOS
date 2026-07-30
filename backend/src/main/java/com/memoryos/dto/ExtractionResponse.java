package com.memoryos.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExtractionResponse {
    private List<ChunkResult> chunkResults;
    private List<EventDto> mergedEvents;
    private ProcessMetrics metrics;
}
