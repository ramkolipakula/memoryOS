package com.memoryos.service;

import com.memoryos.entity.Memory;
import java.util.List;

public interface MemorySearchStrategy {
    List<Memory> executeSearch(String query);
}
