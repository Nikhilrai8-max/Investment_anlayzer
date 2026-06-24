import { useMemo, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useResearch } from '../hooks/useResearch.js';
import SearchBar from '../components/SearchBar.jsx';
import DecisionCard from '../components/DecisionCard.jsx';
import ProgressTracker from '../components/ProgressTracker.jsx';
import TranscriptViewer from '../components/TranscriptViewer.jsx';
import DebatePanel from '../components/DebatePanel.jsx';
import SourcesPanel from '../components/SourcesPanel.jsx';
import { useQueryClient } from '@tanstack/react-query';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:4000';

export default function Dashboard() {
  const [company, setCompany] = useState('Tesla');
  const [state, setState] = useState(null);
  const [agentStatus, setAgentStatus] = useState([]);
  const [activeTab, setActiveTab] = useState('summary');
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading, error } = useResearch(
    (data) => setState(data.data),
    (err) => console.error(err)
  );

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socket.on('connect', () => console.log('connected socket')); 
    socket.on('agent_status', (payload) => {
      setAgentStatus((current) => {
        const next = current.filter((item) => item.agent !== payload.agent);
        return [...next, { agent: payload.agent, status: payload.status }];
      });
    });
    return () => socket.disconnect();
  }, []);

  const summary = useMemo(() => {
    if (!state) return null;
    return {
      decision: state.finalDecision?.decision,
      confidence: state.finalDecision?.confidence,
      score: state.finalDecision?.investmentScore,
      risk: state.finalDecision?.risk
    };
  }, [state]);

  const handleSearch = async (query) => {
    setCompany(query);
    setState(null);
    setAgentStatus([]);
    await mutateAsync(query);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        <SearchBar onSearch={handleSearch} loading={isLoading} />
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <DecisionCard {...summary} />
            <ProgressTracker status={agentStatus} />
          </div>
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white">Company Snapshot</h3>
              <p className="mt-4 text-slate-300">{state?.companyInfo?.summary || 'Search for a company to populate the analyst snapshot.'}</p>
            </div>
            <SourcesPanel sources={state?.sources || []} />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-white">Executive Summary</h3>
                <div className="text-slate-400 text-sm">{isLoading ? 'Running AI workflow…' : 'Ready'}</div>
              </div>
              <p className="mt-4 text-slate-300">{state?.companyInfo?.summary || 'The research summary will appear here after the workflow completes.'}</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white">Financial Analysis</h3>
                <div className="mt-3 text-slate-300 whitespace-pre-line">{state?.financialAnalysis?.financialSummary || 'Financial assessment will be displayed once available.'}</div>
              </div>
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white">News Analysis</h3>
                <div className="mt-3 text-slate-300 whitespace-pre-line">{state?.newsAnalysis?.newsSummary || 'News analysis will be displayed once available.'}</div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex flex-wrap items-center gap-3">
                <button className={`rounded-full px-4 py-2 text-sm ${activeTab === 'summary' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`} onClick={() => setActiveTab('summary')}>Executive Summary</button>
                <button className={`rounded-full px-4 py-2 text-sm ${activeTab === 'transcript' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`} onClick={() => setActiveTab('transcript')}>Agent Transcript</button>
                <button className={`rounded-full px-4 py-2 text-sm ${activeTab === 'debate' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`} onClick={() => setActiveTab('debate')}>Committee Debate</button>
                <button className={`rounded-full px-4 py-2 text-sm ${activeTab === 'sources' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`} onClick={() => setActiveTab('sources')}>Sources</button>
              </div>
              <div className="mt-6">
                {activeTab === 'summary' && (
                  <div className="space-y-4">
                    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
                      <h4 className="font-semibold text-white">Bull Case</h4>
                      <p className="mt-3 text-slate-300 whitespace-pre-line">{state?.bullCase?.bullSummary || 'Bull case will appear here.'}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
                      <h4 className="font-semibold text-white">Bear Case</h4>
                      <p className="mt-3 text-slate-300 whitespace-pre-line">{state?.bearCase?.bearSummary || 'Bear case will appear here.'}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
                      <h4 className="font-semibold text-white">Risk Assessment</h4>
                      <p className="mt-3 text-slate-300 whitespace-pre-line">{state?.riskAnalysis?.riskSummary || 'Risk assessment will appear here.'}</p>
                    </div>
                  </div>
                )}
                {activeTab === 'transcript' && <TranscriptViewer transcript={state?.transcript || []} />}
                {activeTab === 'debate' && <DebatePanel bullCase={state?.bullCase} bearCase={state?.bearCase} riskAnalysis={state?.riskAnalysis} committee={state?.finalDecision} />}
                {activeTab === 'sources' && <SourcesPanel sources={state?.sources || []} />}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white">Visualization Preview</h3>
              <div className="mt-4 grid gap-4">
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-slate-400 text-sm">Investment Score Gauge</p>
                  <p className="mt-3 text-4xl font-semibold text-white">{state?.finalDecision?.investmentScore ?? '--'}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-slate-400 text-sm">News Sentiment</p>
                  <p className="mt-3 text-4xl font-semibold text-white">{state?.newsAnalysis?.newsScore ?? '--'}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-slate-400 text-sm">Risk Score</p>
                  <p className="mt-3 text-4xl font-semibold text-white">{state?.riskAnalysis?.riskScore ?? '--'}</p>
                </div>
              </div>
            </div>
            <button
              className="w-full rounded-3xl bg-cyan-500 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={!state}
              onClick={async () => {
                const report = { company, companyInfo: state.companyInfo, financialAnalysis: state.financialAnalysis, newsAnalysis: state.newsAnalysis, bullCase: state.bullCase, bearCase: state.bearCase, riskAnalysis: state.riskAnalysis, finalDecision: state.finalDecision, sources: state.sources, transcript: state.transcript };
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/research/export`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ report })
                });
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = `AlphaLens-${company}-memo.pdf`;
                anchor.click();
                window.URL.revokeObjectURL(url);
              }}
            >
              Generate Investment Memo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
