import { useState, useEffect } from 'react';
import { Box, Typography, Button, Sheet, IconButton } from '@mui/joy';
import { LogOut, Plus } from 'lucide-react';
import { api } from '../api/client';
import ServerInfoCard from './ServerInfoCard';
import BackupList from './BackupList';
import ProgressCard from './ProgressCard';
import NewBackupDialog from './NewBackupDialog';

export default function Dashboard({ onLogout }) {
  const [backups, setBackups] = useState([]);
  const [diskInfo, setDiskInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await api.get('/status.php');
      setIsBackupRunning(response.data.running);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await api.get('/list.php');
      setBackups(response.data.backups || []);
      setDiskInfo(response.data.disk || null);
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchData();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

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

      <ServerInfoCard backups={backups} diskInfo={diskInfo} loading={loading} />

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

      {isBackupRunning && <ProgressCard onFinish={() => fetchData(true)} />}

      <BackupList backups={backups} loading={loading} onRefresh={() => fetchData(true)} />

      <NewBackupDialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onStart={() => {
          setIsDialogOpen(false);
          setIsBackupRunning(true);
        }}
      />
    </Box>
  );
}
