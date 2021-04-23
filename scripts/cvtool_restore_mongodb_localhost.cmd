@ECHO OFF

ECHO "Make sure MongoDB is up and running."
SET ENV_FILE=\secret\.env

SET RESTORE_DATE=2021-04-21
SET BACKUP_DIR=\backup\%RESTORE_DATE%
SET VOLUME_MONGODB_BACKUP=\\wsl$\docker-desktop-data\version-pack-data\community\docker\volumes\valoricvtool_mongodb_backup
SET MONGORESTORE=C:\Program Files\MongoDB\Tools\100\bin\mongorestore

SETLOCAL
FOR /F "TOKENS=*" %%i in ('type %ENV_FILE%') do SET %%i
"%MONGORESTORE%" --uri="mongodb://localhost:27017/cvtool" --drop --preserveUUID --gzip "\backup\%RESTORE_DATE%\cvtool"
ENDLOCAL
