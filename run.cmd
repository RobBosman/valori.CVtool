@ECHO OFF

CALL secret\setenv.cmd
SET IMAGE_NAME=bransom/cvtool

::GOTO RUN_STANDALONE
GOTO BUILD_DOCKER
::GOTO RUN_DOCKER
::GOTO PUSH_DOCKER

:RUN_STANDALONE
java ^
    --illegal-access=warn ^
    -jar .\backend\target\backend-0.0.1-SNAPSHOT-fat.jar
GOTO EOF

:BUILD_DOCKER
docker build -t %IMAGE_NAME% .
GOTO EOF

:RUN_DOCKER
docker run ^
    --network="host" ^
    -p 80:80 ^
    -p 443:443 ^
    --mount source=webroot,target=/webroot ^
    --mount source=ssl_certs,target=/ssl_certs,readonly ^
    --env HTTPS_CONNECTION_STRING=%HTTPS_CONNECTION_STRING% ^
    --env AUTH_CONNECTION_STRING=%AUTH_CONNECTION_STRING% ^
    --env MONGO_CONNECTION_STRING=%MONGO_CONNECTION_STRING% ^
    --name %IMAGE_NAME% ^
    -d %IMAGE_NAME%
GOTO EOF

:PUSH_DOCKER
SET TAG_NAME=bransom/%IMAGE_NAME%:latest
::docker tag %IMAGE_NAME% %TAG_NAME%
docker push %TAG_NAME%
GOTO EOF

:EOF