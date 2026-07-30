package com.memoryos.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchResponse {
    private String answer;
    private List<MemoryResponse> memories;
    private String query;
}
