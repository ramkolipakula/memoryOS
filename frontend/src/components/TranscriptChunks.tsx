import React, { useState } from 'react';

export function TranscriptChunks({ chunks, results }: { chunks: any[], results: any[] }) {
    if (!chunks || chunks.length === 0) return null;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-headline-md text-headline-md text-on-surface">Transcript Chunks</h2>
                <span className="font-mono-sm text-mono-sm text-primary px-2 py-1 bg-primary/10 rounded-full border border-primary/20">
                    {chunks.length} Total
                </span>
            </div>
            <div className="flex flex-col gap-2">
                {chunks.map((chunk) => {
                    const result = results?.find(r => r.chunkId === chunk.chunkId);
                    return <ChunkCard key={chunk.chunkId} chunk={chunk} result={result} />;
                })}
            </div>
        </div>
    );
}

function ChunkCard({ chunk, result }: { chunk: any, result: any }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`bg-surface-container border rounded-lg transition-all duration-300
            ${result ? 'border-outline-variant' : 'border-primary active-pulse'}
        `}>
            <div 
                className="p-3 cursor-pointer select-none relative overflow-hidden"
                onClick={() => setExpanded(!expanded)}
            >
                {!result && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>
                )}
                
                <div className="flex justify-between items-center mb-2 relative z-10">
                    <div className="flex items-center gap-3">
                        <span className="font-mono-sm text-xs text-primary">Chunk {chunk.chunkId}</span>
                        <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                            <span>{chunk.estimatedTokens || Math.floor((chunk.content?.length || chunk.chunkContent?.length || 0)/4)} tokens</span>
                            {result && <span>{result.latencySec}s</span>}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {result ? (
                            <>
                                <span className="font-mono-sm text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                                    {result.eventCount} EVENTS
                                </span>
                                <span className="font-mono-sm text-[10px] text-tertiary bg-tertiary/10 px-2 py-0.5 rounded border border-tertiary/20 uppercase">
                                    {result.status}
                                </span>
                            </>
                        ) : (
                            <span className="font-mono-sm text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded flex items-center gap-1 border border-primary/20">
                                <span className="material-symbols-outlined text-[10px] animate-spin-slow">autorenew</span> EXTRACTING
                            </span>
                        )}
                        <span className="material-symbols-outlined text-on-surface-variant text-[20px] transition-transform duration-300" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                            expand_more
                        </span>
                    </div>
                </div>
                
                <p className="font-body-md text-sm text-on-surface relative z-10 line-clamp-2">
                    {chunk.content || chunk.chunkContent}
                </p>
            </div>

            {expanded && (
                <div className="p-4 border-t border-outline-variant bg-surface-container-lowest">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <h4 className="font-label-md text-xs uppercase text-on-surface-variant">Raw Transcript</h4>
                            <div className="bg-black border border-outline-variant rounded-lg p-3 text-sm text-on-surface max-h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed custom-scrollbar">
                                {chunk.content || chunk.chunkContent}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h4 className="font-label-md text-xs uppercase text-on-surface-variant">Groq JSON Response</h4>
                            <div className="bg-black border border-outline-variant rounded-lg p-3 text-xs text-primary max-h-64 overflow-y-auto font-mono whitespace-pre-wrap custom-scrollbar">
                                {result?.rawLlmResponse || "Waiting for LLM..."}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
