package com.memoryos.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemoryDecisionDto {
    private String decision;
    private int score;
    private String reason;
}
