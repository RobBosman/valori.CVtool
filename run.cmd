@ECHO OFF

CALL .\setenv.cmd

java -jar .\backend\target\backend-0.0.1-SNAPSHOT-fat.jar
