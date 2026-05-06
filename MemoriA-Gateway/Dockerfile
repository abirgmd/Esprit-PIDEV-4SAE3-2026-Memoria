FROM eclipse-temurin:17-jre
WORKDIR /app
# On utilise le JAR déjà compilé par Jenkins dans le dossier target
COPY target/*.jar app.jar
EXPOSE 8888
ENTRYPOINT ["java", "-jar", "app.jar"]
