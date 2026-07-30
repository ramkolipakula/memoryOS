package com.memoryos.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranscriptChunk {
    private int chunkId;
    private int startWord;
    private int endWord;
    private int startCharacter;
    private int endCharacter;
    private String content;
    private int estimatedTokens;
}
