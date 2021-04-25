#!/usr/bin/env sh
. /secret/.env

RETENTION_DATE="$(date --date="120 days ago" +'%Y-%m-%d')"
VOLUME_CVTOOL_BACKUP=/var/lib/docker/volumes/root_cvtool_backup/_data
VOLUME_MONGODB_BACKUP=/var/lib/docker/volumes/root_mongodb_backup/_data

rm -rf ${VOLUME_CVTOOL_BACKUP}/${RETENTION_DATE}
rm -rf ${VOLUME_MONGODB_BACKUP}/${RETENTION_DATE}

lftp -c " \
  set ftp:ssl-allow true \
  ; set ssl:verify-certificate no \
  ; open -u ${LFTP_USERNAME},${LFTP_PASSWORD} ${LFTP_HOST} \
    -e \" \
      rm -rf /cvtool/${RETENTION_DATE} \
      ; quit \
    \" \
  "
