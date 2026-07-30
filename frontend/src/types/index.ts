export interface TranscriptResponse {
  transcript: string;
  language: string;
  duration: number;
  processingTime: number;
}

export interface EventDto {
  type: string;
  title?: string;
  description: string;
  chunkOrigin?: number;
  confidence?: number;
  estimatedImportance?: number;
}

export interface ChunkResult {
  chunkId: number;
  estimatedTokens: number;
  eventCount: number;
  status: string;
  latencySec: number;
  rawLlmResponse: string;
  chunkContent: string;
  events: EventDto[];
}

export interface ProcessMetrics {
  speechSec: number;
  chunkingMs: number;
  mergeMs: number;
  decisionMs: number;
  databaseMs: number;
  totalSec: number;
  totalChunks: number;
  duplicatesRemoved: number;
}

export interface ExtractionResponse {
  chunkResults: ChunkResult[];
  mergedEvents: EventDto[];
  metrics: ProcessMetrics;
}

export interface MemoryDecisionDto {
  decision: 'REMEMBER' | 'FORGET';
  score: number;
  reason: string;
}

export interface ProcessedEventDto {
  type: string;
  title?: string;
  description: string;
  decision: 'REMEMBER' | 'FORGET';
  score: number;
  reason: string;
}

export interface ProcessResponse {
  remembered: ProcessedEventDto[];
  forgotten: ProcessedEventDto[];
  totalEvents: number;
  rememberedCount: number;
  forgottenCount: number;
}

export interface MemoryResponse {
  id: string;
  title: string;
  type: string;
  description: string;
  score: number;
  decisionReason: string;
  createdAt: string;
}

export interface SearchResponse {
  answer: string;
  memories: MemoryResponse[];
  query: string;
}

export type PipelineStage = 
  | 'idle'
  | 'upload'
  | 'speech'
  | 'chunking'
  | 'extraction'
  | 'merge'
  | 'decision'
  | 'storage'
  | 'search'
  | 'error';
