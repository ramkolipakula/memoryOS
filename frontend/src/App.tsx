import { useState } from 'react';
import {
  TranscriptResponse,
  EventDto,
  ProcessedEventDto,
  PipelineStage,
} from './types';
import { uploadAudio, extractEvents, processMemories } from './api/memoryApi';
import PipelineStatus from './components/PipelineStatus';
import AudioUpload from './components/AudioUpload';
import TranscriptView from './components/TranscriptView';
import ExtractedEvents from './components/ExtractedEvents';
import RememberedEvents from './components/RememberedEvents';
import ForgottenEvents from './components/ForgottenEvents';
import MemorySearch from './components/MemorySearch';

export default function App() {
  // Pipeline state
  const [stage, setStage] = useState<PipelineStage>('idle');
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [events, setEvents] = useState<EventDto[] | null>(null);
  const [rememberedEvents, setRememberedEvents] = useState<ProcessedEventDto[]>([]);
  const [forgottenEvents, setForgottenEvents] = useState<ProcessedEventDto[]>([]);

  // Loading states
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setStage('uploading');
    setError(null);
    setUploadProgress(0);

    // Reset downstream state
    setTranscript(null);
    setEvents(null);
    setRememberedEvents([]);
    setForgottenEvents([]);

    try {
      setStage('transcribing');
      const result = await uploadAudio(file, (progress) => {
        setUploadProgress(progress);
      });
      setTranscript(result);
      setStage('extracting');
      setUploadProgress(100);
    } catch (err: unknown) {
      setStage('error');
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || 'Failed to upload and transcribe audio.');
      } else {
        setError('Failed to upload and transcribe audio. Please check your connection.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleExtractEvents = async () => {
    if (!transcript) return;

    setIsExtracting(true);
    setStage('extracting');
    setError(null);

    try {
      const result = await extractEvents(transcript.transcript);
      setEvents(result);
    } catch (err: unknown) {
      setStage('error');
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || 'Failed to extract events.');
      } else {
        setError('Failed to extract events. Please try again.');
      }
    } finally {
      setIsExtracting(false);
    }
  };

  const handleProcessMemories = async () => {
    if (!events || !transcript) return;

    setIsProcessing(true);
    setStage('deciding');
    setError(null);

    try {
      const result = await processMemories(events, transcript.transcript);
      setRememberedEvents(result.remembered);
      setForgottenEvents(result.forgotten);
      setStage('complete');
    } catch (err: unknown) {
      setStage('error');
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || 'Failed to process memories.');
      } else {
        setError('Failed to process memories. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neural-900">
      {/* Background gradient accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-synapse-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-synapse-500/3 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-synapse-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-synapse-500/20">
              <span className="text-2xl">🧠</span>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-synapse-400 via-synapse-300 to-purple-400 bg-clip-text text-transparent">
                  MemoryOS
                </span>
              </h1>
              <p className="text-neural-400 text-xs font-medium tracking-widest uppercase">v0.1 — Intelligent Memory Pipeline</p>
            </div>
          </div>
          <p className="text-neural-400 max-w-lg mx-auto text-sm leading-relaxed">
            Upload audio recordings and let AI determine what information deserves to become long-term memory.
          </p>
        </header>

        {/* Pipeline Status */}
        {stage !== 'idle' && <PipelineStatus stage={stage} />}

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-forget-500/10 border border-forget-500/30 rounded-xl text-forget-400 animate-slide-up">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Main Pipeline Sections */}
        <div className="space-y-6">
          {/* Section 1: Audio Upload */}
          <AudioUpload
            onUploadStart={handleUpload}
            uploadProgress={uploadProgress}
            isUploading={isUploading}
            disabled={isUploading}
          />

          {/* Section 2: Transcript */}
          <TranscriptView
            transcript={transcript}
            isLoading={isUploading}
            onExtractEvents={handleExtractEvents}
            extracting={isExtracting}
          />

          {/* Section 3: Extracted Events */}
          <ExtractedEvents
            events={events}
            isLoading={isExtracting}
            onProcessMemories={handleProcessMemories}
            processing={isProcessing}
          />

          {/* Section 4 & 5: Decision Results */}
          {(rememberedEvents.length > 0 || forgottenEvents.length > 0) && (
            <div className="glass-card p-6 animate-slide-up">
              <h2 className="section-title mb-6">
                <span className="text-2xl">⚡</span>
                Memory Decision Results
                <span className="text-sm font-normal text-neural-400 ml-auto">
                  {rememberedEvents.length} remembered · {forgottenEvents.length} forgotten
                </span>
              </h2>

              <div className="space-y-8">
                <RememberedEvents events={rememberedEvents} />
                <ForgottenEvents events={forgottenEvents} />
              </div>
            </div>
          )}

          {/* Section 6: Memory Search */}
          <MemorySearch />
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 py-6 border-t border-neural-700/50">
          <p className="text-neural-500 text-xs">
            MemoryOS v0.1 — Built for Microsoft Imagine Cup
          </p>
        </footer>
      </div>
    </div>
  );
}
