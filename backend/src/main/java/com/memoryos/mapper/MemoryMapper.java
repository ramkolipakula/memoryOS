package com.memoryos.mapper;

import com.memoryos.dto.MemoryResponse;
import com.memoryos.entity.Memory;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class for mapping between Memory entities and DTOs.
 * Follows the mapper pattern to keep conversion logic centralized.
 */
public final class MemoryMapper {

    private MemoryMapper() {
        // Utility class — prevent instantiation
    }

    public static MemoryResponse toResponse(Memory memory) {
        return MemoryResponse.builder()
                .id(memory.getId())
                .title(memory.getTitle())
                .type(memory.getType())
                .description(memory.getContent())
                .score(memory.getImportance())
                .decisionReason(null)
                .createdAt(memory.getCreatedAt())
                .build();
    }

    public static List<MemoryResponse> toResponseList(List<Memory> memories) {
        return memories.stream()
                .map(MemoryMapper::toResponse)
                .collect(Collectors.toList());
    }
}
