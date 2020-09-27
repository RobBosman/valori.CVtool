# Build frontend separately. (The maven-frontend-plugin gives errors on alpine.)
FROM node:current-alpine as frontend-builder
COPY frontend/*.* /frontend/
COPY frontend/src /frontend/src
WORKDIR /frontend
RUN npm install --no-optional --no-audit
RUN npm run-script build
WORKDIR /


# Compose a container for building the backend.
FROM openjdk:15-alpine as backend-builder
# Add binutils for objcopy, needed by jlink.
RUN apk --update add \
    binutils \
    wget

# Install maven
ARG MAVEN_VERSION=3.6.3
ARG MAVEN_FILE=apache-maven-${MAVEN_VERSION}-bin
ENV MAVEN_HOME=/usr/lib/mvn
ENV PATH ${MAVEN_HOME}/bin:${PATH}
RUN wget http://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/${MAVEN_FILE}.tar.gz
RUN tar -zxvf ${MAVEN_FILE}.tar.gz
RUN rm ${MAVEN_FILE}.tar.gz
RUN mv apache-maven-${MAVEN_VERSION} ${MAVEN_HOME}

# Copy the sources.
COPY pom.xml .
COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src
COPY --from=frontend-builder frontend/dist frontend/dist

# Build the backend.
WORKDIR /backend
RUN jar cf frontend.war /frontend/dist
RUN mvn install:install-file \
    -Dfile=frontend.war \
    -DgroupId=nl.valori.cvtool \
    -DartifactId=frontend \
    -Dversion=0.0.1-SNAPSHOT \
    -Dpackaging=war
RUN mvn package
RUN mv target/*-fat.jar /fat.jar
WORKDIR /
# Module jdk.naming.dns is required for TLS connections to MongoDB.
RUN echo -n "jdk.naming.dns," > java.modules
RUN jdeps --print-module-deps --ignore-missing-deps /fat.jar >> java.modules
RUN jlink --compress 2 --strip-debug --no-header-files --no-man-pages \
    --add-modules $(cat java.modules) \
    --output /java/


# Compose the final container.
FROM alpine:latest
##RUN apk --no-cache --update add openjdk11-jre openjdk11-jmods
RUN apk --no-cache --update add openjdk11-jre
##COPY --from=backend-builder /java /java
COPY --from=backend-builder /fat.jar /fat.jar
CMD exec java -jar /fat.jar
