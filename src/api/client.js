import axios from 'axios';

// En mode développement local (Vite), les appels vers /api iront vers le proxy si configuré,
// sinon vers l'URL absolue.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

export function setupAxiosInterceptors(onUnauthorized) {
  api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        onUnauthorized();
      }
      return Promise.reject(error);
    }
  );
}
