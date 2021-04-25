#!/usr/bin/env sh
. /secret/.env

MONGO_INDEXES_FILE=mongo_indexes.js
VOLUME_MONGODB_BACKUP=/var/lib/docker/volumes/valoricvtool_mongodb_backup/_data

cp ${MONGO_INDEXES_FILE} ${VOLUME_MONGODB_BACKUP}

docker exec "$(docker ps -aqf 'name=mongo')" \
  mongo "mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@mongodb:27017/cvtool?authSource=admin" \
    < /backup/mongo_indexes.js

rm -f ${VOLUME_MONGODB_BACKUP}/${MONGO_INDEXES_FILE}
