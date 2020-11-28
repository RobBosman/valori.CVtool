########################################################################################################################
# Compose a container for building the frontend and backend.
########################################################################################################################
FROM openjdk:15-alpine as builder

# Add maven and binutils for objcopy, needed by jlink.
RUN apk --update add \
    binutils \
    git \
    maven

RUN mkdir /build
WORKDIR /build

# Copy the source code.
RUN git clone https://github.com/RobBosman/valori.CVtool.git .

# Build the app.
RUN mvn clean package

# Move the executable code to a suitable location.
RUN mv backend/target/*-fat.jar cvtool-fat.jar

# Strip-off all overhead and bundle everything into a stand-alone executable.
RUN jdeps --print-module-deps --ignore-missing-deps cvtool-fat.jar > java.modules
RUN jlink --compress 2 --strip-debug --no-header-files --no-man-pages \
    --add-modules $(cat java.modules) \
    --output java/

WORKDIR /


########################################################################################################################
# Compose the final container.
########################################################################################################################
FROM alpine:latest
MAINTAINER RobBosman@valori.nl

# Add openssl for HTTP/2.
RUN apk --update add \
   openssl

# Copy the executable code.
COPY --from=builder /build/java /java
COPY --from=builder /build/cvtool-fat.jar /cvtool-fat.jar

# Run the CVtool app, accepting DH keysize of at least 2048 bis only.
CMD exec /java/bin/java \
    -Djdk.tls.ephemeralDHKeySize=2048 \
    -jar /cvtool-fat.jar
