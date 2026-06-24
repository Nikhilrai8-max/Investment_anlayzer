import { z } from 'zod';
import { eventEmitter } from '../socket.js';
import { buildInvestmentGraph } from '../graph/investment.graph.js';
import { fetchFinancialSymbols, fetchCompanyProfile, fetchIncomeStatement, fetchBalanceSheet, fetchCashFlow } from '../services/finance.service.js';
import { fetchNews, fetchYahooNewsFallback } from '../services/news.service.js';
import { generateCompletion } from '../config/llm.js';
import { createTranscriptEntry, normalizeSource } from '../utils/transcript.js';
import PDFDocument from 'pdfkit';

const analyzePayload = z.object({ company: z.string().min(2) });

function emitAgentStatus(agent, status) {
  eventEmitter.emit('agent_status', { agent, status, timestamp: new Date().toISOString() });
}

function addSource(sources, url, label, type) {
  sources.push(normalizeSource(url, label, type));
}

async function runAiAgent(agent, prompt, state) {
  emitAgentStatus(agent, 'running');

  const start = Date.now();
  const result = await generateCompletion(prompt, { maxTokens: 800, temperature: 0.2 });
  const executionTime = result.executionTime;

  const entry = createTranscriptEntry(agent, prompt, result.text, executionTime, result.tokenUsage);
  state.transcript = [...state.transcript, entry];

  emitAgentStatus(agent, 'completed');
  return result.text;
}

function buildCompanySummaryPrompt(company, profile, financialData, newsData) {
  return `You are a hedge fund research analyst. A user asked about the company ${company}.

Company profile:
${profile ? JSON.stringify(profile, null, 2) : 'No profile available.'}

Financial overview:
${financialData ? JSON.stringify(financialData, null, 2) : 'No financial data available.'}

Latest headlines:
${newsData?.map((item, index) => `${index + 1}. ${item.title} - ${item.source?.name || item.publisher || 'Unknown'}`).join('\n') || 'No news available.'}

Produce a concise company summary that includes:
- Business model
- Industry and sector
- Market position
- Growth thesis
- Key strategic strengths

Provide the summary in JSON with keys: companySummary, companyDetails.`;
}

function buildFinancialPrompt(company, profile, income, balance, cashFlow) {
  return `You are a finance analyst generating a quantitative and qualitative financial assessment for ${company}.

Use the provided data to estimate:
- Revenue growth
- Profitability
- Cash flow health
- Debt profile
- Margins
- Valuation commentary

Income statement data:
${JSON.stringify(income.slice(0, 5), null, 2)}

Balance sheet data:
${JSON.stringify(balance.slice(0, 5), null, 2)}

Cash flow statement data:
${JSON.stringify(cashFlow.slice(0, 5), null, 2)}

Output JSON with keys:
financialScore, financialSummary, scoreBreakdown.`;
}

function buildNewsPrompt(company, newsArticles) {
  return `You are a news sentiment analyst. Review the latest news articles for ${company} and provide:
- Overall sentiment score from -10 (very negative) to +10 (very positive)
- Top positive catalysts
- Top negative catalysts
- Significant news themes or risks

News articles:
${newsArticles.map((item, index) => `${index + 1}. Title: ${item.title}\nSource: ${item.source?.name || item.source || item.publisher}\nPublished: ${item.publishedAt || item.pubDate}\nUrl: ${item.url || item.link}\nDescription: ${item.description || item.summary}\n`).join('\n')}

Return JSON with keys: newsScore, newsSummary, positiveCatalysts, negativeCatalysts.`;
`;
}

function buildOpinionPrompt(company, priorAnalysis, tone) {
  return `You are a ${tone} analyst writing for an internal fund research memo on ${company}.

Review the prior analyses:
${JSON.stringify(priorAnalysis, null, 2)}

Provide top 5 reasons in list form, a concise confidence score from 0-100, and a short explanation.

Output JSON with keys: ${tone === 'Bull' ? 'bullReasons, confidence, bullSummary' : 'bearReasons, confidence, bearSummary'}.`;
`;
}

