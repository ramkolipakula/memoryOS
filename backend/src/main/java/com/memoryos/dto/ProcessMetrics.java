package com.memoryos.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessMetrics {
    private double speechSec;
    private double chunkingMs;
    private double mergeMs;
    private double decisionMs;
    private double databaseMs;
    private double totalSec;
    private int totalChunks;
    private int duplicatesRemoved;
}
