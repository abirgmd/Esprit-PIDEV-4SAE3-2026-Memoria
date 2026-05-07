# Multi-stage Dockerfile for building and running a Eureka Registry Server
FROM maven:3.8.8-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY pom.xml ./
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre
ARG JAR_FILE=target/*.jar
COPY --from=build /workspace/${JAR_FILE} /app/app.jar

EXPOSE 8761
ENTRYPOINT ["java","-jar","/app/app.jar"]
