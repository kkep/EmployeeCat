FROM gradle:8.12.1-jdk17
WORKDIR /app

# Install Node.js 18 (LTS)
RUN apt-get update && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

COPY . .
RUN ./gradlew build -x test
CMD ["./gradlew", "bootRun"]