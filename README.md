# AlphaLens AI

AlphaLens AI is a production-ready multi-agent investment research platform. Analysts can enter a company name, trigger a structured hedge-fund research workflow, and receive a transparent INVEST or PASS recommendation.

## Features

- Multi-agent workflow with Research, Financial, News, Bull, Bear, Risk, and Committee analysis
- Real-time agent execution status with Socket.IO
- Transcript logging for every AI interaction
- Investment recommendation dashboard with professional analytics UI
- PDF investment memo export
- Financial Modeling Prep and NewsAPI integrations
- Centralized AI calls via Groq LLM

## Tech Stack

- Frontend: React, Vite, TailwindCSS, React Query, Socket.IO Client
- Backend: Node.js, Express, Socket.IO, LangGraph, Groq API
- Data Sources: Financial Modeling Prep, NewsAPI, Yahoo Finance fallback




## Environment Setup

Create a `.env` file in `backend/` with:

```bash
GROQ_API_KEY=your_groq_api_key
FMP_API_KEY=your_financial_modeling_prep_key
NEWS_API_KEY=your_newsapi_key
FRONTEND_URL=http://localhost:5173
PORT=4000
```

Create `.env` in `frontend/` with:

```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

## Local Development

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```


## API Endpoints

- `POST /api/research/analyze` - run the full company research workflow
- `POST /api/research/export` - generate investment memo PDF
- `GET /api/health` - health check

## Notes

- All AI prompts and transcripts are logged for auditability
- The application is structured for production readiness with async/await, validation, modular services, and clean architecture
- Use real API keys for Financial Modeling Prep and NewsAPI
