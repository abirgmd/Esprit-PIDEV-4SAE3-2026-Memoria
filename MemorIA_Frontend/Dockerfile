# Stage 1: Build
FROM node:18 AS build
WORKDIR /app

# Optimisation du cache npm
COPY package*.json ./
RUN npm install

# Build de l'application
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Production
FROM nginx:alpine
# Copie des fichiers buildés (vérifiez le chemin dist dans angular.json)
COPY --from=build /app/dist/memor-ia-frontend/browser /usr/share/nginx/html
# Copie de la config Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
