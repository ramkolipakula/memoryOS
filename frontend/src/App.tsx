import { useState } from 'react';
import {
  TranscriptResponse,
  ExtractionResponse,
  ProcessedEventDto,
  PipelineStage,
} from './types';
import { uploadAudio, extractEvents, processMemories } from './api/memoryApi';
import { PipelineStatus } from './components/PipelineStatus';
import { LiveMetricsSidebar } from './components/LiveMetricsSidebar';
import AudioUpload from './components/AudioUpload';
import TranscriptView from './components/TranscriptView';
import { TranscriptChunks } from './components/TranscriptChunks';
import { ExtractedEvents } from './components/ExtractedEvents';
import { DecisionTabs } from './components/DecisionTabs';
import { ChatSearch } from './components/ChatSearch';
import { Layout } from './components/Layout';

export default function App() {
  const [stage, setStage] = useState<PipelineStage>('idle');
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [extractionResult, setExtractionResult] = useState<ExtractionResponse | null>(null);
  const [rememberedEvents, setRememberedEvents] = useState<ProcessedEventDto[]>([]);
  const [forgottenEvents, setForgottenEvents] = useState<ProcessedEventDto[]>([]);

  // Loading states
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setStage('upload');
    setError(null);
    setUploadProgress(0);
    setTranscript(null);
    setExtractionResult(null);
    setRememberedEvents([]);
    setForgottenEvents([]);

    try {
      setStage('speech');
      const result = await uploadAudio(file, (progress) => {
        setUploadProgress(progress);
      });
      setTranscript(result);
      setStage('chunking');
      setUploadProgress(100);
    } catch (err: any) {
      setStage('error');
      setError(err.response?.data?.message || 'Failed to upload and transcribe audio.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleExtractEvents = async () => {
    if (!transcript) return;
    setIsExtracting(true);
    setStage('extraction');
    setError(null);

    try {
      const result = await extractEvents(transcript.transcript);
      setExtractionResult(result);
      setStage('merge'); // Indicate merge finished
    } catch (err: any) {
      setStage('error');
      setError(err.response?.data?.message || 'Failed to extract events.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleProcessMemories = async () => {
    if (!extractionResult?.mergedEvents || !transcript) return;
    setIsProcessing(true);
    setStage('decision');
    setError(null);

    try {
      const result = await processMemories(extractionResult.mergedEvents, transcript.transcript);
      setRememberedEvents(result.remembered);
      setForgottenEvents(result.forgotten);
      setStage('storage');
      
      // Simulate storage delay and move to search
      setTimeout(() => {
        setStage('search');
      }, 800);
    } catch (err: any) {
      setStage('error');
      setError(err.response?.data?.message || 'Failed to process memories.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getAvgLatency = () => {
    if (!extractionResult?.chunkResults?.length) return "0.0s";
    const sum = extractionResult.chunkResults.reduce((acc, c) => acc + (c.latencySec || 0), 0);
    return (sum / extractionResult.chunkResults.length).toFixed(1) + "s";
  };

  return (
    <Layout>
      {/* Header Section */}
      <section className="flex flex-col items-center text-center gap-sm pt-4">
        <h1 className="font-display text-display text-on-surface tracking-tighter">MemoryOS</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">AI-Powered Long-Term Memory Operating System</p>
      </section>

      {/* Horizontal Pipeline */}
      {stage !== 'idle' && (
          <PipelineStatus currentStage={stage} />
      )}

      {error && (
        <div className="mt-6 p-4 bg-error-container/20 border border-error/50 rounded-xl text-error flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          <p className="font-body-md text-body-md">{error}</p>
        </div>
      )}

      {/* Live Metrics */}
      {(transcript || isUploading) && (
        <LiveMetricsSidebar 
          chunksTotal={extractionResult?.metrics?.totalChunks || 0}
          chunksProcessed={extractionResult?.chunkResults?.length || 0}
          eventsFound={extractionResult?.mergedEvents?.length || 0}
          rememberedCount={rememberedEvents.length}
          forgottenCount={forgottenEvents.length}
          avgLatency={getAvgLatency()}
          totalLatency={extractionResult?.metrics?.totalSec ? `${extractionResult.metrics.totalSec.toFixed(1)}s` : "0.0s"}
          audioDuration={transcript?.duration}
        />
      )}

      {/* Workspaces */}
      <div className="flex flex-col gap-lg mt-8">
        <AudioUpload
          onUploadStart={handleUpload}
          uploadProgress={uploadProgress}
          isUploading={isUploading}
          disabled={isUploading}
        />

        <TranscriptView
          transcript={transcript}
          isLoading={isUploading}
          onExtractEvents={handleExtractEvents}
          extracting={isExtracting}
        />

        {extractionResult && (
          <div className="flex flex-col gap-lg animate-fade-in">
            <TranscriptChunks chunks={extractionResult.chunkResults} results={extractionResult.chunkResults} />
            
            <ExtractedEvents events={extractionResult.mergedEvents} />
            
            {stage !== 'extraction' && stage !== 'chunking' && rememberedEvents.length === 0 && (
              <div className="mt-4 flex flex-col md:flex-row gap-sm">
                <button
                  onClick={handleProcessMemories}
                  disabled={isProcessing}
                  className="flex-1 bg-primary text-on-primary font-label-md text-label-md py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[20px]">{isProcessing ? 'sync' : 'play_arrow'}</span>
                  {isProcessing ? 'Running Decision Engine...' : 'Run Decision Engine'}
                </button>
              </div>
            )}
          </div>
        )}

        {(rememberedEvents.length > 0 || forgottenEvents.length > 0) && (
          <div className="animate-fade-in">
            <DecisionTabs remembered={rememberedEvents} forgotten={forgottenEvents} />
          </div>
        )}

        {stage === 'search' && (
          <div className="animate-fade-in">
            <ChatSearch />
          </div>
        )}
      </div>
    </Layout>
  );
}
