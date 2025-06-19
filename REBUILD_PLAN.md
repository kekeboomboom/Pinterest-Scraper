# Pinterest Scraper API - Rebuild Plan

## Project Overview

This document outlines the plan to transform the existing Pinterest Scraper from a CLI-based tool into a RESTful HTTP API service. The API will allow users to request Pinterest image URLs through HTTP endpoints and receive structured responses.

## Current Project Analysis

### Existing Architecture
- **Technology Stack**: TypeScript, Selenium WebDriver, Node.js
- **Main Components**:
  - `Pinterest` class: Handles web scraping logic
  - Login system: Authenticates with Pinterest
  - Image collection: Scrapes and filters accessible image URLs
  - Error handling: Custom error management

### Current Limitations
- CLI-only interface
- Single-use execution model
- No concurrent request handling
- Manual configuration via environment variables
- No API documentation or standardized responses

## New Architecture Design

### 1. HTTP API Framework
- **Framework**: Express.js with TypeScript
- **Port**: Configurable (default: 3000)
- **CORS**: Enabled for cross-origin requests
- **Body Parsing**: JSON support
- **Simple**: No complex queuing or tracking needed

### 2. API Endpoints

#### POST `/api/scrape`
**Purpose**: Scrape Pinterest images by category

**Request Body**:
```json
{
  "category": "anime"
}
```

**Optional Parameters**:
```json
{
  "category": "anime",
  "limit": 50,
  "quality": "high"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "category": "anime",
    "totalImages": 45,
    "images": [
      "https://i.pinimg.com/originals/abc123/image1.jpg",
      "https://i.pinimg.com/originals/def456/image2.jpg",
      "https://i.pinimg.com/originals/ghi789/image3.jpg"
    ],
    "processingTime": "12.5s"
  }
}
```

#### GET `/api/scrape/:category`
**Purpose**: Alternative GET endpoint for simple category-based scraping

**URL Parameters**:
- `category`: The image category to search for

**Query Parameters** (optional):
- `limit`: Maximum number of images (default: 20, max: 100)
- `quality`: Image quality preference (high|medium|low, default: high)

**Example**: `GET /api/scrape/anime?limit=30&quality=high`

**Response**: Same format as POST endpoint

#### GET `/api/health`
**Purpose**: Health check endpoint
**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "version": "2.0.0"
}
```



### 3. Simple Pinterest Service

#### Service Improvements
- **Automatic URL Construction**: Build Pinterest search URLs from categories
- **No Authentication Required**: Work without Pinterest login when possible
- **Simple Request Handling**: Direct scraping without queues
- **Resource Cleanup**: Proper browser cleanup after each request

#### New Methods
```typescript
interface ScrapeOptions {
  category: string;
  limit?: number;
  quality?: 'high' | 'medium' | 'low';
}

interface ScrapeResult {
  category: string;
  totalImages: number;  
  images: string[];
  processingTime: string;
}

class PinterestService {
  // Main method
  async scrapeByCategory(options: ScrapeOptions): Promise<ScrapeResult>
  
  // Helper methods
  private buildSearchUrl(category: string): string
  private determineScrollCount(limit: number): number
}
```



### 4. Configuration Management

#### Environment Variables
```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Browser Configuration
CHROME_HEADLESS=true

# Request Limits
DEFAULT_IMAGE_LIMIT=20
MAX_IMAGES_PER_REQUEST=100

# Pinterest Configuration
PINTEREST_BASE_URL=https://pinterest.com/search/pins/?q=
DEFAULT_SCROLL_COUNT=2
```

### 5. Error Handling & Validation

#### Request Validation
- **Input Sanitization**: Validate category and parameters
- **CORS Policies**: Secure cross-origin requests

#### Error Response Format
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

#### Common Error Codes
- `INVALID_CATEGORY`: Category parameter is missing or invalid
- `LIMIT_EXCEEDED`: Requested image limit exceeds maximum allowed
- `SCRAPING_FAILED`: Pinterest scraping operation failed

## Implementation Steps

### Simple Implementation (1-2 Days)
1. Set up Express.js server with TypeScript
2. Create `/api/scrape` endpoint (POST and GET)
3. Create `/api/health` endpoint
4. Refactor Pinterest class for category-based scraping
5. Add basic request validation
6. Test and deploy

## Project Structure

```
Pinterest-Scraper-API/
├── src/
│   ├── controllers/          # API route handlers
│   │   └── scrapeController.ts
│   ├── services/             # Business logic
│   │   └── pinterestService.ts
│   ├── middleware/           # Express middleware
│   │   └── errorHandler.ts
│   ├── types/               # TypeScript definitions
│   │   └── api.d.ts
│   ├── routes/              # API routes
│   │   └── index.ts
│   └── app.ts               # Express app setup
├── package.json
└── tsconfig.json
```

## Dependencies to Add

### Production Dependencies
```json
{
  "express": "^4.18.0",
  "cors": "^2.8.5",
  "selenium-webdriver": "^4.18.1",
  "dotenv": "^16.4.5",
  "chalk": "^4.1.2"
}
```

### Development Dependencies
```json
{
  "@types/express": "^4.17.0",
  "@types/cors": "^2.8.0",
  "@types/selenium-webdriver": "^4.1.22",
  "nodemon": "^2.0.0",
  "ts-node": "^10.9.2",
  "typescript": "^5.4.3"
}
```

## Simple Deployment

### Basic Setup
- Node.js server
- Chrome/ChromeDriver installed
- Environment variables configured
- PM2 for process management (optional)

## Conclusion

This simplified rebuild plan transforms the Pinterest Scraper from a CLI tool into a lightweight HTTP API service. The API accepts category requests and returns image URLs with minimal complexity and overhead.

The implementation is straightforward and can be completed in 1-2 days, perfect for handling occasional requests without over-engineering. 
