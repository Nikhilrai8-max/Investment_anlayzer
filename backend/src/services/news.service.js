import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const NEWS_API_KEY = process.env.NEWS_API_KEY;

if (!NEWS_API_KEY) {
  throw new Error('Missing NEWS_API_KEY in environment variables.');
}

export async function fetchNews(query) {
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=10&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
  const response = await axios.get(url, { timeout: 20000 });
  return response.data?.articles || [];
}

export async function fetchYahooNewsFallback(query) {
  const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=0&newsCount=10`;
  const response = await axios.get(url, { timeout: 20000 });
  return response.data?.news || [];
}
