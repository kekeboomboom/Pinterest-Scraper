"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapeController = void 0;
const fileService_1 = require("../services/fileService");
const chalk_1 = __importDefault(require("chalk"));
const FILENAME = 'top10_animal.txt';
class ScrapeController {
    constructor() { }
    /**
     * POST /api/scrape - Scrape Pinterest images by category
     */
    async scrapeByCategory(req, res) {
        const startTime = Date.now();
        try {
            const { category, limit } = req.body;
            // For now, we only support 'animal' from the cache
            if (category !== 'animal') {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_CATEGORY',
                        message: 'This API currently only supports the "animal" category.',
                        timestamp: new Date().toISOString()
                    }
                });
                return;
            }
            const allImages = fileService_1.FileService.read(FILENAME);
            const requestLimit = limit || 10;
            const images = allImages.slice(0, requestLimit);
            const processingTime = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
            const response = {
                success: true,
                data: {
                    category: 'animal',
                    totalImages: images.length,
                    images: images,
                    processingTime
                }
            };
            console.log(chalk_1.default.green(`Retrieved ${images.length} images from cache in ${processingTime}`));
            res.json(response);
        }
        catch (error) {
            console.error(chalk_1.default.red('Failed to retrieve images from cache:'), error);
            const errorResponse = {
                success: false,
                error: {
                    code: 'CACHE_READ_FAILED',
                    message: 'Failed to read images from the cache',
                    details: error.message,
                    timestamp: new Date().toISOString()
                }
            };
            res.status(500).json(errorResponse);
        }
    }
    /**
     * GET /api/scrape/:category - This endpoint will also use the cache
     */
    async scrapeByCategoryGet(req, res) {
        const startTime = Date.now();
        try {
            const { category } = req.params;
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            // For now, we only support 'animal' from the cache
            if (category !== 'animal') {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_CATEGORY',
                        message: 'This API currently only supports the "animal" category.',
                        timestamp: new Date().toISOString()
                    }
                });
                return;
            }
            const allImages = fileService_1.FileService.read(FILENAME);
            const images = allImages.slice(0, limit);
            const processingTime = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
            const response = {
                success: true,
                data: {
                    category: 'animal',
                    totalImages: images.length,
                    images: images,
                    processingTime
                }
            };
            console.log(chalk_1.default.green(`Retrieved ${images.length} images from cache in ${processingTime}`));
            res.json(response);
        }
        catch (error) {
            console.error(chalk_1.default.red('Failed to retrieve images from cache:'), error);
            const errorResponse = {
                success: false,
                error: {
                    code: 'CACHE_READ_FAILED',
                    message: 'Failed to read images from the cache',
                    details: error.message,
                    timestamp: new Date().toISOString()
                }
            };
            res.status(500).json(errorResponse);
        }
    }
    /**
     * GET /api/health - Health check endpoint
     */
    async healthCheck(req, res) {
        const response = {
            success: true,
            data: {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                version: '2.0.0'
            }
        };
        res.json(response);
    }
}
exports.ScrapeController = ScrapeController;
