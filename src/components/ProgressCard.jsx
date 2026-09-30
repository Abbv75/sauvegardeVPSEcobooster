import { Card, Typography, LinearProgress, Box } from '@mui/joy';

export default function ProgressCard({ status }) {
  if (!status) return null;

  return (
    <Card variant="outlined" sx={{ mb: 3, bgcolor: 'background.surface' }}>
      <Typography level="h6">⏳ Sauvegarde en cours...</Typography>
      <Typography level="body-sm" sx={{ mb: 1 }}>{status.step || 'Initialisation...'}</Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <LinearProgress determinate value={status.percent || 0} sx={{ flex: 1 }} />
        <Typography level="body-xs" fontWeight="bold">{status.percent || 0}%</Typography>
      </Box>
    </Card>
  );
}
