# 🐳 Pinterest Scraper API - Docker Deployment Guide

This guide provides a **Docker-based deployment** approach that's simpler and more reliable than traditional server setup.

## 🤔 Docker vs Traditional Deployment

### Docker Approach (Recommended)
✅ **Advantages:**
- **Consistent Environment**: Same container everywhere
- **Easy Updates**: Simple container replacement
- **Isolation**: App runs in isolated environment
- **Portability**: Works on any Docker-enabled server
- **Simpler Setup**: No need to install Node.js, Chrome, PM2
- **Built-in Health Checks**: Container-level monitoring
- **Easy Rollback**: Keep previous image versions

❌ **Trade-offs:**
- Requires Docker knowledge
- Slightly more disk space

### Traditional Approach
✅ **Advantages:**
- Direct server access
- More control over system

❌ **Trade-offs:**
- Complex server setup
- Dependency management issues
- Different environments can behave differently

## 🚀 Quick Start with Docker

### Step 1: Server Setup (Much Simpler!)

```bash
# On your DigitalOcean server
ssh root@your-server-ip

# Download and run Docker setup
wget https://raw.githubusercontent.com/kekeboomboom/Pinterest-Scraper/main/deployment/docker-server-setup.sh
chmod +x docker-server-setup.sh
sudo ./docker-server-setup.sh
```

That's it! No need for:
- ❌ Node.js installation
- ❌ Chrome installation  
- ❌ PM2 setup
- ❌ Complex dependencies

### Step 2: Local Testing (Optional)

Test your Docker setup locally:

```bash
# Clone your repository
git clone https://github.com/kekeboomboom/Pinterest-Scraper.git
cd Pinterest-Scraper

# Create .env file
cp deployment/production.env.example .env
# Edit .env with your Pinterest credentials

# Build and run with Docker
docker-compose up --build
```

Your API will be available at `http://localhost:3000`

### Step 3: GitHub Actions Setup

Use the Docker workflow instead of the traditional one:

**GitHub Secrets Required:**
- `HOST` - Your server IP
- `USERNAME` - `deploy`
- `PORT` - `22`
- `PRIVATE_KEY` - SSH private key
- `DEFAULT_IMAGE_LIMIT` - `20`
- `MAX_IMAGES_PER_REQUEST` - `100`
- `PINTEREST_BASE_URL` - `https://pinterest.com/search/pins/?q=`
- `DEFAULT_SCROLL_COUNT` - `2`
- `WEBSITE_URL` - Your Pinterest search URL
- `PINTEREST_EMAIL` - Your Pinterest email
- `PINTEREST_PASSWORD` - Your Pinterest password
- `SCROLL_COUNT` - `1`

### Step 4: Deploy

```bash
git add .
git commit -m "Setup Docker deployment"
git push origin main
```

## 📋 Deployment Options

### Option 1: Docker Only (Simplest)
```yaml
# Use .github/workflows/docker-deploy.yml
# Access: http://your-server-ip:3000
```

### Option 2: Docker + Nginx (Production Ready)
```yaml
# Uncomment nginx service in docker-compose.yml
# Setup SSL with Let's Encrypt
# Access: https://your-domain.com
```

### Option 3: Docker + Traefik (Advanced)
```yaml
# Use Traefik for automatic SSL and load balancing
# Great for multiple services
```

## 🎯 Docker Commands Cheat Sheet

### On Your Server:

```bash
# SSH to your server
ssh deploy@your-server-ip
cd /home/deploy/pinterest-scraper

# View running containers
docker-compose ps

# View logs
docker-compose logs -f pinterest-scraper

# Restart application
docker-compose restart pinterest-scraper

# Stop application
docker-compose down

# Start application
docker-compose up -d

# View application logs
docker-compose logs pinterest-scraper

# Execute commands inside container
docker-compose exec pinterest-scraper sh

# Check container health
docker-compose exec pinterest-scraper wget -O- http://localhost:3000/api/health
```

