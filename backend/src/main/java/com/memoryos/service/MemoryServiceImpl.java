package com.memoryos.service;

import com.memoryos.dto.*;
import com.memoryos.entity.Memory;
import com.memoryos.repository.MemoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemoryServiceImpl implements MemoryService {

    private final MemoryDecisionService memoryDecisionService;
    private final MemoryRepository memoryRepository;

    @Override
    @Transactional
    public ProcessResponse processEvents(List<EventDto> events, String transcript) {
        log.info("Processing {} events through Memory Decision Engine", events.size());

        List<ProcessedEventDto> remembered = new ArrayList<>();
        List<ProcessedEventDto> forgotten = new ArrayList<>();

        for (EventDto event : events) {
            MemoryDecisionDto decision = memoryDecisionService.evaluate(event);

            ProcessedEventDto processedEvent = ProcessedEventDto.builder()
                    .type(event.getType())
                    .title(event.getTitle())
                    .description(event.getDescription())
                    .decision(decision.getDecision())
                    .score(decision.getScore())
                    .reason(decision.getReason())
                    .build();

            if ("REMEMBER".equals(decision.getDecision())) {
                Memory memory = Memory.builder()
                        .title(event.getTitle() != null ? event.getTitle() : event.getType() + " Event")
                        .type(event.getType())
                        .content(event.getDescription())
                        .importance(decision.getScore())
                        .build();

                Memory saved = memoryRepository.saveAndFlush(memory);
                log.info("Memory Saved\nID: {}\nTitle: {}\nCategory: {}", saved.getId(), saved.getTitle(), saved.getCategory());
                remembered.add(processedEvent);
            } else {
                log.debug("Forgotten event: {} - {}", event.getType(), decision.getReason());
                forgotten.add(processedEvent);
            }
        }

        log.info("Processing complete: {} remembered, {} forgotten", remembered.size(), forgotten.size());

        return ProcessResponse.builder()
                .remembered(remembered)
                .forgotten(forgotten)
                .totalEvents(events.size())
                .rememberedCount(remembered.size())
                .forgottenCount(forgotten.size())
                .build();
    }
}
