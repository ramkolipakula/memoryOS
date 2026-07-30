package com.memoryos.repository;

import com.memoryos.entity.Memory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MemoryRepository extends JpaRepository<Memory, UUID> {

    List<Memory> findByTitleContainingIgnoreCase(String title);

    List<Memory> findByContentContainingIgnoreCase(String content);

    List<Memory> findTop20ByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String title, String content);

    /**
     * Find all memories ordered by creation date, newest first.
     */
    List<Memory> findAllByOrderByCreatedAtDesc();
}