function buildRiskPrompt(company, priorAnalysis) {
  return `You are a risk analyst. Use the research, financial, and news analysis for ${company}.

Evaluate:
- competition
- regulatory threats
- economic sensitivity
- debt risk
- market risk

Provide a risk assessment and a numeric risk score from 0-100 where higher means greater risk.

Output JSON with keys: riskScore, riskSummary, riskDrivers.`;
`;
}

function buildCommitteePrompt(company, state) {
  return `You are an investment committee considering ${company}.

Review the research, financial, news, bull case, bear case, and risk analysis.

Based on all available information, deliver a final recommendation in JSON with keys:
- decision (INVEST or PASS)
- confidence (0-100)
- risk (LOW, MEDIUM, HIGH)
- investmentScore (0-100)
- summary

Use the following state:
${JSON.stringify(state, null, 2)}`;
`;
}

function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function analyzeCompany(req, res) {
  const parseResult = analyzePayload.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid request', details: parseResult.error.errors });
  }

  const { company } = parseResult.data;
  const state = {
    company,
    companyInfo: null,
    financialData: null,
    newsData: null,
    financialAnalysis: null,
    newsAnalysis: null,
    bullCase: null,
    bearCase: null,
    riskAnalysis: null,
    finalDecision: null,
    transcript: [],
    sources: []
  };

  try {
    emitAgentStatus('Research Agent', 'queued');
    emitAgentStatus('Financial Agent', 'queued');
    emitAgentStatus('News Agent', 'queued');
    emitAgentStatus('Bull Analyst', 'queued');
    emitAgentStatus('Bear Analyst', 'queued');
    emitAgentStatus('Risk Analyst', 'queued');
    emitAgentStatus('Investment Committee', 'queued');

    const symbols = await fetchFinancialSymbols(company);
    const symbol = symbols?.[0]?.symbol || null;
    const profile = symbol ? await fetchCompanyProfile(symbol) : null;
    state.companyInfo = profile;

    if (symbol) {
      addSource(state.sources, `https://financialmodelingprep.com/profile/${symbol}`, 'Financial Modeling Prep', 'financial');
    }

    const income = symbol ? await fetchIncomeStatement(symbol) : [];
    const balance = symbol ? await fetchBalanceSheet(symbol) : [];
    const cashFlow = symbol ? await fetchCashFlow(symbol) : [];
    state.financialData = {
      symbol,
      profile,
      income,
      balance,
      cashFlow
    };

    const newsArticles = await fetchNews(company).catch(async () => {
      const fallback = await fetchYahooNewsFallback(company);
      return fallback.map((item) => ({ title: item.title, url: item.link, source: { name: item.publisher }, publishedAt: item.pubDate, description: item.summary }));
    });
    state.newsData = newsArticles;

    addSource(state.sources, `https://newsapi.org`, 'NewsAPI', 'news');

    const graph = buildInvestmentGraph({
      executeAgent: async (agentName, currentState) => {
        if (agentName === 'Research Agent') {
          const prompt = buildCompanySummaryPrompt(company, profile, state.financialData, newsArticles);
          const text = await runAiAgent(agentName, prompt, state);
          const parsed = safeParseJson(text) || { companySummary: text, companyDetails: {} };
          state.companyInfo = { ...state.companyInfo, summary: parsed.companySummary, details: parsed.companyDetails };
          return state;
        }

        if (agentName === 'Financial Agent') {
          const prompt = buildFinancialPrompt(company, profile, income, balance, cashFlow);
          const text = await runAiAgent(agentName, prompt, state);
          const parsed = safeParseJson(text) || { financialSummary: text, financialScore: null, scoreBreakdown: {} };
          state.financialAnalysis = parsed;
          return state;
        }

        if (agentName === 'News Agent') {
          const prompt = buildNewsPrompt(company, newsArticles);
          const text = await runAiAgent(agentName, prompt, state);
          const parsed = safeParseJson(text) || { newsSummary: text, newsScore: null, positiveCatalysts: [], negativeCatalysts: [] };
          state.newsAnalysis = parsed;
          return state;
        }

        if (agentName === 'Bull Analyst') {
          const prompt = buildOpinionPrompt(company, { research: state.companyInfo, financial: state.financialAnalysis, news: state.newsAnalysis }, 'Bull');
          const text = await runAiAgent(agentName, prompt, state);
          const parsed = safeParseJson(text) || { bullSummary: text, bullReasons: [], confidence: null };
          state.bullCase = parsed;
          return state;
        }

        if (agentName === 'Bear Analyst') {
          const prompt = buildOpinionPrompt(company, { research: state.companyInfo, financial: state.financialAnalysis, news: state.newsAnalysis }, 'Bear');
          const text = await runAiAgent(agentName, prompt, state);
          const parsed = safeParseJson(text) || { bearSummary: text, bearReasons: [], confidence: null };
          state.bearCase = parsed;
          return state;
        }

        if (agentName === 'Risk Analyst') {
          const prompt = buildRiskPrompt(company, { research: state.companyInfo, financial: state.financialAnalysis, news: state.newsAnalysis, bull: state.bullCase, bear: state.bearCase });
          const text = await runAiAgent(agentName, prompt, state);
          const parsed = safeParseJson(text) || { riskSummary: text, riskScore: null, riskDrivers: [] };
          state.riskAnalysis = parsed;
          return state;
        }

        if (agentName === 'Investment Committee') {
          const prompt = buildCommitteePrompt(company, state);
          const text = await runAiAgent(agentName, prompt, state);
          const parsed = safeParseJson(text) || { decision: text.includes('INVEST') ? 'INVEST' : 'PASS', confidence: null, risk: 'MEDIUM', investmentScore: null, summary: text };
          state.finalDecision = parsed;
          return state;
        }

        return state;
      }
    });

    await graph.run(state);

    return res.json({ data: state });
  } catch (error) {
    console.error('AnalyzeCompany error:', error);
    return res.status(500).json({ error: 'Failed to analyze company', message: error.message });
  }
}

