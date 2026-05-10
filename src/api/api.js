// Consolidated API Service
const API_BASE = 'http://localhost:8000';

export const api = {
  // Existing Upload Functionality (matching App.jsx direct calls)
  uploadBid: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload file');
    return response.json();
  },

  // NEW: History Endpoints
  getHistory: async () => {
    const response = await fetch(`${API_BASE}/history`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
  },

  analyzeHistoryFile: async (filename) => {
    const response = await fetch(`${API_BASE}/history/${filename}/analyze`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to analyze history file');
    return response.json();
  },

  // NEW: Chat Endpoint
  chatWithAI: async (message, history) => {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history }),
    });
    if (!response.ok) throw new Error('Chat failed');
    const data = await response.json();
    return data.response;
  }
};
