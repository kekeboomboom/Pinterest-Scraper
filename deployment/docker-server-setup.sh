#!/bin/bash

# Pinterest Scraper API - Docker Server Setup Script
# Simple setup for Docker-based deployment on Ubuntu 20.04+

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐳 Setting up Pinterest Scraper API server with Docker...${NC}"

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
apt update && apt upgrade -y

# Install Docker
echo -e "${YELLOW}🐳 Installing Docker...${NC}"
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Install Docker Compose
echo -e "${YELLOW}🐳 Installing Docker Compose...${NC}"
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create deployment user
echo -e "${YELLOW}👤 Creating deployment user...${NC}"
if ! id "deploy" &>/dev/null; then
    useradd -m -s /bin/bash deploy
    usermod -aG sudo deploy
    usermod -aG docker deploy
fi

# Create application directory
echo -e "${YELLOW}📁 Creating application directories...${NC}"
mkdir -p /home/deploy/pinterest-scraper
chown -R deploy:deploy /home/deploy/pinterest-scraper

# Create logs directory
mkdir -p /home/deploy/pinterest-scraper/logs
chown -R deploy:deploy /home/deploy/pinterest-scraper/logs

# Configure firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
ufw allow OpenSSH
ufw allow 3000/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Start Docker service
echo -e "${YELLOW}🐳 Starting Docker service...${NC}"
systemctl start docker
systemctl enable docker

# Test Docker installation
echo -e "${YELLOW}🧪 Testing Docker installation...${NC}"
docker --version
docker-compose --version

# Optional: Install Nginx for reverse proxy (uncomment if needed)
# echo -e "${YELLOW}🌐 Installing Nginx (optional)...${NC}"
# apt install -y nginx
# systemctl enable nginx

echo -e "${GREEN}✅ Docker server setup completed successfully!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "1. Configure GitHub Actions secrets"
echo -e "2. Push your code to trigger Docker deployment"
echo -e "3. Your API will be available at http://your-server-ip:3000"

echo -e "${GREEN}🎉 Your server is ready for Docker-based Pinterest Scraper API!${NC}" 
