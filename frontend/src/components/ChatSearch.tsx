import React, { useState } from 'react';

export function ChatSearch() {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string, meta?: any}[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        const currentQuery = query;
        setQuery('');
        setMessages(prev => [...prev, { role: 'user', content: currentQuery }]);
        setIsLoading(true);

        try {
            const res = await fetch(`http://localhost:8080/api/memory/search?q=${encodeURIComponent(currentQuery)}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, { 
                    role: 'ai', 
                    content: data.answer,
                    meta: { count: data.memories?.length || 0 }
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', content: "Failed to search memories." }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to search service." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex flex-col h-[600px] bg-surface-container rounded-xl border border-outline-variant overflow-hidden shadow-2xl mt-4">
            {/* Header */}
            <div className="h-16 border-b border-outline-variant bg-surface-container-low flex items-center justify-between px-md shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center border border-primary/30 shadow-inner">
                        <span className="material-symbols-outlined text-primary text-[18px]">neurology</span>
                    </div>
                    <div>
                        <h2 className="font-headline-md text-headline-md text-on-surface leading-tight">Neural Memory Search</h2>
                        <p className="font-label-md text-label-md text-primary mt-0.5">Vector + SQL Hybrid Engine</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-surface-variant/30 rounded-full border border-outline-variant">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
                    </span>
                    <span className="font-mono-sm text-[10px] text-tertiary tracking-widest uppercase">Connected</span>
                </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-md flex flex-col gap-6 custom-scrollbar bg-background/50">
                {messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center flex-col gap-4">
                        <span className="material-symbols-outlined text-[64px] text-outline-variant/30">forum</span>
                        <p className="font-body-md text-body-md text-on-surface-variant">Ask anything about your stored memories.</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-secondary-container border-secondary/30' 
                                : 'bg-primary border-primary/30'
                            }`}>
                                <span className={`material-symbols-outlined text-[16px] ${
                                    msg.role === 'user' ? 'text-on-secondary-container' : 'text-on-primary'
                                }`}>
                                    {msg.role === 'user' ? 'person' : 'neurology'}
                                </span>
                            </div>
                            
                            {/* Message Bubble */}
                            <div className="flex flex-col gap-2">
                                <div className={`p-4 text-sm leading-relaxed ${
                                    msg.role === 'user' 
                                    ? 'bg-secondary-container text-on-secondary-container rounded-2xl rounded-tr-sm border border-secondary/20 shadow-md' 
                                    : 'bg-surface-container text-on-surface rounded-2xl rounded-tl-sm border border-outline-variant shadow-md'
                                }`}>
                                    {msg.content}
                                </div>
                                {msg.meta && (
                                    <div className="flex items-center gap-2 font-mono-sm text-[10px] text-on-surface-variant uppercase ml-2">
                                        <span className="material-symbols-outlined text-[12px] text-tertiary">database</span>
                                        Found {msg.meta.count} Context References
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                
                {isLoading && (
                    <div className="flex gap-4 self-start max-w-[85%]">
                        <div className="w-8 h-8 rounded-full bg-primary border-primary/30 flex items-center justify-center shrink-0 border shadow-sm">
                            <span className="material-symbols-outlined text-[16px] text-on-primary">neurology</span>
                        </div>
                        <div className="p-4 bg-surface-container text-on-surface rounded-2xl rounded-tl-sm border border-outline-variant shadow-md flex gap-2 items-center h-[52px]">
                            <div className="w-2 h-2 bg-on-surface-variant/50 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-on-surface-variant/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-on-surface-variant/50 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-md bg-surface-container border-t border-outline-variant shrink-0">
                <form onSubmit={handleSearch} className="relative flex items-center">
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask about your memories..."
                        className="w-full bg-background border border-outline focus:border-primary text-on-surface rounded-full pl-6 pr-14 py-4 focus:outline-none transition-all placeholder:text-on-surface-variant font-body-md text-body-md shadow-inner"
                    />
                    <button 
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="absolute right-2 w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-all shadow-md active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[18px]">send</span>
                    </button>
                </form>
                <div className="flex justify-center mt-3 gap-6 font-mono-sm text-[10px] text-on-surface-variant uppercase">
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">lock</span>
                        Private Engine
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">speed</span>
                        Sub-second Latency
                    </span>
                </div>
            </div>
        </section>
    );
}
