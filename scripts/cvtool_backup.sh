#!/bin/sh

BACKUP_DATE="$(date +'%Y-%m-%d')"

docker exec -it \
    "$(docker ps -aqf 'name=mongo')" \
    mongodump --out=/backup/${BACKUP_DATE} --gzip --uri=mongodb://root:MongoPassword@mongodb:27017/cvtool?authSource=admin

lftp -c "\
    set ftp:ssl-allow true ;\
    set ssl:verify-certificate no ;\
    open -u VCV01,WYenU7hKxnet3vyD 157.97.115.138 \
      -e \" \
        mirror -R /var/lib/docker/volumes/root_mongodb_backup/_data/${BACKUP_DATE} /cvtool/${BACKUP_DATE} ;\
        quit \
        \" \
    "
