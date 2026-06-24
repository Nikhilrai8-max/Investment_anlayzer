import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('Tesla');

  return (
    <div className="card p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-slate-400 text-sm uppercase tracking-[0.2em]">AlphaLens AI</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Investment Research Intelligence</h1>
          <p className="mt-2 text-slate-400 max-w-2xl">Enter a company name to run a multi-agent hedge fund research workflow, analyze financials, news, risks, and deliver a final INVEST or PASS recommendation.</p>
        </div>
        <div className="flex flex-col gap-3 w-full md:w-[480px]">
          <label className="text-slate-300 text-sm font-medium">Company name</label>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 focus:border-cyan-400"
              placeholder="e.g. Tesla"
            />
            <button
              className="inline-flex items-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
              onClick={() => onSearch(query)}
              disabled={loading || !query.trim()}
            >
              <Search className="mr-2 h-4 w-4" />
              Analyze
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
