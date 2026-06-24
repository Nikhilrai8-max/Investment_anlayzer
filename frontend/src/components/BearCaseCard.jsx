export default function BearCaseCard({ bearCase }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white">Bear Case</h3>
      <p className="mt-4 text-slate-300 whitespace-pre-line">{bearCase?.bearSummary || 'Bear case will appear here once available.'}</p>
    </div>
  );
}
