export default function SourcesPanel({ sources }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white">Sources & Citations</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {sources?.map((source, index) => (
          <a key={`${source.label}-${index}`} href={source.url} target="_blank" rel="noreferrer" className="rounded-3xl border border-slate-800 bg-slate-950 p-4 transition hover:border-cyan-500/30">
            <p className="font-semibold text-white">{source.label}</p>
            <p className="mt-2 text-slate-400 text-sm truncate">{source.url}</p>
          </a>
        ))}
        {!sources?.length && <p className="text-slate-400">Sources will appear here once analysis completes.</p>}
      </div>
    </div>
  );
}
