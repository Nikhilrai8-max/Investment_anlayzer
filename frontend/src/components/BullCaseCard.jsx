export default function BullCaseCard({ bullCase }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white">Bull Case</h3>
      <p className="mt-4 text-slate-300 whitespace-pre-line">{bullCase?.bullSummary || 'Bull case will appear here once available.'}</p>
    </div>
  );
}
