# Build stage
FROM gradle:8.12.1-jdk17 AS builder

WORKDIR /app

# Copy gradle configuration files first to leverage cache
COPY . .

# Download dependencies (cacheable layer)
RUN gradle dependencies --no-daemon

# Copy application source
COPY src ./src

# Build application with production profile
RUN gradle build --no-daemon -Pvaadin.productionMode

# Runtime stage
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy built jar from builder stage
COPY --from=builder /app/build/libs/EmployeeCat-0.0.1-SNAPSHOT.jar app.jar

# Set production environment variables
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-Xmx512m -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar app.jar"]