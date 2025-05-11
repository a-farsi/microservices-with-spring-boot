# Étape de build
FROM node:20-alpine AS build

# Création du répertoire de travail
WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie des fichiers sources
COPY . .

# Build de l'application React
RUN npm run build

# Créer un dossier de sortie et y copier les fichiers du build
# quelle que soit leur localisation (build ou dist)
RUN mkdir -p /output && \
    if [ -d "build" ] && [ -f "build/index.html" ]; then \
        cp -r build/* /output/; \
    elif [ -d "dist" ] && [ -f "dist/index.html" ]; then \
        cp -r dist/* /output/; \
    else \
        echo "Aucun dossier build ou dist trouvé!" && \
        find /app -type f -name "index.html" | grep -v "node_modules" && \
        exit 1; \
    fi

# Étape de production avec Nginx
FROM nginx:alpine

# Copie des fichiers de build depuis l'étape intermédiaire
COPY --from=build /output /usr/share/nginx/html

# Exposition du port 80
EXPOSE 80

# Démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]