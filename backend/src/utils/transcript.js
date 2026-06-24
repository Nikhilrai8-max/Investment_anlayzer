export function createTranscriptEntry(agent, prompt, response, executionTime, tokenUsage) {
  return {
    timestamp: new Date().toISOString(),
    agent,
    inputPrompt: prompt,
    outputResponse: response,
    executionTime,
    tokenUsage
  };
}

export function normalizeSource(url, label, type) {
  return {
    url,
    label,
    type
  };
}
