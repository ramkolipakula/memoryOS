package com.memoryos.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessRequest {

    @NotEmpty(message = "Events list cannot be empty")
    @Valid
    private List<EventDto> events;

    @NotBlank(message = "Transcript is required")
    private String transcript;
}
