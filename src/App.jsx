import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { setupAxiosInterceptors } from './api/client';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setupAxiosInterceptors(() => setIsAuthenticated(false));
  }, []);

  return isAuthenticated ? (
    <Dashboard onLogout={() => {
      sessionStorage.removeItem('token');
      setIsAuthenticated(false);
    }} />
  ) : (
    <LoginPage onLogin={() => setIsAuthenticated(true)} />
  );
}

export default App;
