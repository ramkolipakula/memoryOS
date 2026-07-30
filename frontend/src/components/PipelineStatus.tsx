import React from 'react';
import { PipelineStage } from '../types';

interface PipelineStatusProps {
    currentStage: PipelineStage;
}

export function PipelineStatus({ currentStage }: PipelineStatusProps) {
    const mainStages = [
        { id: 'listen', label: 'Listen', icon: 'mic', includes: ['upload', 'speech'] },
        { id: 'understand', label: 'Understand', icon: 'sync', includes: ['chunking', 'extraction', 'merge'] },
        { id: 'reason', label: 'Reason', icon: 'psychology', includes: ['decision'] },
        { id: 'remember', label: 'Remember', icon: 'database', includes: ['storage'] },
        { id: 'recall', label: 'Recall', icon: 'search', includes: ['search'] }
    ];

    const currentMainIndex = mainStages.findIndex(s => s.includes.includes(currentStage));
    const isError = currentStage === 'error';
    const isIdle = currentStage === 'idle';

    return (
        <section className="bg-surface-container rounded-xl border border-outline-variant p-md flex flex-col gap-md overflow-hidden">
            <div className="flex justify-between items-center">
                <h2 className="font-headline-md text-headline-md text-on-surface">Pipeline Lifecycle</h2>
                {isError ? (
                    <span className="font-mono-sm text-mono-sm text-error px-2 py-1 bg-error-container/20 rounded-full border border-error/30">Failed</span>
                ) : isIdle ? (
                    <span className="font-mono-sm text-mono-sm text-on-surface-variant px-2 py-1 bg-surface-variant/50 rounded-full border border-outline-variant">Standby</span>
                ) : (
                    <span className="font-mono-sm text-mono-sm text-primary px-2 py-1 bg-primary/10 rounded-full border border-primary/20">Active</span>
                )}
            </div>
            <div className="relative flex justify-between items-center mt-2 px-2">
                {/* Horizontal connecting line */}
                <div className="absolute left-6 right-6 top-4 h-[1px] bg-outline-variant z-0"></div>
                
                {mainStages.map((stage, idx) => {
                    const isCompleted = currentMainIndex > idx && !isError;
                    const isActive = currentMainIndex === idx && !isError;
                    const isPending = currentMainIndex < idx || isIdle;
                    const hasError = currentMainIndex === idx && isError;

                    return (
                        <div key={stage.id} className="flex flex-col items-center gap-xs z-10 w-16">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                                isCompleted ? 'bg-tertiary-container border-tertiary' :
                                isActive ? 'bg-primary-container border-primary running-glow' :
                                hasError ? 'bg-error-container border-error' :
                                'bg-surface-container-highest border-outline-variant'
                            }`}>
                                {isCompleted ? (
                                    <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">check</span>
                                ) : isActive ? (
                                    <span className="material-symbols-outlined text-[16px] text-on-primary-container animate-spin" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {stage.icon}
                                    </span>
                                ) : hasError ? (
                                    <span className="material-symbols-outlined text-[16px] text-on-error-container">error</span>
                                ) : (
                                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">{stage.icon}</span>
                                )}
                            </div>
                            <span className={`font-label-md text-label-md ${
                                isCompleted ? 'text-tertiary' :
                                isActive ? 'text-primary' :
                                hasError ? 'text-error' :
                                'text-on-surface-variant'
                            }`}>
                                {stage.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
