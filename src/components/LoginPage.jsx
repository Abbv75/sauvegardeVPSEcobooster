import { useState } from 'react';
import { Sheet, Typography, FormControl, FormLabel, Input, Button, Alert } from '@mui/joy';
import { Database } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);

  const loginMutation = useMutation({
    mutationFn: (pwd) => api.post('/login.php', { password: pwd }),
    onSuccess: (response) => {
      login(response.data.token);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(password);
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

      {loginMutation.isError && <Alert color="danger">Mot de passe incorrect</Alert>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormControl>
          <FormLabel>Mot de passe maitre</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loginMutation.isPending}
          />
        </FormControl>

        <Button type="submit" sx={{ mt: 1 }} loading={loginMutation.isPending}>
          Se connecter
        </Button>
      </form>
    </Sheet>
  );
}
