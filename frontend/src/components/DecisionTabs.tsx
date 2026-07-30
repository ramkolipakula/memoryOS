import React, { useState } from 'react';

export function DecisionTabs({ remembered, forgotten }: { remembered: any[], forgotten: any[] }) {
    const [activeTab, setActiveTab] = useState<'remembered' | 'forgotten'>('remembered');

    if (!remembered?.length && !forgotten?.length) return null;

    return (
        <div className="w-full mt-4">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">psychology</span>
                Memory Decision Engine
            </h2>
            
            <div className="flex border-b border-outline-variant mb-6 w-full">
                <button
                    onClick={() => setActiveTab('remembered')}
                    className={`flex-1 py-3 px-2 text-center border-b-2 cursor-pointer font-label-md text-label-md uppercase tracking-wider transition-colors whitespace-nowrap ${
                        activeTab === 'remembered'
                        ? 'border-tertiary text-tertiary'
                        : 'border-transparent text-on-surface-variant hover:text-on-surface'
                    }`}
                >
                    Remembered ({remembered?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab('forgotten')}
                    className={`flex-1 py-3 px-2 text-center border-b-2 cursor-pointer font-label-md text-label-md uppercase tracking-wider transition-colors whitespace-nowrap ${
                        activeTab === 'forgotten'
                        ? 'border-outline text-on-surface'
                        : 'border-transparent text-on-surface-variant hover:text-on-surface'
                    }`}
                >
                    Forgotten ({forgotten?.length || 0})
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTab === 'remembered' && remembered?.map((event, idx) => (
                    <DecisionCard key={idx} event={event} isRemembered={true} />
                ))}
                
                {activeTab === 'forgotten' && forgotten?.map((event, idx) => (
                    <DecisionCard key={idx} event={event} isRemembered={false} />
                ))}
            </div>
        </div>
    );
}

function DecisionCard({ event, isRemembered }: { event: any, isRemembered: boolean }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`rounded-lg border p-4 relative overflow-hidden transition-colors ${
            isRemembered 
            ? 'bg-surface-container border-tertiary/30 hover:border-tertiary/60' 
            : 'bg-surface-container-lowest border-outline-variant/50 hover:border-outline-variant'
        }`}>
            {/* Status Indicator */}
            <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full pointer-events-none ${
                isRemembered ? 'bg-tertiary/10' : 'bg-outline-variant/10'
            }`}></div>
            <span className={`absolute top-2 right-2 material-symbols-outlined text-[20px] ${
                isRemembered ? 'text-tertiary' : 'text-on-surface-variant'
            }`}>
                {isRemembered ? 'check_circle' : 'cancel'}
            </span>

            <div 
                className="flex flex-col gap-1 pr-6 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex justify-between items-center mb-1 pr-2">
                    <span className="font-mono-sm text-xs text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">{event.type}</span>
                    <span className={`font-headline-md text-headline-md ${isRemembered ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                        {event.score}/10
                    </span>
                </div>
                <h3 className="font-body-md font-bold text-on-surface mt-1">{event.title || 'Untitled Event'}</h3>
                
                <div className="flex items-center gap-1 text-primary mt-2">
                    <span className="font-label-md text-label-md">View Reasoning</span>
                    <span className="material-symbols-outlined text-[16px] transition-transform duration-300" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>expand_more</span>
                </div>
            </div>

            <div className={`reasoning-content ${expanded ? 'open' : ''}`}>
                <div className="reasoning-inner">
                    <div className="mt-3 pt-3 border-t border-outline-variant/30 flex flex-col gap-2">
                        <p className="font-body-sm text-xs text-on-surface-variant italic leading-relaxed">
                            "{event.reason}"
                        </p>
                        <div className="flex items-center justify-between mt-2 font-mono-sm text-[10px] uppercase text-on-surface-variant/70">
                            <span>Status</span>
                            {isRemembered ? (
                                <span className="text-tertiary">Saved to Vector DB</span>
                            ) : (
                                <span>Discarded</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
