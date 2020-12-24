#!/usr/bin/sh

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
    --quiet \
    && \
    docker container restart "$(docker ps -aqf 'ancestor=bransom/cvtool')"
