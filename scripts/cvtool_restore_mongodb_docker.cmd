@ECHO OFF

ECHO "Make sure MongoDB is up and running."
SET ENV_FILE=\secret\.env

SET RESTORE_DATE=2024-02-18
SET BACKUP_DIR=\backup\%RESTORE_DATE%
SET VOLUME_MONGODB_BACKUP=\\wsl$\docker-desktop-data\data\docker\volumes\docker_mongodb_backup

XCOPY "%BACKUP_DIR%\cvtool\*.*" "%VOLUME_MONGODB_BACKUP%\_data\%RESTORE_DATE%" /E/H/Q/I/Y

SETLOCAL
FOR /F "TOKENS=*" %%i in ('type %ENV_FILE%') do SET %%i
FOR /F "usebackq delims=" %%A IN (`docker ps -aqf "name=mongo"`) DO docker exec -it %%A ^
  mongorestore --uri="mongodb://%MONGO_ROOT_USERNAME%:%MONGO_ROOT_PASSWORD%@mongodb:27017/cvtool?authSource=admin" ^
    --drop --preserveUUID --gzip "/backup/%RESTORE_DATE%"
ENDLOCAL
