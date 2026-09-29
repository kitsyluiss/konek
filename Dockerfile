# Stage 1: Build de l'application React
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build de l'application
RUN npm run build

# Stage 2: Serveur de production avec Caddy
FROM caddy:2-alpine

# Copier les fichiers buildés depuis le stage précédent
COPY --from=builder /app/dist /srv

# Copier la configuration Caddy
COPY Caddyfile /etc/caddy/Caddyfile

# Exposer le port 80
EXPOSE 80

# Caddy démarre automatiquement avec la configuration
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]

