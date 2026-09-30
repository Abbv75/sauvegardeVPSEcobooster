<?php
require_once 'config.php';
require_once 'auth.php';

requireAuth();

// Lancer le script bash en arriere plan
exec('bash ' . BACKUP_SCRIPT . ' > /dev/null 2>&1 &');

echo json_encode(['started' => true]);
