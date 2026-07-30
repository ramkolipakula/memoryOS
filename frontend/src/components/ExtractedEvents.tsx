import { EventDto } from '../types';

interface ExtractedEventsProps {
  events: EventDto[] | null;
  isLoading: boolean;
  onProcessMemories: () => void;
  processing: boolean;
}

const typeColors: Record<string, string> = {
  'Assignment': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Deadline': 'bg-forget-500/20 text-forget-400 border-forget-500/30',
  'Meeting': 'bg-synapse-500/20 text-synapse-400 border-synapse-500/30',
  'Reminder': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Academic': 'bg-synapse-500/20 text-synapse-300 border-synapse-500/30',
  'Work': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Health': 'bg-remember-500/20 text-remember-400 border-remember-500/30',
  'Shopping': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Travel': 'bg-synapse-500/20 text-synapse-400 border-synapse-500/30',
  'Personal': 'bg-neural-500/30 text-neural-300 border-neural-500/30',
  'Casual Conversation': 'bg-neural-500/20 text-neural-400 border-neural-500/30',
  'Other': 'bg-neural-500/20 text-neural-400 border-neural-500/30',
};

export default function ExtractedEvents({ events, isLoading, onProcessMemories, processing }: ExtractedEventsProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-fade-in" id="extracted-events-section">
        <h2 className="section-title">
          <span className="text-2xl">🔍</span>
          Extracted Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-neural-700/40 rounded-xl p-5 border border-neural-600/20">
              <div className="h-5 animate-shimmer rounded w-24 mb-3" />
              <div className="h-4 animate-shimmer rounded w-3/4 mb-2" />
              <div className="h-4 animate-shimmer rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) return null;

  return (
    <div className="glass-card p-6 animate-slide-up" id="extracted-events-section">
      <h2 className="section-title">
        <span className="text-2xl">🔍</span>
        Extracted Events
        <span className="text-sm font-normal text-neural-400 ml-auto">{events.length} found</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {events.map((event, idx) => {
          const colorClass = typeColors[event.type] || typeColors['Other'];
          return (
            <div
              key={idx}
              className="bg-neural-700/30 rounded-xl p-5 border border-neural-600/20 hover:border-neural-400/30 transition-all animate-slide-up"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <span className={`type-badge border ${colorClass} mb-3 inline-block`}>
                {event.type}
              </span>
              {event.title && (
                <h3 className="text-neural-100 font-semibold text-sm mb-1">{event.title}</h3>
              )}
              <p className="text-neural-300 text-sm leading-relaxed">{event.description}</p>
            </div>
          );
        })}
      </div>

      <button
        className="btn-primary w-full"
        onClick={onProcessMemories}
        disabled={processing}
        id="process-memories-button"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Running Memory Decision Engine...
          </span>
        ) : (
          '🧠 Process Through Memory Decision Engine'
        )}
      </button>
    </div>
  );
}
