<?php
require_once 'config.php';
require_once 'auth.php';

requireAuth();

$backups = [];
if (is_dir(BACKUP_DIR)) {
    $files = glob(BACKUP_DIR . '/backup_*.tar.gz');
    foreach ($files as $file) {
        $size = filesize($file);
        
        $sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        $i = $size > 0 ? floor(log($size) / log(1024)) : 0;
        $formattedSize = number_format($size / pow(1024, $i), 2) . ' ' . $sizes[$i];

        $backups[] = [
            'name' => basename($file),
            'size' => $formattedSize,
            'sizeBytes' => $size,
            'date' => filemtime($file)
        ];
    }
}

// Tri par date decroissante
usort($backups, function($a, $b) {
    return $b['date'] - $a['date'];
});

// Info disque
$total = disk_total_space("/");
$free = disk_free_space("/");
$used = $total - $free;

$diskInfo = [
    'total' => formatSize($total),
    'used' => formatSize($used),
    'free' => formatSize($free),
    'percent' => round(($used / $total) * 100, 2)
];

function formatSize($bytes) {
    $sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    $i = $bytes > 0 ? floor(log($bytes) / log(1024)) : 0;
    return number_format($bytes / pow(1024, $i), 2) . ' ' . $sizes[$i];
}

echo json_encode([
    'backups' => $backups,
    'disk' => $diskInfo
]);
