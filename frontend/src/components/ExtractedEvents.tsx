import React from 'react';

export function ExtractedEvents({ events }: { events: any[] }) {
    if (!events || events.length === 0) return null;

    return (
        <div className="w-full mt-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline-md text-headline-md text-on-surface">Extracted Events</h2>
                <span className="font-mono-sm text-mono-sm text-tertiary px-2 py-1 bg-tertiary/10 rounded-full border border-tertiary/20">
                    {events.length} Merged
                </span>
            </div>
            
            <div className="flex flex-col gap-md pl-4 border-l border-outline-variant/50 ml-2">
                <div className="relative">
                    {events.map((event, idx) => (
                        <div key={idx} className="mb-6 relative">
                            <div className="absolute -left-[25px] mt-1 w-3 h-3 bg-tertiary rounded-full border-2 border-background"></div>
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-2 items-center">
                                    <span className="font-mono-sm text-[10px] text-tertiary uppercase">
                                        EXTRACTED {event.chunkOrigin !== undefined ? `• CHUNK ${event.chunkOrigin}` : ''}
                                    </span>
                                    <span className="font-mono-sm text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded">
                                        {event.type}
                                    </span>
                                </div>
                                <span className="font-body-md text-on-surface font-medium mt-1">
                                    {event.title || 'Untitled Event'}
                                </span>
                                <span className="font-body-sm text-xs text-on-surface-variant line-clamp-3 leading-relaxed mt-1">
                                    {event.description}
                                </span>
                                
                                <div className="flex items-center gap-4 mt-2">
                                    {event.confidence !== undefined && (
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${event.confidence > 0.8 ? 'bg-tertiary' : 'bg-primary'}`}></div>
                                            <span className="font-mono-sm text-[10px] text-on-surface-variant">
                                                {(event.confidence * 100).toFixed(0)}% Conf
                                            </span>
                                        </div>
                                    )}
                                    
                                    {event.estimatedImportance !== undefined && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[12px] text-primary">priority_high</span>
                                            <span className="font-mono-sm text-[10px] text-on-surface-variant">
                                                {event.estimatedImportance}/10 Priority
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
