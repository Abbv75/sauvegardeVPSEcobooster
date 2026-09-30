import { Card, Box, Typography, Skeleton } from '@mui/joy';
import { HardDrive, Archive, FileText } from 'lucide-react';

export default function ServerInfoCard({ backups, diskInfo, loading }) {
  const totalSize = backups.reduce((acc, b) => acc + b.sizeBytes, 0);
  
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        <HardDrive size={32} color="#1a73e8" />
        <Box>
          <Typography level="body-sm">Espace disque VPS</Typography>
          <Typography level="h4">
            {loading ? <Skeleton width={100} /> : `${diskInfo?.used || '?'} / ${diskInfo?.total || '?'}`}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        <Archive size={32} color="#1a73e8" />
        <Box>
          <Typography level="body-sm">Sauvegardes stockées</Typography>
          <Typography level="h4">
            {loading ? <Skeleton width={40} /> : backups.length}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        <FileText size={32} color="#1a73e8" />
        <Box>
          <Typography level="body-sm">Taille totale</Typography>
          <Typography level="h4">
            {loading ? <Skeleton width={80} /> : formatBytes(totalSize)}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
