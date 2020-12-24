#!/usr/bin/sh

. /secret/.env

BACKUP_DATE="$(date +'%Y-%m-%d')"

docker exec \
    "$(docker ps -aqf 'ancestor=bransom/cvtool')" \
    mkdir -p /backup/${BACKUP_DATE} \
    curl http://127.0.0.1:88/all-docx --silent --output /backup/${BACKUP_DATE}/all-docx.zip

lftp -c "\
    set ftp:ssl-allow true ;\
    set ssl:verify-certificate no ;\
    open -u ${LPTF_USER},${LPTF_PASSWORD} ${LPTF_HOST} \
      -e \" \
        put /var/lib/docker/volumes/root_cvtool_backup/_data/${BACKUP_DATE}/all-cvs.zip /cvtool/${BACKUP_DATE} ;\
        quit \
        \" \
    "
