import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.ai/v1/llm/generate';
const MODEL_NAME = 'llama-3.3-70b-versatile';

if (!GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY in environment variables.');
}

export async function generateCompletion(prompt, options = {}) {
  const USE_FAKE_LLM = process.env.USE_FAKE_LLM === 'true' || process.env.LLM_FALLBACK === 'true';

  // Developer stub mode: return deterministic, structured responses without calling the remote LLM.
  if (USE_FAKE_LLM) {
    const startTime = Date.now();
    const p = typeof prompt === 'string' ? prompt.toLowerCase() : String(prompt).toLowerCase();
    let role = 'assistant';
    if (p.includes('bull') || p.includes('bull case') || p.includes('bull analyst')) role = 'bull_analyst';
    else if (p.includes('bear') || p.includes('bear case') || p.includes('bear analyst')) role = 'bear_analyst';
    else if (p.includes('risk') || p.includes('risks')) role = 'risk_analyst';
    else if (p.includes('committee') || p.includes('investment committee')) role = 'committee';
    else if (p.includes('financial') || p.includes('income statement') || p.includes('balance sheet')) role = 'financial_analyst';
    else if (p.includes('news') || p.includes('headline') || p.includes('press')) role = 'news_analyst';
    else if (p.includes('summary') || p.includes('company summary')) role = 'research_analyst';

    const samples = {
      research_analyst: `Company summary: The company is a mid-sized tech firm with steady revenue growth and a strong balance sheet. Key catalysts include product launches and expanding margins. Key risks: competition and macro sensitivity.`,
      financial_analyst: `Financial analysis: Revenue grew 12% YoY, gross margin expanded to 48%, operating cash flow remains positive. Notable items: improving AR turnover and manageable capex.`,
      news_analyst: `News roundup: Recent headlines include strategic partnership announcement, analyst upgrade, and a minor regulatory inquiry (no material impact).` ,
      bull_analyst: `Bull case: Market share expansion from new products, operating leverage driving margin upside, potential multiple re-rating.`,
      bear_analyst: `Bear case: Slowing demand, margin compression from inflation, potential revenue recognition risks.`,
      risk_analyst: `Risk assessment: Key risks are supply-chain disruption, FX exposure, and elevated receivables. Mitigants: diversified suppliers and strong liquidity.`,
      committee: `Investment committee verdict: Recommend INVEST with conviction 6/10. Rationale: solid growth, manageable risk, favorable industry dynamics.`,
      assistant: `LLM stub response: Unable to reach remote LLM; returning a deterministic placeholder for development.`
    };

    const text = samples[role] || samples.assistant;
    const elapsed = (Date.now() - startTime) / 1000;
    return {
      text,
      tokenUsage: null,
      executionTime: elapsed,
      stub: true,
      role
    };
  }
  const payload = {
    model: MODEL_NAME,
    input: prompt,
    max_output_tokens: options.maxTokens || 700,
    temperature: typeof options.temperature === 'number' ? options.temperature : 0.2,
    top_p: 0.9
  };

  const startTime = Date.now();
  try {
    const response = await axios.post(GROQ_URL, payload, {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 45000
    });

    const elapsed = (Date.now() - startTime) / 1000;
    const output = response.data?.output?.[0]?.content || String(response.data || '');
    const tokenUsage = response.data?.usage ?? null;

    return {
      text: output.trim(),
      tokenUsage,
      executionTime: elapsed
    };
  } catch (err) {
    // Network or API error — fallback to a safe placeholder so the workflow continues during development.
    console.warn('LLM request failed:', err?.code || err?.message || err);
    const elapsed = (Date.now() - startTime) / 1000;
    const fallback = {
      fallback: true,
      message: `LLM unavailable (${err?.code || err?.message}). Returning fallback response.`,
      rawPrompt: typeof prompt === 'string' ? prompt.slice(0, 800) : String(prompt).slice(0, 800)
    };

    return {
      text: JSON.stringify(fallback),
      tokenUsage: null,
      executionTime: elapsed
    };
  }
}
