package com.memoryos.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDto {

    @NotBlank(message = "Event type is required")
    private String type;
    
    private String title;

    private String description;

    private Integer chunkOrigin;

    private Double confidence;

    private Integer estimatedImportance;
}
