export default function RiskCard({ riskAnalysis }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white">Risk Analysis</h3>
      <p className="mt-4 text-slate-300 whitespace-pre-line">{riskAnalysis?.riskSummary || 'Risk assessment will appear here once available.'}</p>
    </div>
  );
