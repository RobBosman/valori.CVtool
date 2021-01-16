#!/usr/bin/env sh

JAVA_HOME="/mnt/c/Program Files/Java/jdk-15.0.1"
HOSTNAME=localhost
KEYSTORE=keystore.p12
STORETYPE=PKCS12
STOREPASS=KeyStorePassword

# Create private+public key pair.
"${JAVA_HOME}/bin/keytool.exe" \
    -keystore ${KEYSTORE} \
    -storetype ${STORETYPE} \
    -storepass ${STOREPASS} \
    -genkeypair \
    -dname "CN=${HOSTNAME},OU=QA Consulting,O=Valori,L=Utrecht,ST=Utrecht,C=NL" \
    -ext "san=dns:${HOSTNAME},ip:127.0.0.1,ip:::1" \
    -keyalg RSA \
    -keysize 2048 \
    -sigalg SHA256withRSA \
    -validity 365

#keytool \
#    -keystore ${KEYSTORE} \
#    -storetype ${STORETYPE} \
#    -storepass ${STOREPASS} \
#    -list \
#    -rfc

# Convert to PEM.
openssl pkcs12 -in ${KEYSTORE} -nocerts -out ${HOSTNAME}-privkey-with-password.pem -passin pass:${STOREPASS} -passout pass:${STOREPASS}
openssl rsa -in ${HOSTNAME}-privkey-with-password.pem -out ${HOSTNAME}-privkey.pem -passin pass:${STOREPASS}
openssl pkcs12 -in ${KEYSTORE} -clcerts -nokeys -out ${HOSTNAME}-fullchain.pem -passin pass:${STOREPASS}
