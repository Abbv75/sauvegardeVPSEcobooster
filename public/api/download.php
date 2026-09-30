<?php
require_once 'config.php';
require_once 'auth.php';

// Le JWT pour le telechargement peut etre passe en GET 
if (isset($_GET['token'])) {
    if (!verifyJWT($_GET['token'], JWT_SECRET)) {
        http_response_code(401);
        die('Non autorise');
    }
} else {
    requireAuth();
}

if (!isset($_GET['file'])) {
    http_response_code(400);
    die('Fichier manquant');
}

$filename = basename($_GET['file']);
$filepath = BACKUP_DIR . '/' . $filename;

if (!file_exists($filepath) || strpos($filename, 'backup_') !== 0) {
    http_response_code(404);
    die('Fichier introuvable');
}

header('Content-Type: application/gzip');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Content-Length: ' . filesize($filepath));
readfile($filepath);
exit;
