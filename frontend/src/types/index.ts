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
  | 'uploading'
  | 'transcribing'
  | 'extracting'
  | 'deciding'
  | 'complete'
  | 'error';
