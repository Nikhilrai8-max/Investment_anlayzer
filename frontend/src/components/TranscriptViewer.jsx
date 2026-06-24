export default function TranscriptViewer({ transcript }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white">Agent Transcript</h3>
      <div className="mt-4 space-y-4 max-h-[520px] overflow-y-auto">
        {transcript?.map((entry, index) => (
          <div key={`${entry.agent}-${index}`} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-semibold text-white">{entry.agent}</p>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{new Date(entry.timestamp).toLocaleString()}</span>
            </div>
            <p className="mt-3 text-slate-300 text-sm"><span className="font-semibold text-slate-100">Prompt:</span> {entry.inputPrompt.slice(0, 180)}...</p>
            <p className="mt-2 text-slate-300 text-sm"><span className="font-semibold text-slate-100">Response:</span> {entry.outputResponse.slice(0, 220)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
