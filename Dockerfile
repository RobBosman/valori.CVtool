########################################################################################################################
# Compose a container for building the frontend and backend.
########################################################################################################################
FROM openjdk:15-alpine as builder

# Add maven and binutils for objcopy, needed by jlink.
RUN apk --update add \
    binutils \
    git \
    maven

# Copy the source code.
RUN git clone https://github.com/RobBosman/valori.CVtool.git .

# Build the app.
RUN mvn clean package

# Move the executable code to a suitable location.
RUN mv backend/target/*-fat.jar /cvtool.jar

# Strip-off all overhead and bundle everything into a stand-alone executable.
RUN jdeps --print-module-deps --ignore-missing-deps /cvtool.jar > java.modules
RUN jlink --compress 2 --strip-debug --no-header-files --no-man-pages \
    --add-modules $(cat java.modules) \
    --output /java/


########################################################################################################################
# Compose the final container.
########################################################################################################################
FROM alpine:latest
MAINTAINER RobBosman@valori.nl

# Copy the executable code.
COPY --from=builder /java /java
COPY --from=builder /cvtool.jar /cvtool.jar

# Run the CVtool app.
CMD exec /java/bin/java -jar /cvtool.jar