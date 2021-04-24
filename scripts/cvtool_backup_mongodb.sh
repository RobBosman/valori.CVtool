#!/usr/bin/env sh
. /secret/.env

BACKUP_DATE="$(date +'%Y-%m-%d')"
VOLUME_MONGODB_BACKUP=/var/lib/docker/volumes/root_mongodb_backup/_data

docker exec "$(docker ps -aqf 'name=mongo')" \
  mongodump --uri="mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@mongodb:27017/cvtool?authSource=admin" \
      --gzip --out="/backup/${BACKUP_DATE}"

lftp -c " \
    set ftp:ssl-allow true \
    ; set ssl:verify-certificate no \
    ; open -u ${LFTP_USERNAME},${LFTP_PASSWORD} ${LFTP_HOST} \
        -e \" \
            mirror -R ${VOLUME_MONGODB_BACKUP}/${BACKUP_DATE} /cvtool/${BACKUP_DATE} \
            ; quit \
        \" \
    "
