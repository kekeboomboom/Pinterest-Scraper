import { Router } from 'express';
import { ScrapeController } from '../controllers/scrapeController';

const router = Router();
const scrapeController = new ScrapeController();

// POST /api/scrape - Main scraping endpoint
router.post('/scrape', scrapeController.scrapeByCategory.bind(scrapeController));

// GET /api/scrape/:category - Alternative GET endpoint
router.get('/scrape/:category', scrapeController.scrapeByCategoryGet.bind(scrapeController));

// GET /api/health - Health check endpoint
router.get('/health', scrapeController.healthCheck.bind(scrapeController));

export default router; 
