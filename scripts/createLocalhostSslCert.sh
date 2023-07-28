#!/usr/bin/env sh

JAVA_HOME="/mnt/c/Program Files/Java/jdk-20.0.2+9"
HOSTNAME=localhost
KEYSIZE=2048
VALIDITY=3650
KEYSTORE=keystore.p12
STORETYPE=PKCS12
STOREPASS=KeyStorePassword
TARGET_DIR=../docker/letsencrypt_certs/live

# Create private+public key pair.
"${JAVA_HOME}/bin/keytool.exe" \
    -keystore ${KEYSTORE} \
    -storetype ${STORETYPE} \
    -storepass ${STOREPASS} \
    -genkeypair \
    -dname "CN=${HOSTNAME},OU=QA Consulting,O=Valori,L=Utrecht,ST=Utrecht,C=NL" \
    -ext "san=dns:${HOSTNAME},ip:127.0.0.1,ip:::1" \
    -keyalg RSA \
    -keysize ${KEYSIZE} \
    -sigalg SHA256withRSA \
    -validity ${VALIDITY}

#"${JAVA_HOME}/bin/keytool.exe" \
#    -keystore ${KEYSTORE} \
#    -storetype ${STORETYPE} \
#    -storepass ${STOREPASS} \
#    -list \
#    -rfc

# Convert to PEM.
openssl pkcs12 -in ${KEYSTORE} -nocerts -out ${HOSTNAME}-privkey-with-password.pem -passin pass:${STOREPASS} -passout pass:${STOREPASS}
openssl rsa -in ${HOSTNAME}-privkey-with-password.pem -out ${TARGET_DIR}/${HOSTNAME}/privkey.pem -passin pass:${STOREPASS}
openssl pkcs12 -in ${KEYSTORE} -clcerts -nokeys -out ${TARGET_DIR}/${HOSTNAME}/fullchain.pem -passin pass:${STOREPASS}

rm ${KEYSTORE} ${HOSTNAME}-privkey-with-password.pem
echo New certs for ${HOSTNAME} are stored in ${TARGET_DIR}/${HOSTNAME}