#!/usr/bin/sh
. /secret/.env

docker exec "$(docker ps -aqf 'name=mongo')" \
  mongo mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@mongodb:27017/cvtool?authSource=admin \
  --eval " var db = db.getSiblingDB('cvtool'); db.experience.createIndex({'$**':'text'}); db.skill.createIndex({'description.nl_NL':'text', 'description.uk_UK':'text'}); "
