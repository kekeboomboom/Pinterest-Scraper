import { Router } from 'express';
import { ScrapeController } from '../controllers/scrapeController';

const router = Router();
const scrapeController = new ScrapeController();

// POST /api/scrape - Main scraping endpoint
router.post('/scrape', scrapeController.getImages.bind(scrapeController));

// GET /api/scrape - Alternative GET endpoint
router.get('/scrape', scrapeController.getImagesGet.bind(scrapeController));

// GET /api/health - Health check endpoint
router.get('/health', scrapeController.healthCheck.bind(scrapeController));

export default router; 
