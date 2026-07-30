import { useState } from 'react';
import { searchMemories } from '../api/memoryApi';
import { SearchResponse } from '../types';

export default function MemorySearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setSearching(true);
    setError(null);

    try {
      const response = await searchMemories(query.trim());
      setResult(response);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Search failed. Please try again.';
      setError(message);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !searching) {
      handleSearch();
    }
  };

  return (
    <div className="glass-card p-6 animate-slide-up" id="memory-search-section">
      <h2 className="section-title">
        <span className="text-2xl">🧠</span>
        Memory Retrieval
      </h2>

      <p className="text-neural-400 text-sm mb-5">
        Ask questions about your stored memories in natural language.
      </p>

      {/* Search Input */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neural-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='e.g. "When is my DBMS assignment due?"'
            className="w-full bg-neural-800 border border-neural-500/40 rounded-xl py-3.5 pl-12 pr-4 text-neural-100 placeholder-neural-500 focus:outline-none focus:border-synapse-400 focus:ring-1 focus:ring-synapse-400/30 transition-all text-sm"
            disabled={searching}
            id="memory-search-input"
          />
        </div>
        <button
          className="btn-primary flex-shrink-0"
          onClick={handleSearch}
          disabled={searching || !query.trim()}
          id="memory-search-button"
        >
          {searching ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            'Search'
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-forget-500/10 border border-forget-500/30 rounded-xl text-forget-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Search Results */}
      {result && (
        <div className="mt-6 animate-slide-up">
          {/* Answer */}
          <div className="bg-gradient-to-br from-synapse-500/10 to-purple-500/5 border border-synapse-500/30 rounded-xl p-5 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-synapse-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-lg">💡</span>
              </div>
              <div>
                <p className="text-xs text-synapse-400 font-semibold uppercase tracking-wider mb-1">Answer</p>
                <p className="text-neural-100 leading-relaxed">{result.answer}</p>
              </div>
            </div>
          </div>

          {/* Matched Memories */}
          {result.memories.length > 0 && (
            <div>
              <p className="text-neural-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Based on {result.memories.length} {result.memories.length === 1 ? 'memory' : 'memories'}
              </p>
              <div className="space-y-3">
                {result.memories.map((memory) => (
                  <div
                    key={memory.id}
                    className="bg-neural-700/30 border border-neural-600/20 rounded-xl p-4 hover:border-synapse-500/20 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="type-badge bg-synapse-500/15 text-synapse-400 border border-synapse-500/25 text-[10px]">
                        {memory.type}
                      </span>
                      <span className="text-neural-500 text-xs">Score: {memory.score}</span>
                    </div>
                    <h4 className="text-neural-100 font-medium text-sm">{memory.title}</h4>
                    <p className="text-neural-400 text-xs mt-1">{memory.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
