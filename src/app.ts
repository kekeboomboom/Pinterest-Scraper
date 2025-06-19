import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import chalk from 'chalk';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(chalk.cyan(`${new Date().toISOString()} - ${req.method} ${req.url}`));
  next();
});

// API Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Pinterest Scraper API v2.0.0',
    endpoints: {
      health: 'GET /api/health',
      scrape_post: 'POST /api/scrape',
      scrape_get: 'GET /api/scrape/:category'
    },
    documentation: {
      post_example: {
        url: '/api/scrape',
        method: 'POST',
        body: {
          category: 'anime',
          limit: 20,
          quality: 'high'
        }
      },
      get_example: {
        url: '/api/scrape/anime?limit=20&quality=high',
        method: 'GET'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
      details: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
      timestamp: new Date().toISOString()
    }
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(chalk.red('Unhandled error:'), error);
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An internal server error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later',
      timestamp: new Date().toISOString()
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(chalk.green('🚀 Pinterest Scraper API is running!'));
  console.log(chalk.blue(`📍 Server: http://localhost:${PORT}`));
  console.log(chalk.blue(`📖 Health Check: http://localhost:${PORT}/api/health`));
  console.log(chalk.blue(`🔍 Example: POST http://localhost:${PORT}/api/scrape`));
  console.log(chalk.yellow('Environment:'), process.env.NODE_ENV || 'development');
});

export default app; 
