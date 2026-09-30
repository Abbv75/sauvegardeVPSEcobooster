import { useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { setupAxiosInterceptors } from './api/client';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}

export default App;
