#!/usr/bin/env sh
. /secret/.env

MONGODB_INDEXES_FILE=mongodb_indexes_B.js

docker exec "$(docker ps -aqf 'name=mongodb')" \
  mongosh "mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@mongodb:27017/cvtool?authSource=admin" \
    < ${MONGODB_INDEXES_FILE}