import { useState, useEffect } from 'react';
import { Box, Typography, Button, Sheet, IconButton } from '@mui/joy';
import { LogOut, Plus } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import ServerInfoCard from './ServerInfoCard';
import BackupList from './BackupList';
import ProgressCard from './ProgressCard';
import NewBackupDialog from './NewBackupDialog';

export default function Dashboard({ onLogout }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Polling du statut (toutes les 2s si en cours, sinon 10s)
  const { data: statusData } = useQuery({
    queryKey: ['status'],
    queryFn: async () => {
      const res = await api.get('/status.php');
      return res.data;
    },
    refetchInterval: (query) => (query?.state?.data?.running ? 2000 : 10000),
  });

  const isBackupRunning = statusData?.running || false;

  // Rafraichir la liste quand la sauvegarde se termine
  useEffect(() => {
    if (statusData && !statusData.running) {
      queryClient.invalidateQueries({ queryKey: ['list'] });
    }
  }, [statusData?.running, queryClient]);

  // Données de la liste
  const { data: listData, isLoading } = useQuery({
    queryKey: ['list'],
    queryFn: async () => {
      const res = await api.get('/list.php');
      return res.data;
    },
  });

  const backups = listData?.backups || [];
  const diskInfo = listData?.disk || null;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
      <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md', mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography level="h4">🗄️ SauvegardeVPS</Typography>
          <Typography level="body-sm">EcoBooster</Typography>
        </Box>
        <IconButton onClick={onLogout} color="neutral" variant="plain">
          <LogOut size={20} />
        </IconButton>
      </Sheet>

      <ServerInfoCard backups={backups} diskInfo={diskInfo} loading={isLoading} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 3 }}>
        <Typography level="body-md">⚡ Sauvegarde auto : chaque nuit à 02:00</Typography>
        <Button 
          startDecorator={<Plus />} 
          onClick={() => setIsDialogOpen(true)}
          disabled={isBackupRunning}
        >
          Nouvelle Sauvegarde
        </Button>
      </Box>

      {isBackupRunning && <ProgressCard status={statusData} />}

      <BackupList backups={backups} loading={isLoading} />

      <NewBackupDialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onStart={() => {
          setIsDialogOpen(false);
          // Forcer le rafraichissement immediat du statut
          queryClient.invalidateQueries({ queryKey: ['status'] });
        }}
      />
    </Box>
  );
}
