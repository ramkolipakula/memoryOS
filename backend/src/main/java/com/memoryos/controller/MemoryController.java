package com.memoryos.controller;

import com.memoryos.dto.ProcessRequest;
import com.memoryos.dto.ProcessResponse;
import com.memoryos.dto.SearchResponse;
import com.memoryos.service.MemoryService;
import com.memoryos.service.MemorySearchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/memory")
@RequiredArgsConstructor
public class MemoryController {

    private final MemoryService memoryService;
    private final MemorySearchService memorySearchService;

    @PostMapping("/process")
    public ResponseEntity<ProcessResponse> processMemories(@Valid @RequestBody ProcessRequest request) {
        log.info("Processing {} events through Memory Decision Engine", request.getEvents().size());
        ProcessResponse response = memoryService.processEvents(request.getEvents(), request.getTranscript());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<SearchResponse> searchMemories(@RequestParam("q") String query) {
        log.info("Memory search query: '{}'", query);
        SearchResponse response = memorySearchService.search(query);
        return ResponseEntity.ok(response);
    }
}
