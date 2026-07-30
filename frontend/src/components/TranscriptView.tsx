import { TranscriptResponse } from '../types';

interface TranscriptViewProps {
  transcript: TranscriptResponse | null;
  isLoading: boolean;
  onExtractEvents: () => void;
  extracting: boolean;
}

export default function TranscriptView({ transcript, isLoading, onExtractEvents, extracting }: TranscriptViewProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-fade-in" id="transcript-section">
        <h2 className="section-title">
          <span className="text-2xl">📝</span>
          Transcript
        </h2>
        <div className="space-y-3">
          <div className="h-4 animate-shimmer rounded-lg w-full" />
          <div className="h-4 animate-shimmer rounded-lg w-5/6" />
          <div className="h-4 animate-shimmer rounded-lg w-4/6" />
          <div className="h-4 animate-shimmer rounded-lg w-3/4" />
        </div>
      </div>
    );
  }

  if (!transcript) return null;

  return (
    <div className="glass-card p-6 animate-slide-up" id="transcript-section">
      <h2 className="section-title">
        <span className="text-2xl">📝</span>
        Transcript
      </h2>

      {/* Metadata */}
      <div className="flex gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-neural-700/60 rounded-lg">
          <span className="text-xs text-neural-400">Language</span>
          <span className="text-sm font-semibold text-synapse-400 uppercase">{transcript.language}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-neural-700/60 rounded-lg">
          <span className="text-xs text-neural-400">Duration</span>
          <span className="text-sm font-semibold text-neural-200">{transcript.duration}s</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-neural-700/60 rounded-lg">
          <span className="text-xs text-neural-400">Processing</span>
          <span className="text-sm font-semibold text-neural-200">{transcript.processingTime}s</span>
        </div>
      </div>

      {/* Transcript Text */}
      <div className="bg-neural-800/80 rounded-xl p-5 border border-neural-600/30 max-h-64 overflow-y-auto mb-5">
        <p className="text-neural-200 leading-relaxed text-sm whitespace-pre-wrap">
          {transcript.transcript}
        </p>
      </div>

      {/* Extract Events Button */}
      <button
        className="btn-primary w-full"
        onClick={onExtractEvents}
        disabled={extracting}
        id="extract-events-button"
      >
        {extracting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Extracting Events...
          </span>
        ) : (
          '🔍 Extract Events from Transcript'
        )}
      </button>
    </div>
  );
}
