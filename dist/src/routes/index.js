"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scrapeController_1 = require("../controllers/scrapeController");
const router = (0, express_1.Router)();
const scrapeController = new scrapeController_1.ScrapeController();
// POST /api/scrape - Main scraping endpoint
router.post('/scrape', scrapeController.scrapeByCategory.bind(scrapeController));
// GET /api/scrape/:category - Alternative GET endpoint
router.get('/scrape/:category', scrapeController.scrapeByCategoryGet.bind(scrapeController));
// GET /api/health - Health check endpoint
router.get('/health', scrapeController.healthCheck.bind(scrapeController));
exports.default = router;
