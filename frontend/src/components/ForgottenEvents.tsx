import { ProcessedEventDto } from '../types';

interface ForgottenEventsProps {
  events: ProcessedEventDto[];
}

export default function ForgottenEvents({ events }: ForgottenEventsProps) {
  if (events.length === 0) return null;

  return (
    <div className="animate-slide-up" id="forgotten-events-section">
      <h2 className="section-title text-forget-400">
        <span className="text-2xl">🔴</span>
        Forgotten Events
        <span className="text-sm font-normal text-neural-400 ml-auto">{events.length} discarded</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event, idx) => (
          <div
            key={idx}
            className="forget-card p-5 animate-slide-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Score Badge */}
              <div className="score-badge low flex-shrink-0">
                {event.score}
              </div>

              <div className="flex-1 min-w-0">
                {/* Type Badge */}
                <span className="type-badge bg-forget-500/15 text-forget-400 border border-forget-500/25 mb-2 inline-block">
                  {event.type}
                </span>

                {/* Description */}
                <p className="text-neural-400 text-sm leading-relaxed mb-3">{event.description}</p>

                {/* Reason */}
                <div className="flex items-start gap-2 bg-forget-500/8 rounded-lg p-2.5">
                  <svg className="w-4 h-4 text-forget-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-forget-300/80 text-xs">{event.reason}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
