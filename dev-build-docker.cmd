@echo off
docker build --no-cache=true -f dev-Dockerfile-backend -t bransom/cvtool-backend-dev .
docker build --no-cache=true -f dev-Dockerfile-frontend -t bransom/cvtool-frontend-dev .
docker compose -f dev-docker-compose.yaml --env-file=/secret/.env up -d
