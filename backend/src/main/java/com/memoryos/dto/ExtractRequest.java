package com.memoryos.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExtractRequest {

    @NotBlank(message = "Transcript text is required")
    private String transcript;
}
