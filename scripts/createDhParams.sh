#!/usr/bin/env sh

# Generate a cert for DH params (takes a long time!).
openssl dhparam -out ../docker/letsencrypt_certs/ssl-dhparams.pem 4096