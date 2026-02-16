FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/Backend-0.0.1-SNAPSHOT.jar webshopBackend.jar
ENTRYPOINT ["java","-jar","/app/webshopBackend.jar"]

