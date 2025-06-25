# Use official lightweight Java image
FROM eclipse-temurin:17-jdk-alpine

# Create working directory
WORKDIR /app

# Copy the JAR file into the container
COPY target/gait-backend.jar app.jar

# Expose the Spring Boot default port (for documentation only)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
