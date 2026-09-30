import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// En mode développement local (Vite), les appels vers /api iront vers le proxy si configuré,
// sinon vers l'URL absolue.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

export function setupAxiosInterceptors() {
  api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }
  );
}
