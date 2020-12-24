#!/usr/bin/sh

. /secret/.env

BACKUP_DATE="$(date +'%Y-%m-%d')"

docker exec \
    "$(docker ps -aqf 'ancestor=mongo')" \
    mongodump --out=/backup/${BACKUP_DATE} --gzip --uri=mongodb://root:MongoPassword@mongodb:27017/cvtool?authSource=admin

lftp -c "\
    set ftp:ssl-allow true ;\
    set ssl:verify-certificate no ;\
    open -u ${LPTF_USER},${LPTF_PASSWORD} ${LPTF_HOST} \
      -e \" \
        mirror -R /var/lib/docker/volumes/root_mongodb_backup/_data/${BACKUP_DATE} /cvtool/${BACKUP_DATE} ;\
        quit \
        \" \
    "
