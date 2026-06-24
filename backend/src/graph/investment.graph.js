import { createGraph } from 'langgraph';

export function buildInvestmentGraph({ executeAgent }) {
  return createGraph()
    .addState('company', null)
    .addState('companyInfo', null)
    .addState('financialData', null)
    .addState('newsData', null)
    .addState('financialAnalysis', null)
    .addState('newsAnalysis', null)
    .addState('bullCase', null)
    .addState('bearCase', null)
    .addState('riskAnalysis', null)
    .addState('finalDecision', null)
    .addState('transcript', [])
    .addState('sources', [])
    .addNode('researchAgent', async (state) => {
      return executeAgent('Research Agent', state);
    })
    .addNode('financialAgent', async (state) => {
      return executeAgent('Financial Agent', state);
    })
    .addNode('newsAgent', async (state) => {
      return executeAgent('News Agent', state);
    })
    .addNode('bullAgent', async (state) => {
      return executeAgent('Bull Analyst', state);
    })
    .addNode('bearAgent', async (state) => {
      return executeAgent('Bear Analyst', state);
    })
    .addNode('riskAgent', async (state) => {
      return executeAgent('Risk Analyst', state);
    })
    .addNode('committeeAgent', async (state) => {
      return executeAgent('Investment Committee', state);
    });
}
