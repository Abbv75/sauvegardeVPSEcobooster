<?php
require_once 'config.php';
require_once 'auth.php';

requireAuth();

if (!isset($_GET['file'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Fichier manquant']));
}

$filename = basename($_GET['file']);
$filepath = BACKUP_DIR . '/' . $filename;

if (file_exists($filepath) && strpos($filename, 'backup_') === 0) {
    unlink($filepath);
    echo json_encode(['success' => true]);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Fichier introuvable']);
}
