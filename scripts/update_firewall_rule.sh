#!/usr/bin/env sh

IP_NUMBER="$(host bransom.nl | grep address | sed -r 's/^.* ([0-9]+.[0-9]+.[0-9]+.[0-9]+).*$/\1/g')"
echo $IP_NUMBER

ufw allow from $IP_NUMBER to any port 22
ufw status numbered