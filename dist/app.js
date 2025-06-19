"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const chalk_1 = __importDefault(require("chalk"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging middleware
app.use((req, res, next) => {
    console.log(chalk_1.default.cyan(`${new Date().toISOString()} - ${req.method} ${req.url}`));
    next();
});
// API Routes
app.use('/api', routes_1.default);
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
app.use((error, req, res, next) => {
    console.error(chalk_1.default.red('Unhandled error:'), error);
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
    console.log(chalk_1.default.green('🚀 Pinterest Scraper API is running!'));
    console.log(chalk_1.default.blue(`📍 Server: http://localhost:${PORT}`));
    console.log(chalk_1.default.blue(`📖 Health Check: http://localhost:${PORT}/api/health`));
    console.log(chalk_1.default.blue(`🔍 Example: POST http://localhost:${PORT}/api/scrape`));
    console.log(chalk_1.default.yellow('Environment:'), process.env.NODE_ENV || 'development');
});
exports.default = app;
