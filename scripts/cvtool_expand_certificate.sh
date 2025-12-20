#!/usr/bin/env sh

docker run --rm \
  --name certbot \
  --mount source=root_letsencrypt_certs,target=/etc/letsencrypt \
  --mount source=root_letsencrypt_webroot,target=/data/letsencrypt \
  --mount source=root_letsencrypt_logs,target=/var/log/letsencrypt \
  --mount source=root_letsencrypt_var,target=/var/lib/letsencrypt \
  certbot/certbot \
  certonly \
  --expand \
  --webroot \
  --webroot-path=/data/letsencrypt \
  --agree-tos \
  -d cvtool.cerios.nl \
  -d cvtool.valori.nl
