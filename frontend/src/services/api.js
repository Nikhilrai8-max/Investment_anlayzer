import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export async function analyzeCompany(company) {
  const response = await axios.post(`${API_BASE}/research/analyze`, { company });
  return response.data;
}

export async function exportReport(report) {
  const response = await axios.post(`${API_BASE}/research/export`, { report }, { responseType: 'blob' });
  return response.data;
}
