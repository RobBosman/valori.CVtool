@ECHO OFF

SET ENV_FILE=\secret\.env
SET /P MONGODB_INDEXES=<mongodb_indexes_A.js
SET MONGODB_COMMAND=%MONGODB_INDEXES:;=;^%

SETLOCAL
FOR /F "TOKENS=*" %%i in ('type %ENV_FILE%') do SET %%i
FOR /F "usebackq delims=" %%A IN (`docker ps -aqf "name=mongodb"`) DO docker exec -it %%A ^
    mongosh mongodb://%MONGO_ROOT_USERNAME%:%MONGO_ROOT_PASSWORD%@mongodb:27017/cvtool?authSource=admin ^
    --eval "%MONGODB_COMMAND%"
ENDLOCAL

PAUSE