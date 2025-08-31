#!/usr/bin/env sh
. /secret/.env

RESTORE_DATE="2025-08-30"

docker exec "$(docker ps -aqf 'name=mongodb')" \
  mongorestore --uri="mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@mongodb:27017/cvtool?authSource=admin" \
    --drop --preserveUUID --gzip "/c/backup/${RESTORE_DATE}/cvtool"