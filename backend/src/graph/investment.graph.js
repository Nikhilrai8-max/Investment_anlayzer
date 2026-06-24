// Lightweight local orchestrator used instead of an external `langgraph` package.
// Runs agents sequentially and returns the final state.
export function buildInvestmentGraph({ executeAgent }) {
  const nodes = [
    'Research Agent',
    'Financial Agent',
    'News Agent',
    'Bull Analyst',
    'Bear Analyst',
    'Risk Analyst',
    'Investment Committee'
  ];

  return {
    async run(initialState) {
      let state = initialState;
      for (const agentName of nodes) {
        try {
          // each agent is expected to update the shared `state` object
          const result = await executeAgent(agentName, state);
          if (result && typeof result === 'object') {
            state = result;
          }
        } catch (err) {
          console.error(`Error executing agent ${agentName}:`, err);
        }
      }
      return state;
    }
  };
}
