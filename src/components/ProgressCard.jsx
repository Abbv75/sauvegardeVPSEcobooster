import { useState, useEffect } from 'react';
import { Card, Typography, LinearProgress, Box } from '@mui/joy';
import { api } from '../api/client';

export default function ProgressCard({ onFinish }) {
  const [status, setStatus] = useState({ percent: 0, step: 'Initialisation...' });

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await api.get('/status.php');
        if (response.data) {
          setStatus(response.data);
          if (!response.data.running) {
            clearInterval(interval);
            onFinish();
          }
        }
      } catch (err) {
        console.error('Erreur polling status', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <Card variant="outlined" sx={{ mb: 3, bgcolor: 'background.surface' }}>
      <Typography level="h6">⏳ Sauvegarde en cours...</Typography>
      <Typography level="body-sm" sx={{ mb: 1 }}>{status.step}</Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <LinearProgress determinate value={status.percent} sx={{ flex: 1 }} />
        <Typography level="body-xs" fontWeight="bold">{status.percent}%</Typography>
      </Box>
    </Card>
  );
}
