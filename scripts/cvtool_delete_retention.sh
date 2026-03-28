#!/usr/bin/env sh
. /secret/.env

BACKUP_RETENTION_DATE="$(date --date='120 days ago' +'%Y-%m-%d')"
DATA_RETENTION_DATE="$(date --date='1 year ago' +'%Y-%m-%d')"
VOLUME_CVTOOL_BACKUP=/var/lib/docker/volumes/root_cvtool_backup/_data
VOLUME_MONGODB_BACKUP=/var/lib/docker/volumes/root_mongodb_backup/_data

docker exec "$(docker ps -aqf 'ancestor=bransom/cvtool-backend')" \
  sh -c " \
    wget http://127.0.0.1:${CONTROL_PORT}/applyDataRetention?retentionDate=${DATA_RETENTION_DATE} \
  "

rm -rf "${VOLUME_CVTOOL_BACKUP:?}/${BACKUP_RETENTION_DATE}"
rm -rf "${VOLUME_MONGODB_BACKUP:?}/${BACKUP_RETENTION_DATE}"

lftp -c " \
  set ftp:ssl-allow true \
  ; set ssl:verify-certificate no \
  ; open -u ${LFTP_USERNAME},${LFTP_PASSWORD} ${LFTP_HOST} \
    -e \" \
      rm -rf /cvtool/${BACKUP_RETENTION_DATE} \
      ; quit \
    \" \
  "
