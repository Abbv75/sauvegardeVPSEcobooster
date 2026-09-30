import { useState } from 'react';
import { Sheet, Typography, FormControl, FormLabel, Input, Button, Alert } from '@mui/joy';
import { Database } from 'lucide-react';
import { api } from '../api/client';

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/login.php', { password });
      sessionStorage.setItem('token', response.data.token);
      onLogin();
    } catch (err) {
      setError('Mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet
      sx={{
        width: 300,
        mx: 'auto',
        my: 4,
        py: 3,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRadius: 'sm',
        boxShadow: 'md',
      }}
      variant="outlined"
    >
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <Database size={48} color="#1a73e8" />
        <Typography level="h4" component="h1">
          SauvegardeVPS
        </Typography>
        <Typography level="body-sm">EcoBooster</Typography>
      </div>

      {error && <Alert color="danger">{error}</Alert>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormControl>
          <FormLabel>Mot de passe maitre</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </FormControl>

        <Button type="submit" sx={{ mt: 1 }} loading={loading}>
          Se connecter
        </Button>
      </form>
    </Sheet>
  );
}
