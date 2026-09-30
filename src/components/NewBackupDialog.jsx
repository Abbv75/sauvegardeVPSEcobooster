import { Modal, ModalDialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, Box } from '@mui/joy';
import { useMutation } from '@tanstack/react-query';
import { api } from '../api/client';

export default function NewBackupDialog({ open, onClose, onStart }) {
  const backupMutation = useMutation({
    mutationFn: () => api.post('/backup.php'),
    onSuccess: () => {
      onStart();
    },
    onError: () => {
      alert('Erreur lors du lancement');
    }
  });

  return (
    <Modal open={open} onClose={!backupMutation.isPending ? onClose : undefined}>
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
          <Button onClick={() => backupMutation.mutate()} loading={backupMutation.isPending}>
            Lancer
          </Button>
          <Button variant="plain" color="neutral" onClick={onClose} disabled={backupMutation.isPending}>
            Annuler
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
