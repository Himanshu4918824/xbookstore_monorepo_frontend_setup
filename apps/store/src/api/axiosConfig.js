import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // --- THIS IS THE FIX ---
      // The header must be "Token", not "Bearer", to match your backend
      config.headers['Authorization'] = `Token ${token}`;
      // --- END OF FIX ---
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;