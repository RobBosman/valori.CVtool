#!/usr/bin/env sh

# Generate a cert for DH params (takes a long time!).
openssl dhparam -out dhparam.pem 4096