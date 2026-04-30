# Step 1: Use an OpenJDK image
FROM openjdk:17-jdk-slim

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the jar file from the target folder to the container
# Note: This assumes you ran 'mvn package' first
COPY target/*.jar app.jar

# Step 4: Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]