package com.memoryos.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessedEventDto {
    private String type;
    private String title;
    private String description;
    private String decision;
    private int score;
    private String reason;
}
