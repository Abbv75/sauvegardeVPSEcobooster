#!/bin/bash
BACKUP_DIR="/var/backups/vps-ecobooster"
STATUS_FILE="$BACKUP_DIR/.status.json"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
ARCHIVE="$BACKUP_DIR/backup_$DATE.tar.gz"
TMP_DIR="/tmp/backup_$DATE"
MAX_BACKUPS=5

mkdir -p "$TMP_DIR/sql" "$TMP_DIR/configs"

update_status() {
  echo "{\"running\":true,\"step\":\"$1\",\"percent\":$2,\"started_at\":\"$3\"}" > "$STATUS_FILE"
}

START=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Etape 1 -- Dump MySQL
update_status "Sauvegarde MySQL (1/4)" 10 "$START"
for DB in archimind chauffy delix yougoo; do
  mysqldump -u ecoboosterlink -p'ecoboosterlink@2026' "$DB" > "$TMP_DIR/sql/$DB.sql"
done

# Etape 2 -- Fichiers www (sans vendor/node_modules)
update_status "Sauvegarde fichiers sources (2/4)" 35 "$START"
tar czf "$TMP_DIR/www.tar.gz" \
  --exclude='*/vendor' \
  --exclude='*/node_modules' \
  --exclude='*/.git' \
  -C /var/www archimind chauffy-backend chauffy-dashboard delix-backend yougoo-global-backend

# Etape 3 -- Configs Apache + Supervisor
update_status "Sauvegarde configurations (3/4)" 75 "$START"
tar czf "$TMP_DIR/configs.tar.gz" -C /etc/apache2 sites-available -C /etc/supervisor conf.d

# Etape 4 -- Assemblage archive finale
update_status "Finalisation de l'archive (4/4)" 90 "$START"
tar czf "$ARCHIVE" -C /tmp "backup_$DATE"
rm -rf "$TMP_DIR"

# Nettoyage : garder seulement les 5 dernieres
ls -t "$BACKUP_DIR"/backup_*.tar.gz | tail -n +$((MAX_BACKUPS + 1)) | xargs rm -f 2>/dev/null

# Marquer comme termine
echo "{\"running\":false,\"step\":\"Termine\",\"percent\":100,\"file\":\"backup_$DATE.tar.gz\"}" > "$STATUS_FILE"
