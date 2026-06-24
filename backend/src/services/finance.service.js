import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FMP_API_KEY = process.env.FMP_API_KEY;

if (!FMP_API_KEY) {
  throw new Error('Missing FMP_API_KEY in environment variables.');
}

export async function fetchFinancialSymbols(query) {
  const url = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(query)}&limit=1&exchange=NASDAQ&apikey=${FMP_API_KEY}`;
  const response = await axios.get(url, { timeout: 20000 });
  return response.data || [];
}

export async function fetchCompanyProfile(symbol) {
  const url = `https://financialmodelingprep.com/api/v3/profile/${encodeURIComponent(symbol)}?apikey=${FMP_API_KEY}`;
  const response = await axios.get(url, { timeout: 20000 });
  return response.data?.[0] || null;
}

export async function fetchIncomeStatement(symbol) {
  const url = `https://financialmodelingprep.com/api/v3/income-statement/${encodeURIComponent(symbol)}?limit=5&apikey=${FMP_API_KEY}`;
  const response = await axios.get(url, { timeout: 20000 });
  return response.data || [];
}

export async function fetchBalanceSheet(symbol) {
  const url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${encodeURIComponent(symbol)}?limit=5&apikey=${FMP_API_KEY}`;
  const response = await axios.get(url, { timeout: 20000 });
  return response.data || [];
}

export async function fetchCashFlow(symbol) {
  const url = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${encodeURIComponent(symbol)}?limit=5&apikey=${FMP_API_KEY}`;
  const response = await axios.get(url, { timeout: 20000 });
  return response.data || [];
}
