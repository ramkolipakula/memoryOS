package com.memoryos.controller;

import com.memoryos.dto.EventDto;
import com.memoryos.dto.ExtractRequest;
import com.memoryos.service.EventExtractionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventExtractionService eventExtractionService;

    @PostMapping("/extract")
    public ResponseEntity<List<EventDto>> extractEvents(@Valid @RequestBody ExtractRequest request) {
        log.info("Extracting events from transcript ({} characters)", request.getTranscript().length());
        List<EventDto> events = eventExtractionService.extractEvents(request.getTranscript());
        return ResponseEntity.ok(events);
    }
}
