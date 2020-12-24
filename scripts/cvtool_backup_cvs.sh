#!/usr/bin/sh
. /secret/.env

BACKUP_DATE="$(date +'%Y-%m-%d')"
BACKUP_FILE=all-docx.zip

docker exec "$(docker ps -aqf 'ancestor=bransom/cvtool')" \
    sh -c "\
        mkdir -p /backup/${BACKUP_DATE} \
        && rm -f /backup/${BACKUP_DATE}/${BACKUP_FILE} \
        && wget -P /backup/${BACKUP_DATE} http://localhost:${CONTROL_PORT}/${BACKUP_FILE} \
    "

lftp -c "\
    set ftp:ssl-allow true \
    ; set ssl:verify-certificate no \
    ; open -u ${LFTP_USERNAME},${LFTP_PASSWORD} ${LFTP_HOST} \
        -e \" \
        mirror -R /var/lib/docker/volumes/root_cvtool_backup/_data/${BACKUP_DATE} /cvtool/${BACKUP_DATE} \
        ; quit \
    \" \
    "
