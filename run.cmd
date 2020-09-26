@ECHO OFF

CALL setenv.cmd
SET IMAGE_NAME=cvtool

::GOTO RUN_STANDALONE
GOTO BUILD_DOCKER
::GOTO RUN_DOCKER
::GOTO PUSH_DOCKER

:RUN_STANDALONE
java ^
  --add-opens java.base/jdk.internal.misc=ALL-UNNAMED ^
  -Dio.netty.tryReflectionSetAccessible=true ^
  -jar .\backend\target\backend-0.0.1-SNAPSHOT-fat.jar
GOTO EOF

:BUILD_DOCKER
docker build -t %IMAGE_NAME% -f Dockerfile.%IMAGE_NAME% .
GOTO EOF

:RUN_DOCKER
docker run -d ^
  -p 80:80 ^
  --env httpConnectionString=%httpConnectionString% ^
  --env authConnectionString=%authConnectionString% ^
  --env mongodbConnectionString=%mongodbConnectionString% ^
  --name %IMAGE_NAME% ^
  %IMAGE_NAME%
GOTO EOF

:PUSH_DOCKER
SET TAG_NAME=bransom/cvtool/%IMAGE_NAME%:latest
docker tag %IMAGE_NAME% %TAG_NAME%
docker push %TAG_NAME%
GOTO EOF

:EOF