# AlphaLens AI Architecture

## Overview

AlphaLens AI is designed as a full-stack research platform:

- Frontend: React dashboard with real-time agent execution and analytics
- Backend: Express API that orchestrates a LangGraph workflow
- AI: Groq LLM for multi-agent reasoning
- Data: Financial Modeling Prep, NewsAPI, Yahoo Finance fallback

## Workflow

1. User enters a company name in the React dashboard.
2. Frontend sends `POST /api/research/analyze` to backend.
3. Backend gathers company and financial data, and news.
4. Backend builds a LangGraph workflow with these agents:
   - Research Agent
   - Financial Agent
   - News Agent
   - Bull Analyst
   - Bear Analyst
   - Risk Analyst
   - Investment Committee
5. Each agent produces structured output and appends transcript entries.
6. Socket.IO streams agent status updates to the frontend in real time.
7. The frontend renders recommendation cards, debate panels, transcript logs, and source citations.
8. Users can export a PDF investment memo.

## State Model

- company
- companyInfo
- financialData
- newsData
- financialAnalysis
- newsAnalysis
- bullCase
- bearCase
- riskAnalysis
- finalDecision
- transcript
- sources

## Deployment

- Frontend: Vercel / static SPA hosting
- Backend: Railway, Render, or any Node.js runtime
