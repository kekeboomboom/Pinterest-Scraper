# Pinterest Scraper API v4.0

> Next-generation Pinterest scraping API with modern architecture, real-time capabilities, and beautiful UI.

[![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)](https://github.com/kekeboomboom/Pinterest-Scraper)
[![License](https://img.shields.io/badge/license-GPL--3.0-green.svg)](LICENSE.md)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black.svg)](https://nextjs.org/)

## 🚀 What's New in v4.0

- **🔥 Complete Rewrite**: Built from scratch with Next.js 14 and modern React
- **⚡ Real-time Updates**: WebSocket integration for live scraping progress
- **🎨 Beautiful UI**: Modern, responsive interface with Tailwind CSS
- **🛠️ Developer First**: Comprehensive TypeScript support and API documentation
- **� Enterprise Ready**: Built-in security, rate limiting, and monitoring
- **📊 Analytics**: Real-time system statistics and performance metrics
- **🎯 High Performance**: Playwright-based scraping with smart caching

## ✨ Features

### Core Features
- **Pinterest Image Scraping**: Extract high-quality images by category
- **Multiple Quality Options**: LOW, MEDIUM, HIGH, and ORIGINAL quality
- **Batch Processing**: Scrape 1-100 images per request
- **Real-time Progress**: Live updates via WebSocket connections
- **Smart Caching**: Intelligent caching for faster subsequent requests
- **Rate Limiting**: Built-in protection against abuse

### UI/UX Features
- **Modern Interface**: Clean, intuitive web interface
- **Responsive Design**: Works perfectly on all devices
- **Live Preview**: Pinterest-style masonry grid layout
- **Image Modal**: Full-screen image preview with metadata
- **Download Options**: Individual images or complete JSON export
- **Progress Tracking**: Visual progress indicators

### Developer Features
- **REST API**: Clean, well-documented API endpoints
- **TypeScript**: Full type safety and IntelliSense support
- **OpenAPI Documentation**: Interactive API documentation
- **Code Examples**: Ready-to-use examples in multiple languages
- **Health Monitoring**: System health and performance endpoints
- **Error Handling**: Comprehensive error responses with details

## 🏗️ Architecture

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── health/        # Health check endpoint
│   │   ├── scrape/        # Main scraping endpoint
│   │   ├── stats/         # System statistics
│   │   └── qualities/     # Quality options
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Homepage
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── sections/         # Page sections
│   ├── ui/               # UI components
│   └── providers.tsx     # Context providers
├── types/                # TypeScript definitions
├── prisma/              # Database schema
└── public/              # Static assets
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **Git**: Latest version

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kekeboomboom/Pinterest-Scraper.git
   cd Pinterest-Scraper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Install Playwright browsers**
   ```bash
   npx playwright install chromium
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration

### Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"

# API Configuration
API_RATE_LIMIT=100
DEFAULT_IMAGE_COUNT=20
MAX_IMAGE_COUNT=100

# Browser Configuration
BROWSER_HEADLESS=true
BROWSER_TIMEOUT=30000
```

### Quality Options

| Quality | Resolution | Use Case |
|---------|------------|----------|
| LOW | 236x | Quick previews, testing |
| MEDIUM | 564x | General use (default) |
| HIGH | 736x | High-quality displays |
| ORIGINAL | Full size | Professional use, printing |

## 📖 API Documentation

### Endpoints

#### `POST /api/scrape`
Scrape Pinterest images by category.

**Request Body:**
```json
{
  "category": "nature",
  "imageCount": 20,
  "quality": "HIGH"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "scrape_123",
    "category": "nature",
    "totalImages": 20,
    "images": [...],
    "timestamp": "2024-01-15T10:30:00Z",
    "duration": 12.5
  }
}
```

#### `GET /api/health`
Check API health status.

#### `GET /api/stats`  
Get system statistics.

#### `GET /api/qualities`
Get available quality options.

### Code Examples

#### JavaScript/Node.js
```javascript
const response = await fetch('/api/scrape', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    category: 'nature',
    imageCount: 20,
    quality: 'HIGH'
  })
});

const data = await response.json();
console.log(data);
```

#### Python
```python
import requests

response = requests.post('/api/scrape', json={
    'category': 'nature',
    'imageCount': 20,
    'quality': 'HIGH'
})

data = response.json()
print(data)
```

#### cURL
```bash
curl -X POST /api/scrape \
  -H "Content-Type: application/json" \
  -d '{"category":"nature","imageCount":20,"quality":"HIGH"}'
```

## 🎨 UI Features

### Web Interface
- **Hero Section**: Modern landing page with feature highlights
- **Scraping Interface**: Interactive form with live validation
- **Results Display**: Pinterest-style masonry grid layout
- **Image Modal**: Full-screen preview with download options
- **Statistics Dashboard**: Real-time system metrics
- **API Documentation**: Interactive documentation with examples

### Design System
- **Colors**: Pinterest-inspired color palette
- **Typography**: Inter font family for clean readability
- **Components**: Reusable, accessible UI components
- **Animations**: Smooth transitions with Framer Motion
- **Responsive**: Mobile-first responsive design

## 🛠️ Development

### Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio

# Testing & Quality
npm run test         # Run tests
npm run lint         # Run ESLint
```

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Playwright
- **Database**: Prisma ORM (SQLite/PostgreSQL)
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Validation**: Zod schema validation
- **Testing**: Jest, React Testing Library

## 🔒 Security

- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses
- **CORS**: Configurable cross-origin policies
- **Headers**: Security headers with Helmet
- **Sanitization**: Input sanitization and validation

## 📊 Monitoring

### Health Check
```
GET /api/health
```

Returns system status, uptime, memory usage, and version information.

### Statistics
```
GET /api/stats
```

Real-time metrics including:
- Total scraping jobs
- Success/failure rates
- Images processed
- System uptime
- Active users

## 🚀 Deployment

### Docker

```bash
# Build image
npm run docker:build

# Run container
npm run docker:run
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Deployment

```bash
# Build application
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 License

This project is licensed under the GPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details.

## ⚠️ Disclaimer

This tool is for educational purposes only. Please respect Pinterest's Terms of Service and robots.txt file. Use responsibly and at your own risk.

## � Acknowledgments

- [Pinterest](https://pinterest.com) for the amazing platform
- [Playwright](https://playwright.dev) for reliable browser automation
- [Next.js](https://nextjs.org) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for beautiful styling
- [Vercel](https://vercel.com) for seamless deployment

## 📞 Support

- **Documentation**: [API Docs](https://your-domain.com/api-docs)
- **Issues**: [GitHub Issues](https://github.com/kekeboomboom/Pinterest-Scraper/issues)
- **Discussions**: [GitHub Discussions](https://github.com/kekeboomboom/Pinterest-Scraper/discussions)

---

Made with ❤️ by [Bes-js](https://github.com/Bes-js)

**Pinterest Scraper API v4.0** - The next generation of Pinterest scraping.

