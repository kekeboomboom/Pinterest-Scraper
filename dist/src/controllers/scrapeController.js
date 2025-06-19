"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapeController = void 0;
const pinterestService_1 = __importDefault(require("../services/pinterestService"));
const chalk_1 = __importDefault(require("chalk"));
class ScrapeController {
    pinterestService;
    constructor() {
        this.pinterestService = new pinterestService_1.default();
    }
    /**
     * POST /api/scrape - Scrape Pinterest images by category
     */
    async scrapeByCategory(req, res) {
        const startTime = Date.now();
        try {
            const { category, limit, quality } = req.body;
            // Validate request
            if (!category || typeof category !== 'string' || category.trim().length === 0) {
                const errorResponse = {
                    success: false,
                    error: {
                        code: 'INVALID_CATEGORY',
                        message: 'The provided category is invalid or empty',
                        details: 'Category must be a non-empty string with alphanumeric characters',
                        timestamp: new Date().toISOString()
                    }
                };
                res.status(400).json(errorResponse);
                return;
            }
            // Validate limit
            const requestLimit = limit || parseInt(process.env.DEFAULT_IMAGE_LIMIT || '20');
            const maxLimit = parseInt(process.env.MAX_IMAGES_PER_REQUEST || '100');
            if (requestLimit > maxLimit) {
                const errorResponse = {
                    success: false,
                    error: {
                        code: 'LIMIT_EXCEEDED',
                        message: `Requested image limit exceeds maximum allowed (${maxLimit})`,
                        details: `Please request ${maxLimit} or fewer images`,
                        timestamp: new Date().toISOString()
                    }
                };
                res.status(400).json(errorResponse);
                return;
            }
            console.log(chalk_1.default.blue(`Starting scrape for category: ${category}, limit: ${requestLimit}`));
            // Perform scraping
            const result = await this.pinterestService.scrapeByCategory({
                category: category.trim(),
                limit: requestLimit,
                quality: quality || 'high'
            });
            const processingTime = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
            const response = {
                success: true,
                data: {
                    ...result,
                    processingTime
                }
            };
            console.log(chalk_1.default.green(`Scraping completed. Found ${result.totalImages} images in ${processingTime}`));
            res.json(response);
        }
        catch (error) {
            console.error(chalk_1.default.red('Scraping failed:'), error);
            const errorResponse = {
                success: false,
                error: {
                    code: 'SCRAPING_FAILED',
                    message: 'Pinterest scraping operation failed',
                    details: error.message,
                    timestamp: new Date().toISOString()
                }
            };
            res.status(500).json(errorResponse);
        }
    }
    /**
     * GET /api/scrape/:category - Alternative GET endpoint for category scraping
     */
    async scrapeByCategoryGet(req, res) {
        const startTime = Date.now();
        try {
            const { category } = req.params;
            const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
            const quality = req.query.quality;
            // Validate category
            if (!category || category.trim().length === 0) {
                const errorResponse = {
                    success: false,
                    error: {
                        code: 'INVALID_CATEGORY',
                        message: 'The provided category is invalid or empty',
                        details: 'Category must be a non-empty string',
                        timestamp: new Date().toISOString()
                    }
                };
                res.status(400).json(errorResponse);
                return;
            }
            // Validate limit
            const requestLimit = limit || parseInt(process.env.DEFAULT_IMAGE_LIMIT || '20');
            const maxLimit = parseInt(process.env.MAX_IMAGES_PER_REQUEST || '100');
            if (requestLimit > maxLimit) {
                const errorResponse = {
                    success: false,
                    error: {
                        code: 'LIMIT_EXCEEDED',
                        message: `Requested image limit exceeds maximum allowed (${maxLimit})`,
                        details: `Please request ${maxLimit} or fewer images`,
                        timestamp: new Date().toISOString()
                    }
                };
                res.status(400).json(errorResponse);
                return;
            }
            console.log(chalk_1.default.blue(`Starting GET scrape for category: ${category}, limit: ${requestLimit}`));
            // Perform scraping
            const result = await this.pinterestService.scrapeByCategory({
                category: category.trim(),
                limit: requestLimit,
                quality: quality || 'high'
            });
            const processingTime = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
            const response = {
                success: true,
                data: {
                    ...result,
                    processingTime
                }
            };
            console.log(chalk_1.default.green(`GET scraping completed. Found ${result.totalImages} images in ${processingTime}`));
            res.json(response);
        }
        catch (error) {
            console.error(chalk_1.default.red('GET scraping failed:'), error);
            const errorResponse = {
                success: false,
                error: {
                    code: 'SCRAPING_FAILED',
                    message: 'Pinterest scraping operation failed',
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
