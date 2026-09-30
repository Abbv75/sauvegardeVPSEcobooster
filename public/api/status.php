<?php
require_once 'config.php';
// Pas d'auth obligatoire pour le status car juste du polling, 
// mais c'est mieux  :
require_once 'auth.php';
requireAuth();

$statusFile = BACKUP_DIR . '/.status.json';

if (file_exists($statusFile)) {
    echo file_get_contents($statusFile);
} else {
    echo json_encode(['running' => false, 'step' => 'Aucune sauvegarde recente', 'percent' => 0]);
}
