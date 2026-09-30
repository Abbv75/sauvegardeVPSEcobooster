import { Table, Sheet, Typography, IconButton, Box } from '@mui/joy';
import { Download, Trash2 } from 'lucide-react';
import { api } from '../api/client';

export default function BackupList({ backups, loading, onRefresh }) {
  const handleDelete = async (filename) => {
    if (confirm(`Supprimer la sauvegarde ${filename} ?`)) {
      try {
        await api.delete(`/delete.php?file=${filename}`);
        onRefresh();
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleDownload = (filename) => {
    const token = sessionStorage.getItem('token');
    window.location.href = `${api.defaults.baseURL}/download.php?file=${filename}&token=${token}`;
  };

  if (loading) {
    return <Typography>Chargement...</Typography>;
  }

  if (backups.length === 0) {
    return (
      <Sheet variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 'md' }}>
        <Typography level="body-md">Aucune sauvegarde trouvée.</Typography>
      </Sheet>
    );
  }

  return (
    <Sheet variant="outlined" sx={{ borderRadius: 'md', overflow: 'hidden' }}>
      <Table hoverRow>
        <thead>
          <tr>
            <th>Nom du fichier</th>
            <th>Taille</th>
            <th>Date</th>
            <th style={{ width: 100, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {backups.map((b) => (
            <tr key={b.name}>
              <td>{b.name}</td>
              <td>{b.size}</td>
              <td>{new Date(b.date * 1000).toLocaleString('fr-FR')}</td>
              <td>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <IconButton size="sm" variant="soft" color="primary" onClick={() => handleDownload(b.name)}>
                    <Download size={16} />
                  </IconButton>
                  <IconButton size="sm" variant="soft" color="danger" onClick={() => handleDelete(b.name)}>
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
