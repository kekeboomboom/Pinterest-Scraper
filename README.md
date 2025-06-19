<img src="./assets/pinterest_banner.png" width="600px" height="150px">

# Pinterest Scraper API

A RESTful HTTP API service for scraping Pinterest images by category. Transform your Pinterest scraping needs into a simple API call.

## Features

- 🚀 **RESTful API**: Simple HTTP endpoints for Pinterest scraping
- 🔍 **Category-based Search**: Search Pinterest by any category or keyword
- 🎯 **Customizable Limits**: Control the number of images returned
- 🛡️ **Error Handling**: Comprehensive error responses and validation
- 🌐 **CORS Enabled**: Use from any frontend application
- 📊 **Health Check**: Monitor API status
- 🔄 **No Authentication Required**: Works without Pinterest login

## Quick Start

### Installation

# Clone the repository
git clone https://github.com/kekeboomboom/Pinterest-Scraper.git
cd Pinterest-Scraper

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run in development mode
npm run dev

# Or build and run in production
npm run build
npm start
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Browser Configuration
CHROME_HEADLESS=true

# Request Limits
DEFAULT_IMAGE_LIMIT=20
MAX_IMAGES_PER_REQUEST=100

# Pinterest Configuration
PINTEREST_BASE_URL=https://pinterest.com/search/pins/?q=
DEFAULT_SCROLL_COUNT=2
```

## API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T12:00:00Z",
    "version": "2.0.0"
  }
}
```

#### 2. Scrape by Category (POST)
```http
POST /api/scrape
Content-Type: application/json

{
  "category": "anime",
  "limit": 20,
  "quality": "high"
}
```

**Parameters:**
- `category` (required): The image category to search for
- `limit` (optional): Maximum number of images (default: 20, max: 100)
- `quality` (optional): Image quality preference - "high", "medium", or "low" (default: "high")

**Response:**
```json
{
  "success": true,
  "data": {
    "category": "anime",
    "totalImages": 18,
    "images": [
      "https://i.pinimg.com/originals/abc123/image1.jpg",
      "https://i.pinimg.com/originals/def456/image2.jpg",
      "https://i.pinimg.com/originals/ghi789/image3.jpg"
    ],
    "processingTime": "12.5s"
  }
}
```

#### 3. Scrape by Category (GET)
```http
GET /api/scrape/anime?limit=30&quality=high
```

**URL Parameters:**
- `category`: The image category to search for

**Query Parameters:**
- `limit` (optional): Maximum number of images (default: 20, max: 100)
- `quality` (optional): Image quality preference (default: "high")

**Response:** Same format as POST endpoint

## Usage Examples

### cURL Examples

```bash
# Health check
curl http://localhost:3000/api/health

# POST request
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"category": "anime", "limit": 20}'

# GET request
curl "http://localhost:3000/api/scrape/anime?limit=20&quality=high"
```

### JavaScript/Fetch Examples

```javascript
// POST request
const response = await fetch('http://localhost:3000/api/scrape', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    category: 'anime',
    limit: 20,
    quality: 'high'
  })
});

const data = await response.json();
console.log(data);

// GET request
const response = await fetch('http://localhost:3000/api/scrape/anime?limit=20');
const data = await response.json();
console.log(data);
```

### Python Examples

```python
import requests

# POST request
response = requests.post('http://localhost:3000/api/scrape', 
                        json={'category': 'anime', 'limit': 20})
data = response.json()
print(data)

# GET request
response = requests.get('http://localhost:3000/api/scrape/anime', 
                       params={'limit': 20, 'quality': 'high'})
data = response.json()
print(data)
```

## Error Handling

The API returns structured error responses:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CATEGORY",
    "message": "The provided category is invalid or empty",
    "details": "Category must be a non-empty string with alphanumeric characters",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

### Error Codes

- `INVALID_CATEGORY`: Category parameter is missing or invalid
- `LIMIT_EXCEEDED`: Requested image limit exceeds maximum allowed
- `SCRAPING_FAILED`: Pinterest scraping operation failed
- `NOT_FOUND`: Endpoint not found
- `INTERNAL_ERROR`: Internal server error

## Development

### Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
npm run build:start # Build and start production server
```

### Project Structure

```
src/
├── controllers/          # API route handlers
│   └── scrapeController.ts
├── services/             # Business logic
│   ├── pinterestService.ts
│   └── errorHandler.ts
├── types/               # TypeScript definitions
│   └── pinterest.d.ts
├── routes/              # API routes
│   └── index.ts
└── app.ts               # Express app setup
```

## Requirements

- Node.js 16+ 
- Chrome/Chromium browser
- TypeScript

## Deployment

### Basic Deployment

1. Build the project: `npm run build`
2. Set environment variables for production
3. Install Chrome/ChromeDriver on the server
4. Start the server: `npm start`

### Docker Deployment

```dockerfile
FROM node:18-alpine
RUN apk add --no-cache chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

If you find this project helpful, consider supporting the development:

[![Support](https://www.paytr.com/link/2qh0pLB?lang=en)](https://www.paytr.com/link/2qh0pLB?lang=en)

---

**Note**: This tool is for educational purposes. Please respect Pinterest's robots.txt and terms of service when using this scraper.

# Example
<img src="./assets/example.gif">



# Installation
* **1 Download requirements**

git clone https://github.com/kekeboomboom/Pinterest-Scraper.git
cd Pinterest-Scraper
npm install

* **2 Download ChromeDriver Or Google Chrome**

[ChromeDriver](https://chromedriver.chromium.org/downloads) via Driver, [Chrome Browser](https://www.google.com/chrome/) You can also install Chrome Browser from here, skip this step if it is already available.

# Usage

Example .env File
```js
websiteURL=https://pinterest.com/search/pins/?q=anime&rs=typed /* Pinterest URL to Scrape */
email=test@gmail.com /* Pinterest Email */
password=test123 /* Pinterest Password */
scrollCount=1 /* Page Scrool Count */
```
#
Console to compile and run with JavaScript;
```shell
npm run build:start
```
#
Or to the Console to Run Directly with ts-node;
```shell
npm run start
```

# Donation & Support
<a href="https://www.buymeacoffee.com/beykant" target="_blank">
<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width="120px" height="30px" alt="Buy Me A Coffee">
</a>
<br>
<a href="https://www.paytr.com/link/2qh0pLB?lang=en" target="_blank">
<img src="./assets/pay_tr.png" width="120px" height="50px" alt="Buy Me A Coffee">
</a>

[![Discord Banner](https://api.weblutions.com/discord/invite/luppux/)](https://discord.gg/luppux)

