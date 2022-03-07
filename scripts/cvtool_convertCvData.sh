#!/usr/bin/env sh
. /secret/.env

docker exec "$(docker ps -aqf 'ancestor=bransom/cvtool-backend')" \
  sh -c " \
    wget http://localhost:${CONTROL_PORT}/convertCvData -o convertCvData.json \
  "
