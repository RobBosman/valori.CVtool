#!/usr/bin/env sh
. /secret/.env

MONGO_INDEXES_FILE=mongo_indexes.js

docker exec "$(docker ps -aqf 'name=mongo')" \
  mongo "mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@mongodb:27017/cvtool?authSource=admin" \
    < ${MONGO_INDEXES_FILE}