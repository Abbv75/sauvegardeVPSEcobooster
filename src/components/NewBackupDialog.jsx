import { useState } from 'react';
import { Modal, ModalDialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, Box } from '@mui/joy';
import { api } from '../api/client';

export default function NewBackupDialog({ open, onClose, onStart }) {
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      await api.post('/backup.php');
      onStart();
    } catch (err) {
      alert('Erreur lors du lancement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={!loading ? onClose : undefined}>
      <ModalDialog variant="outlined">
        <DialogTitle>Nouvelle Sauvegarde</DialogTitle>
        <DialogContent>
          Cette action va créer une archive complète du VPS.
          
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Checkbox checked disabled label="Fichiers sources (/var/www)" />
            <Checkbox checked disabled label="Bases de données MySQL" />
            <Checkbox checked disabled label="Configurations Apache & Supervisor" />
            <Checkbox checked={false} disabled label="Exclure vendor/ & node_modules (recommandé)" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStart} loading={loading}>Lancer</Button>
          <Button variant="plain" color="neutral" onClick={onClose} disabled={loading}>Annuler</Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
