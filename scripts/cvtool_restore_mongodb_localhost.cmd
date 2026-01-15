@ECHO OFF

ECHO "Make sure MongoDB is up and running."
SET ENV_FILE=\secret\.env

SET RESTORE_DATE=2026-01-14
SET BACKUP_DIR=\backup\%RESTORE_DATE%
SET MONGORESTORE=C:\Program Files\MongoDB\Tools\bin\mongorestore

SETLOCAL
FOR /F "TOKENS=*" %%i in ('type %ENV_FILE%') do SET %%i
"%MONGORESTORE%" --uri="mongodb://localhost:27017/cvtool" --drop --preserveUUID --gzip "\backup\%RESTORE_DATE%\cvtool"
ENDLOCAL
