<?php
require_once dirname(__DIR__) . '/public/api/config.php';
require_once dirname(__DIR__) . '/public/api/auth.php';

$filename = $argv[1] ?? null;
if (!$filename) die("Missing filename\n");

// Token valide 7 jours pour ce fichier specifique
$payload = [
    'iat' => time(),
    'exp' => time() + (7 * 24 * 3600),
    'file' => $filename,
    'role' => 'download'
];
$token = createJWT($payload, JWT_SECRET);
$link = "https://sauvegarde.chauffy-mali.com/api/download.php?file=" . urlencode($filename) . "&token=" . $token;

$to = "ecobooster@gmail.com";
$subject = "Nouvelle sauvegarde VPS disponible !";
$body = "Bonjour,\n\nUne nouvelle sauvegarde de votre VPS est prete.\nFichier : $filename\n\nVous pouvez la telecharger directement en cliquant sur ce lien (valide 7 jours) :\n\n$link\n\nCordialement,\nLe serveur VPS EcoBooster";

// Call python mailer
$subjectArg = escapeshellarg($subject);
$bodyArg = escapeshellarg($body);
$toArg = escapeshellarg($to);

exec("python3 " . __DIR__ . "/mailer.py $toArg $subjectArg $bodyArg", $output, $return_var);
if ($return_var === 0) {
    echo "Email envoye avec succes a $to\n";
} else {
    echo "Erreur lors de l'envoi de l'email : " . implode("\n", $output) . "\n";
}
