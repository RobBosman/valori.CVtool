#!/usr/bin/sh
. /secret/.env

RESTORE_DATE="$(date --date='yesterday' +'%Y-%m-%d')"
BACKUP_FILE=all-docx.zip
VOLUME_MONGODB_BACKUP=/var/lib/docker/volumes/root_mongodb_backup

lftp -c "\
    set ftp:ssl-allow true \
    ; set ssl:verify-certificate no \
    ; open -u ${LFTP_USERNAME},${LFTP_PASSWORD} ${LFTP_HOST} \
        -e \" \
            mirror /cvtool/${RESTORE_DATE} ${VOLUME_MONGODB_BACKUP}/_data/${RESTORE_DATE} \
            ; quit \
        \" \
    "

mv ${VOLUME_MONGODB_BACKUP}/_data/${RESTORE_DATE}/${BACKUP_FILE} .
