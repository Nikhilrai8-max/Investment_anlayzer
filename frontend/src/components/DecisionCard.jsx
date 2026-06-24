export default function DecisionCard({ decision, confidence, score, risk }) {
  const badge = decision === 'INVEST' ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30' : 'bg-rose-500/15 text-rose-200 border-rose-500/30';

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badge}`}>{decision || 'PENDING'}</span>
          <h2 className="mt-4 text-2xl font-semibold text-white">Final Recommendation</h2>
          <p className="mt-2 text-slate-400">Confidence and risk summary from the investment committee.</p>
        </div>
        <div className="text-right">
          <p className="text-5xl font-semibold text-white">{confidence != null ? `${confidence}%` : '--'}</p>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Confidence</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-slate-400 text-sm">Investment Score</p>
          <p className="mt-2 text-3xl font-semibold text-white">{score ?? '--'}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-slate-400 text-sm">Risk Level</p>
          <p className="mt-2 text-3xl font-semibold text-white">{risk || '--'}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-slate-400 text-sm">Decision</p>
          <p className="mt-2 text-3xl font-semibold text-white">{decision || '--'}</p>
        </div>
      </div>
    </div>
  );
}
