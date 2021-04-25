@ECHO OFF

SET ENV_FILE=\secret\.env
SET /P MONGO_INDEXES=<mongo_indexes.js
SET MONGO_COMMAND=%MONGO_INDEXES:;=;^%

SETLOCAL
FOR /F "TOKENS=*" %%i in ('type %ENV_FILE%') do SET %%i
FOR /F "usebackq delims=" %%A IN (`docker ps -aqf "name=mongo"`) DO docker exec -it %%A ^
  mongo mongodb://%MONGO_ROOT_USERNAME%:%MONGO_ROOT_PASSWORD%@mongodb:27017/cvtool?authSource=admin ^
    --eval "%MONGO_COMMAND%"
ENDLOCAL
