import axios from 'axios';

const API_BASE_URL = 'http://13.235.94.159:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Get all IPOs
  getIpos: async () => {
    const response = await apiClient.get('/ipos');
    return response.data;
  },
  // Get single IPO
  getIpoDetails: async (id) => {
    const response = await apiClient.get(`/ipos/${id}`);
    return response.data;
  },
  // Get AI Summary
  getIpoSummary: async (id) => {
    const response = await apiClient.get(`/ipos/${id}/summary`);
    return response.data;
  },
  // Get Risk Score
  getIpoRisk: async (id) => {
    const response = await apiClient.get(`/ipos/${id}/risk`);
    return response.data;
  },
  // Compare IPOs
  compareIpos: async (ids) => {
    const response = await apiClient.post('/compare', { ids });
    return response.data;
  }
};