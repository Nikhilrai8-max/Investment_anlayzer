import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FMP_API_KEY = process.env.FMP_API_KEY;

if (!FMP_API_KEY) {
  throw new Error('Missing FMP_API_KEY in environment variables.');
}

export async function fetchFinancialSymbols(query) {
  const url = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(query)}&limit=1&exchange=NASDAQ&apikey=${FMP_API_KEY}`;
  try {
    const response = await axios.get(url, { timeout: 20000 });
    return response.data || [];
  } catch (err) {
    console.warn('fetchFinancialSymbols error', err?.response?.status, err?.response?.data || err.message);
    // If the endpoint is forbidden (legacy or invalid key), return empty array and allow the workflow to continue
    return [];
  }
}

export async function fetchCompanyProfile(symbol) {
  const url = `https://financialmodelingprep.com/api/v3/profile/${encodeURIComponent(symbol)}?apikey=${FMP_API_KEY}`;
  try {
    const response = await axios.get(url, { timeout: 20000 });
    return response.data?.[0] || null;
  } catch (err) {
    console.warn('fetchCompanyProfile error', err?.response?.status, err?.response?.data || err.message);
    return null;
  }
}

export async function fetchIncomeStatement(symbol) {
  const url = `https://financialmodelingprep.com/api/v3/income-statement/${encodeURIComponent(symbol)}?limit=5&apikey=${FMP_API_KEY}`;
  try {
    const response = await axios.get(url, { timeout: 20000 });
    return response.data || [];
  } catch (err) {
    console.warn('fetchIncomeStatement error', err?.response?.status, err?.response?.data || err.message);
    return [];
  }
}

export async function fetchBalanceSheet(symbol) {
  const url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${encodeURIComponent(symbol)}?limit=5&apikey=${FMP_API_KEY}`;
  try {
    const response = await axios.get(url, { timeout: 20000 });
    return response.data || [];
  } catch (err) {
    console.warn('fetchBalanceSheet error', err?.response?.status, err?.response?.data || err.message);
    return [];
  }
}

export async function fetchCashFlow(symbol) {
  const url = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${encodeURIComponent(symbol)}?limit=5&apikey=${FMP_API_KEY}`;
  try {
    const response = await axios.get(url, { timeout: 20000 });
    return response.data || [];
  } catch (err) {
    console.warn('fetchCashFlow error', err?.response?.status, err?.response?.data || err.message);
    return [];
  }
}
