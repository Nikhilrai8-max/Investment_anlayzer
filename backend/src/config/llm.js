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
  const payload = {
    model: MODEL_NAME,
    input: prompt,
    max_output_tokens: options.maxTokens || 700,
    temperature: typeof options.temperature === 'number' ? options.temperature : 0.2,
    top_p: 0.9
  };

  const startTime = Date.now();
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
}
