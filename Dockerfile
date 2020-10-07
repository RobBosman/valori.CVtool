# Build the frontend.
 # (This is done with a separate Docker image. The maven-frontend-plugin gives errors on alpine.)
FROM node:current-alpine as frontend-builder
# Copy the frontend source code.
COPY frontend/*.* /frontend/
COPY frontend/src /frontend/src
# Build the frontend into /frontend/dist/.
WORKDIR /frontend
RUN npm install --no-optional --no-audit
RUN npm run-script build
WORKDIR /


# Compose a container for building the backend.
FROM openjdk:15-alpine as backend-builder
# Add binutils for objcopy, needed by jlink.
RUN apk --update add \
    binutils \
    maven
# Copy the backend source code.
COPY pom.xml .
COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src
COPY --from=frontend-builder frontend/dist frontend/dist
# Package the frontend into a war to include it in the resulting fat.jar.
WORKDIR /backend
RUN jar cf frontend.war /frontend/dist
RUN mvn install:install-file \
    -Dfile=frontend.war \
    -DgroupId=nl.valori.cvtool \
    -DartifactId=frontend \
    -Dversion=0.0.1-SNAPSHOT \
    -Dpackaging=war
# Build the backend.
RUN mvn package
RUN mv target/*-fat.jar /fat.jar
WORKDIR /
# Strip-off all overhead and bundle everything into a stand-alone executable.
RUN jdeps --print-module-deps --ignore-missing-deps /fat.jar > java.modules
RUN jlink --compress 2 --strip-debug --no-header-files --no-man-pages \
    --add-modules $(cat java.modules) \
    --output /java/


# Compose the final container.
FROM alpine:latest
MAINTAINER RobBosman@valori.nl
COPY ssl_certs /ssl_certs
COPY webroot /webroot
COPY --from=backend-builder /java /java
COPY --from=backend-builder /fat.jar /fat.jar
# Run the CVtool app.
CMD exec /java/bin/java -jar /fat.jar
