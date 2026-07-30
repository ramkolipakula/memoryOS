import axios, { AxiosProgressEvent } from 'axios';
import {
  TranscriptResponse,
  EventDto,
  ExtractionResponse,
  ProcessResponse,
  SearchResponse,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000, // 2 minutes — transcription can be slow
});

/**
 * Upload an audio file and receive the transcript.
 */
export async function uploadAudio(
  file: File,
  onProgress?: (progress: number) => void
): Promise<TranscriptResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<TranscriptResponse>('/audio/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event: AxiosProgressEvent) => {
      if (event.total && onProgress) {
        const percent = Math.round((event.loaded * 100) / event.total);
        onProgress(percent);
      }
    },
  });

  return response.data;
}

/**
 * Extract structured events from a transcript.
 */
export async function extractEvents(transcript: string): Promise<ExtractionResponse> {
  const response = await api.post<ExtractionResponse>('/events/extract', { transcript });
  return response.data;
}

/**
 * Process events through the Memory Decision Engine.
 */
export async function processMemories(
  events: EventDto[],
  transcript: string
): Promise<ProcessResponse> {
  const response = await api.post<ProcessResponse>('/memory/process', {
    events,
    transcript,
  });
  return response.data;
}

/**
 * Search stored memories using natural language.
 */
export async function searchMemories(query: string): Promise<SearchResponse> {
  const response = await api.get<SearchResponse>('/memory/search', {
    params: { q: query },
  });
  return response.data;
}
