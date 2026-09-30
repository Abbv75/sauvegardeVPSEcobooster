import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: !!sessionStorage.getItem('token'),
  token: sessionStorage.getItem('token') || null,
  login: (token) => {
    sessionStorage.setItem('token', token);
    set({ isAuthenticated: true, token });
  },
  logout: () => {
    sessionStorage.removeItem('token');
    set({ isAuthenticated: false, token: null });
  },
}));
