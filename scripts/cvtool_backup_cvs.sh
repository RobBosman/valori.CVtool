#!/usr/bin/sh
. /secret/.env

BACKUP_DATE="$(date +'%Y-%m-%d')"\
DOCKER_CONTAINER="$(docker ps -aqf 'ancestor=bransom/cvtool')"

docker exec ${DOCKER_CONTAINER} \
    mkdir -p /backup/${BACKUP_DATE}

docker exec ${DOCKER_CONTAINER} \
    wget http://localhost:${CONTROL_PORT}/all-docx.zip -q -P /backup/${BACKUP_DATE}

lftp -c "\
    set ftp:ssl-allow true ;\
    set ssl:verify-certificate no ;\
    open -u ${LFTP_USERNAME},${LFTP_PASSWORD} ${LFTP_HOST} \
      -e \" \
        mirror -R /var/lib/docker/volumes/root_cvtool_backup/_data/${BACKUP_DATE} /cvtool/${BACKUP_DATE} ;\
        quit \
        \" \
    "
