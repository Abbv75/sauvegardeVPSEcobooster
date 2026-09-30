<?php
require_once 'config.php';
require_once 'auth.php';

$data = json_decode(file_get_contents('php://input'), true);
$password = $data['password'] ?? '';

if ($password === MASTER_PASSWORD) {
    // Expiration dans 8h
    $payload = [
        'iat' => time(),
        'exp' => time() + (8 * 3600),
        'role' => 'admin'
    ];
    $token = createJWT($payload, JWT_SECRET);
    echo json_encode(['token' => $token]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Mot de passe incorrect']);
}
