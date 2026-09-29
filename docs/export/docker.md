# Deploy with Docker

Self-host your konek using Docker for full control.

## Quick Start

The export includes a Dockerfile. Build and run:

```bash
cd my-konek
docker build -t my-konek .
docker run -d -p 8080:80 my-konek
```

Open [http://localhost:8080](http://localhost:8080)

## Docker Compose

Create a `compose.yml`:

```yaml
services:
  konek:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

Run:

```bash
docker compose up -d
```

## Multi-Stage Dockerfile

The included Dockerfile uses multi-stage builds for small images:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Nginx Configuration

The export includes an optimized `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

## Deploy to a VPS

### Step 1: Build Image

```bash
docker build -t my-konek .
```

### Step 2: Save Image

```bash
docker save my-konek > my-konek.tar
```

### Step 3: Transfer to Server

```bash
scp my-konek.tar user@server:/path/to/
```

### Step 4: Load and Run

On your server:

```bash
docker load < my-konek.tar
docker run -d -p 80:80 --name my-konek my-konek
```

## Using a Registry

### Push to Docker Hub

```bash
docker tag my-konek username/my-konek:latest
docker push username/my-konek:latest
```

### Pull on Server

```bash
docker pull username/my-konek:latest
docker run -d -p 80:80 username/my-konek
```

## With Traefik (Reverse Proxy)

For multiple sites with automatic HTTPS:

```yaml
services:
  konek:
    build: .
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.konek.rule=Host(`mykonek.com`)"
      - "traefik.http.routers.konek.tls.certresolver=letsencrypt"
    networks:
      - traefik

networks:
  traefik:
    external: true
```

## With Caddy (Simpler Alternative)

`Caddyfile`:

```
mykonek.com {
    reverse_proxy konek:80
}
```

`compose.yml`:

```yaml
services:
  caddy:
    image: caddy:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    depends_on:
      - konek

  konek:
    build: .

volumes:
  caddy_data:
```

## Health Checks

Add a health check to your compose file:

```yaml
services:
  konek:
    build: .
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Resource Limits

Limit container resources:

```yaml
services:
  konek:
    build: .
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 128M
```

## Troubleshooting

### Container won't start

Check logs:
```bash
docker logs my-konek
```

### Port already in use

Use a different port:
```bash
docker run -d -p 3000:80 my-konek
```

### Permission denied

On Linux, you may need to run Docker with sudo or add your user to the docker group.

