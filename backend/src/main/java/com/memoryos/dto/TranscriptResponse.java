package com.memoryos.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranscriptResponse {
    private String transcript;
    private String language;
    private double duration;
    private double processingTime;
}
