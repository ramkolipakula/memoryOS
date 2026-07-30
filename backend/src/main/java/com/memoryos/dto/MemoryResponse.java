package com.memoryos.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemoryResponse {
    private UUID id;
    private String title;
    private String type;
    private String description;
    private Integer score;
    private String decisionReason;
    private LocalDateTime createdAt;
}
