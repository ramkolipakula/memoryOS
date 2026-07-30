package com.memoryos.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessResponse {
    private List<ProcessedEventDto> remembered;
    private List<ProcessedEventDto> forgotten;
    private int totalEvents;
    private int rememberedCount;
    private int forgottenCount;
}
