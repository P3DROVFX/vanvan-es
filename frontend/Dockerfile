# Etapa 1: Build (Compila o Angular/Node)
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Etapa 2: Servidor Web (NGINX para servir o HTML/JS)
FROM nginx:alpine
# ATENÇÃO: Substitua 'nome-do-seu-projeto' pelo nome que está no seu angular.json
COPY --from=build /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
