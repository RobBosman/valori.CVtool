@ECHO OFF

SET HOSTNAME=localhost
SET KEYSTORE=keystore.p12
SET STORETYPE=PKCS12
SET STOREPASS=KeyStorePassword

:: Create private key
keytool ^
    -keystore %KEYSTORE% ^
    -storetype %STORETYPE% ^
    -storepass %STOREPASS% ^
    -genkeypair ^
    -dname "CN=%HOSTNAME%,OU=QA Consulting,O=Valori,L=Utrecht,ST=Utrecht,C=NL" ^
    -ext "san=dns:%HOSTNAME%,ip:127.0.0.1,ip:::1" ^
    -keyalg RSA ^
    -keysize 2048 ^
    -sigalg SHA256withRSA ^
    -validity 90

::keytool ^
::    -keystore %KEYSTORE% ^
::    -storetype %STORETYPE% ^
::    -storepass %STOREPASS% ^
::    -list ^
::    -rfc

openssl pkcs12 -in keystore.p12 -nocerts -nodes -out localhost-privkey.pem
openssl pkcs12 -in keystore.p12 -clcerts -nokeys -out localhost-fullchain.pem
