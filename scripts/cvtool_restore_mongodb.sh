#!/usr/bin/env sh
. /secret/.env

RESTORE_DATE="$(date --date='yesterday' +'%Y-%m-%d')"

docker exec "$(docker ps -aqf 'name=mongo')" \
  mongorestore --uri="mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@mongodb:27017/cvtool?authSource=admin" \
  --drop --preserveUUID --gzip "/backup/${RESTORE_DATE}"