async function exportMemo(req, res) {
  const payloadSchema = z.object({ report: z.object({ company: z.string(), companyInfo: z.any(), financialAnalysis: z.any(), newsAnalysis: z.any(), bullCase: z.any(), bearCase: z.any(), riskAnalysis: z.any(), finalDecision: z.any(), sources: z.array(z.any()), transcript: z.array(z.any()) }) });
  const parseResult = payloadSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid report payload', details: parseResult.error.errors });
  }

  const { report } = parseResult.data;
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=AlphaLens-${report.company}-memo.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text(`AlphaLens AI Investment Memo`, { underline: true });
  doc.moveDown();
  doc.fontSize(14).text(`Company: ${report.company}`);
  doc.text(`Decision: ${report.finalDecision?.decision || 'N/A'}`);
  doc.text(`Confidence: ${report.finalDecision?.confidence || 'N/A'}`);
  doc.text(`Risk: ${report.finalDecision?.risk || 'N/A'}`);
  doc.moveDown();

  doc.fontSize(16).text('Executive Summary');
  doc.fontSize(12).text(report.companyInfo?.summary || 'No summary available.');
  doc.moveDown();

  doc.fontSize(16).text('Financial Analysis');
  doc.fontSize(12).text(report.financialAnalysis?.financialSummary || 'No analysis available.');
  doc.moveDown();

  doc.fontSize(16).text('Bull Case');
  doc.fontSize(12).text(report.bullCase?.bullSummary || 'No bull case available.');
  doc.moveDown();

  doc.fontSize(16).text('Bear Case');
  doc.fontSize(12).text(report.bearCase?.bearSummary || 'No bear case available.');
  doc.moveDown();

  doc.fontSize(16).text('Risk Analysis');
  doc.fontSize(12).text(report.riskAnalysis?.riskSummary || 'No risk analysis available.');
  doc.moveDown();

  doc.fontSize(16).text('Committee Decision');
  doc.fontSize(12).text(report.finalDecision?.summary || 'No committee decision available.');
  doc.moveDown();

  doc.fontSize(16).text('Sources');
  report.sources.forEach((source) => {
    doc.fontSize(12).text(`${source.label}: ${source.url}`);
  });
  doc.addPage();
  doc.fontSize(16).text('Transcript');
  report.transcript.forEach((entry) => {
    doc.fontSize(12).text(`${entry.timestamp} | ${entry.agent}`);
    doc.fontSize(10).text(`Prompt: ${entry.inputPrompt}`);
    doc.fontSize(10).text(`Response: ${entry.outputResponse}`);
    doc.fontSize(10).text(`Execution Time: ${entry.executionTime}s`);
    doc.moveDown(0.5);
  });

  doc.end();
}

export { analyzeCompany, exportMemo };