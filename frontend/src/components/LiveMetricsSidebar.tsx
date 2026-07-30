import React from 'react';

interface LiveMetricsProps {
    chunksTotal: number;
    chunksProcessed: number;
    eventsFound: number;
    rememberedCount: number;
    forgottenCount: number;
    avgLatency: string;
    totalLatency: string;
    audioDuration?: number;
}

export function LiveMetricsSidebar({
    chunksTotal,
    chunksProcessed,
    eventsFound,
    rememberedCount,
    forgottenCount,
    avgLatency,
    totalLatency,
    audioDuration = 0
}: LiveMetricsProps) {
    return (
        <section className="grid grid-cols-2 md:grid-cols-3 gap-sm mt-8 w-full">
            <div className="bg-surface-container rounded-lg border border-outline-variant p-sm flex flex-col gap-xs">
                <span className="font-label-md text-label-md text-on-surface-variant">Audio</span>
                <span className="font-headline-md text-headline-md text-on-surface">{audioDuration} sec</span>
            </div>
            <div className="bg-surface-container rounded-lg border border-outline-variant p-sm flex flex-col gap-xs">
                <span className="font-label-md text-label-md text-on-surface-variant">Chunks</span>
                <span className="font-headline-md text-headline-md text-on-surface">{chunksProcessed} / {chunksTotal}</span>
            </div>
            <div className="bg-surface-container rounded-lg border border-outline-variant p-sm flex flex-col gap-xs">
                <span className="font-label-md text-label-md text-on-surface-variant">Events</span>
                <span className="font-headline-md text-headline-md text-on-surface">{eventsFound}</span>
            </div>
            <div className="bg-surface-container rounded-lg border border-outline-variant p-sm flex flex-col gap-xs">
                <span className="font-label-md text-label-md text-on-surface-variant">Remembered</span>
                <span className="font-headline-md text-headline-md text-tertiary">{rememberedCount}</span>
            </div>
            <div className="bg-surface-container rounded-lg border border-outline-variant p-sm flex flex-col gap-xs">
                <span className="font-label-md text-label-md text-on-surface-variant">Forgotten</span>
                <span className="font-headline-md text-headline-md text-outline">{forgottenCount}</span>
            </div>
            <div className="bg-surface-container rounded-lg border border-outline-variant p-sm flex flex-col gap-xs">
                <span className="font-label-md text-label-md text-on-surface-variant">Pipeline Time</span>
                <span className="font-headline-md text-headline-md text-primary">{totalLatency}</span>
            </div>
        </section>
    );
}
