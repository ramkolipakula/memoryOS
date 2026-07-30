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
      <section className="bg-surface-container rounded-xl border border-outline-variant p-md flex flex-col gap-md animate-fade-in">
        <div className="flex justify-between items-center border-b border-outline-variant pb-sm">
          <h3 className="font-label-md text-label-md text-primary uppercase tracking-wider">Live Transcript</h3>
          <div className="flex items-center gap-xs">
            <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
            <span className="font-mono-sm text-mono-sm text-on-surface-variant">Processing...</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-4 bg-surface-container-highest rounded animate-pulse w-full"></div>
          <div className="h-4 bg-surface-container-highest rounded animate-pulse w-5/6"></div>
          <div className="h-4 bg-surface-container-highest rounded animate-pulse w-4/6"></div>
        </div>
      </section>
    );
  }

  if (!transcript) return null;

  return (
    <section className="bg-surface-container rounded-xl border border-outline-variant p-md flex flex-col gap-md animate-slide-up">
      <div className="flex justify-between items-center border-b border-outline-variant pb-sm">
        <h3 className="font-label-md text-label-md text-primary uppercase tracking-wider">Live Transcript</h3>
        <div className="flex items-center gap-xs">
          <div className="w-2 h-2 rounded-full bg-tertiary"></div>
          <span className="font-mono-sm text-mono-sm text-on-surface-variant">Complete</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-md max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">
          {transcript.transcript}
        </p>
      </div>

      <div className="pt-sm border-t border-outline-variant">
        <button
          className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          onClick={onExtractEvents}
          disabled={extracting}
        >
          {extracting ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
              Parallelizing LLM Extraction...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">psychology</span>
              Extract Events
            </>
          )}
        </button>
      </div>
    </section>
  );
}
