<?php
define('MASTER_PASSWORD', 'Ecobooster@2026');
define('JWT_SECRET', 'ecobooster_jwt_secret_2026_super_secure_key');
define('BACKUP_DIR', '/var/backups/vps-ecobooster');
define('BACKUP_SCRIPT', '/var/www/sauvegarde/scripts/backup.sh');
define('MAX_BACKUPS', 5);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Content-Type: application/json');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
