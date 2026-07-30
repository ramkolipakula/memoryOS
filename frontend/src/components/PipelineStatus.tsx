import { PipelineStage } from '../types';

interface PipelineStatusProps {
  stage: PipelineStage;
}

const stages: { key: PipelineStage; label: string; icon: string }[] = [
  { key: 'uploading', label: 'Upload', icon: '📤' },
  { key: 'transcribing', label: 'Transcribe', icon: '🎙️' },
  { key: 'extracting', label: 'Extract', icon: '🔍' },
  { key: 'deciding', label: 'Decide', icon: '🧠' },
  { key: 'complete', label: 'Ready', icon: '✨' },
];

const stageOrder: PipelineStage[] = ['idle', 'uploading', 'transcribing', 'extracting', 'deciding', 'complete'];

export default function PipelineStatus({ stage }: PipelineStatusProps) {
  const currentIndex = stageOrder.indexOf(stage);

  return (
    <div className="glass-card p-6 mb-8 animate-fade-in">
      <div className="flex items-center justify-between">
        {stages.map((s, i) => {
          const stageIdx = stageOrder.indexOf(s.key);
          const isActive = stage === s.key;
          const isComplete = currentIndex > stageIdx;
          const isPending = currentIndex < stageIdx;

          return (
            <div key={s.key} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-lg
                    transition-all duration-500 relative
                    ${isComplete
                      ? 'bg-synapse-500/20 border-2 border-synapse-400'
                      : isActive
                        ? 'bg-synapse-500/30 border-2 border-synapse-400 animate-pulse-glow'
                        : 'bg-neural-700 border-2 border-neural-500'
                    }
                  `}
                >
                  {isComplete ? (
                    <svg className="w-5 h-5 text-synapse-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className={isActive ? '' : 'opacity-50'}>{s.icon}</span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-synapse-400 rounded-full animate-ping" />
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-semibold tracking-wider uppercase
                    ${isActive ? 'text-synapse-400' : isComplete ? 'text-neural-300' : 'text-neural-500'}
                  `}
                >
                  {s.label}
                </span>
              </div>

              {/* Connector line */}
              {i < stages.length - 1 && (
                <div className="flex-1 h-[2px] mx-3 mt-[-20px]">
                  <div
                    className={`
                      h-full rounded transition-all duration-700
                      ${isComplete ? 'bg-synapse-500/60' : 'bg-neural-600'}
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