### Update Application:
```bash
# GitHub Actions will automatically:
# 1. Build new Docker image
# 2. Copy to server
# 3. Stop old container
# 4. Start new container
# 5. Clean up old files

# Manual update (if needed):
docker-compose pull
docker-compose up -d
```

## 🔧 Configuration

### Environment Variables
Create `.env` file on server:
```bash
# Server creates this automatically from GitHub Secrets
DEFAULT_IMAGE_LIMIT=20
MAX_IMAGES_PER_REQUEST=100
PINTEREST_BASE_URL=https://pinterest.com/search/pins/?q=
DEFAULT_SCROLL_COUNT=2
WEBSITE_URL=https://pinterest.com/search/pins/?q=anime&rs=typed
PINTEREST_EMAIL=your-email@gmail.com
PINTEREST_PASSWORD=your-password
SCROLL_COUNT=1
```

### Docker Compose Configuration
```yaml
# docker-compose.yml already configured for:
# - Environment variables
# - Port mapping (3000:3000)
# - Volume mounting (logs)
# - Health checks
# - Restart policies
# - Network isolation
```

## 🔒 Security Benefits

### Container Security:
- ✅ **Non-root user**: App runs as `nodejs` user
- ✅ **Isolated environment**: Container isolation
- ✅ **Minimal attack surface**: Alpine Linux base
- ✅ **No system-wide dependencies**: Everything in container
- ✅ **Immutable infrastructure**: Replace, don't modify

### Network Security:
- ✅ **Firewall configured**: Only necessary ports open
- ✅ **Private networks**: Docker internal networking
- ✅ **SSH key authentication**: No password authentication

## 🌐 Adding Nginx (Optional)

If you want to add Nginx for SSL/domain support:

### 1. Uncomment Nginx in docker-compose.yml:
```yaml
nginx:
  image: nginx:alpine
  container_name: pinterest-nginx
  restart: unless-stopped
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    - ./nginx/ssl:/etc/nginx/ssl:ro
  depends_on:
    - pinterest-scraper
  networks:
    - pinterest-network
```

### 2. Create Nginx configuration:
```bash
mkdir -p nginx
cat > nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream pinterest-scraper {
        server pinterest-scraper:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;

        location / {
            proxy_pass http://pinterest-scraper;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF
```

### 3. Add SSL with Let's Encrypt:
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com
```

## 🔍 Monitoring & Troubleshooting

### Health Checks:
```bash
# Container health
docker-compose ps

# Application health
curl http://your-server-ip:3000/api/health

# Test scraping
curl -X POST http://your-server-ip:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"category": "test", "limit": 1}'
```

### Logs:
```bash
# Application logs
docker-compose logs pinterest-scraper

# Follow logs in real-time
docker-compose logs -f pinterest-scraper

# System logs
journalctl -u docker
```

### Resource Usage:
```bash
# Container resource usage
docker stats

# System resources
htop
df -h
```

## 🚨 Emergency Procedures

### Rollback:
```bash
# GitHub Actions keeps previous images
# Manual rollback:
docker images | grep pinterest-scraper
docker tag pinterest-scraper:previous-version pinterest-scraper:latest
docker-compose up -d
```

### Complete Reset:
```bash
docker-compose down
docker system prune -a
# Redeploy from GitHub Actions
```

## 📊 Performance Optimization

### Resource Limits:
```yaml
# Add to docker-compose.yml
services:
  pinterest-scraper:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
```

### Multiple Instances:
```yaml
# Scale horizontally
services:
  pinterest-scraper:
    deploy:
      replicas: 3
```

## 🎉 Why Docker is Better for This Project

1. **Chrome Dependencies**: All handled in container
2. **Environment Consistency**: Same setup everywhere
3. **Easy Updates**: Container replacement
4. **Security**: Process isolation
5. **Monitoring**: Built-in health checks
6. **Scalability**: Easy to scale up/down

---

**Docker deployment is recommended for most users!** It's simpler, more reliable, and easier to maintain than traditional server setup. 
