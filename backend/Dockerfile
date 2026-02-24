# Etapa 1: Build (Compila o Java usando Maven)
FROM maven:3.9.12-eclipse-temurin-25 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -Dmaven.test.skip=true

# Etapa 2: Runtime (Cria a imagem final leve só para rodar)
FROM eclipse-temurin:25-jdk-alpine
WORKDIR /app
# Pega o .jar gerado na etapa anterior
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]