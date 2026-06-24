export default function ProgressTracker({ status }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white">Agent Execution Status</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {status.map((item) => (
          <div key={item.agent} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="font-medium text-slate-100">{item.agent}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'completed' ? 'bg-emerald-500/15 text-emerald-300' : item.status === 'running' ? 'bg-amber-500/15 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
