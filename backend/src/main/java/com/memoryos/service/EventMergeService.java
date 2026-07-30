package com.memoryos.service;

import com.memoryos.dto.EventDto;
import java.util.List;

public interface EventMergeService {
    List<EventDto> mergeEvents(List<EventDto> events);
}
