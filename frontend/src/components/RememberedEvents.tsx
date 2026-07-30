import { ProcessedEventDto } from '../types';

interface RememberedEventsProps {
  events: ProcessedEventDto[];
}

export default function RememberedEvents({ events }: RememberedEventsProps) {
  if (events.length === 0) return null;

  return (
    <div className="animate-slide-up" id="remembered-events-section">
      <h2 className="section-title text-remember-400">
        <span className="text-2xl">💚</span>
        Remembered Memories
        <span className="text-sm font-normal text-neural-400 ml-auto">{events.length} stored</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event, idx) => (
          <div
            key={idx}
            className="remember-card p-5 animate-slide-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Score Badge */}
              <div className="score-badge high flex-shrink-0">
                {event.score}
              </div>

              <div className="flex-1 min-w-0">
                {/* Type Badge */}
                <span className="type-badge bg-remember-500/20 text-remember-400 border border-remember-500/30 mb-2 inline-block">
                  {event.type}
                </span>

                {/* Title */}
                {event.title && (
                  <h3 className="text-neural-100 font-semibold text-sm mb-1">{event.title}</h3>
                )}

                {/* Description */}
                <p className="text-neural-300 text-sm leading-relaxed mb-3">{event.description}</p>

                {/* Reason */}
                <div className="flex items-start gap-2 bg-remember-500/8 rounded-lg p-2.5">
                  <svg className="w-4 h-4 text-remember-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-remember-300 text-xs">{event.reason}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
