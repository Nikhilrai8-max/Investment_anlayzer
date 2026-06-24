export default function NewsCard({ newsAnalysis }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white">News Analysis</h3>
      <p className="mt-4 text-slate-300 whitespace-pre-line">{newsAnalysis?.newsSummary || 'News sentiment will appear here after analysis.'}</p>
    </div>
  );
}
