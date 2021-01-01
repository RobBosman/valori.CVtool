@ECHO OFF

SET ENV_FILE=\secret\.env

SETLOCAL
FOR /F "TOKENS=*" %%i in ('type %ENV_FILE%') do SET %%i
FOR /F "usebackq delims=" %%A IN (`docker ps -aqf "name=mongo"`) DO docker exec -it %%A ^
  mongo mongodb://%MONGO_ROOT_USERNAME%:%MONGO_ROOT_PASSWORD%@mongodb:27017/cvtool?authSource=admin ^
  --eval " var db = db.getSiblingDB('cvtool'); db.experience.createIndex({'$**':'text'}); db.skill.createIndex({'description.nl_NL':'text', 'description.uk_UK':'text'}); "
ENDLOCAL