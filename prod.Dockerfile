# Building (Сборка)
FROM gradle:8.12.1-jdk17 as builder
WORKDIR /app

# Install Node.js 18 (LTS)
RUN apt-get update && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

COPY . .
RUN ./gradlew clean build -x test --no-daemon --console=verbose

RUN ls -l /app/build/libs

# Running
FROM openjdk:11-jre-slim
WORKDIR /app

COPY --from=builder /app/build/libs/EmployeeCat-0.0.1-SNAPSHOT.jar /app/app.jar
EXPOSE 8080
RUN chmod +x /app/app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]