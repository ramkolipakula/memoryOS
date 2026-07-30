package com.memoryos.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "memories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Memory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String type;

    private String category;
    
    private String priority;

    private Integer importance;

    @Column(name = "event_date")
    private LocalDateTime eventDate;
    
    private String location;
    
    private String people;
    
    private String tags;

    @Column(columnDefinition = "TEXT")
    private String embedding;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
