#!/usr/bin/env sh

VOLUME_SSL_CERTS=/var/lib/docker/volumes/root_ssl_certs/_data

docker run --rm \
  --name certbot \
  --mount source=root_ssl_certs,target=/etc/letsencrypt \
  --mount source=root_webroot,target=/data/letsencrypt \
  --mount source=root_letsencrypt_logs,target=/var/log/letsencrypt \
  --mount source=root_letsencrypt_var,target=/var/lib/letsencrypt \
  certbot/certbot \
  renew \
  --webroot \
  --webroot-path=/data/letsencrypt \
  --quiet

# Restart the CVtool frontend server only if the SSL certificate was renewed.
if [ "$(find ${VOLUME_SSL_CERTS} -name '*.pem' -mmin -5)" != "" ]; then
  docker container restart "$(docker ps -aqf 'ancestor=bransom/cvtool-frontend')"
fi
