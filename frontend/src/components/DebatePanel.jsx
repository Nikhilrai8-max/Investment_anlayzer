export default function DebatePanel({ bullCase, bearCase, riskAnalysis, committee }) {
  const panels = [
    { title: 'Bull Analyst', content: bullCase?.bullSummary || 'Waiting for bull case analysis.' },
    { title: 'Bear Analyst', content: bearCase?.bearSummary || 'Waiting for bear case analysis.' },
    { title: 'Risk Analyst', content: riskAnalysis?.riskSummary || 'Waiting for risk analysis.' },
    { title: 'Committee', content: committee?.summary || 'Waiting for committee conclusion.' }
  ];

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white">Committee Debate</h3>
      <div className="mt-4 space-y-4">
        {panels.map((panel) => (
          <div key={panel.title} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{panel.title}</h4>
            <p className="mt-3 text-slate-200 leading-7">{panel.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
