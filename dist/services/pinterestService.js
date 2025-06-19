"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
const chalk_1 = __importDefault(require("chalk"));
const errorHandler_1 = __importDefault(require("./errorHandler"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
/**
 * @class PinterestService
 * @description A service to scrape images from Pinterest by category without authentication.
 */
class PinterestService {
    driver = null;
    pinList = [];
    static instance;
    initializationPromise = null;
    constructor() { }
    static getInstance() {
        if (!PinterestService.instance) {
            PinterestService.instance = new PinterestService();
        }
        return PinterestService.instance;
    }
    /**
     * Main method to scrape Pinterest images by category
     */
    async scrapeByCategory(options) {
        const startTime = Date.now();
        try {
            await this.initializeBrowser();
            this.pinList = []; // Reset pin list
            // Build search URL
            const searchUrl = this.buildSearchUrl(options.category);
            console.log(chalk_1.default.blue(`Navigating to: ${searchUrl}`));
            // Navigate to Pinterest search
            await this.driver.get(searchUrl);
            await this.driver.manage().setTimeouts({ implicit: 1500 });
            // Perform scrolling and image collection until the limit is reached
            if (this.driver) {
                let lastHeight = await this.driver.executeScript('return document.body.scrollHeight');
                while (this.pinList.length < (options.limit || 20)) {
                    await this.scrollAndCollect();
                    console.log(chalk_1.default.green(`Collected ${this.pinList.length} images so far...`));
                    // Break if we have enough images
                    if (this.pinList.length >= (options.limit || 20)) {
                        break;
                    }
                    const newHeight = await this.driver.executeScript('return document.body.scrollHeight');
                    if (newHeight === lastHeight) {
                        console.warn(chalk_1.default.yellow('No more content to load. Stopping scroll.'));
                        break; // Exit if the page height isn't changing, indicating no new content
                    }
                    lastHeight = newHeight;
                }
            }
            // Filter accessible images
            const accessibleImages = await this.filterAccessibleImages(this.pinList);
            // Apply limit
            const limitedImages = accessibleImages.slice(0, options.limit || 20);
            return {
                category: options.category,
                totalImages: limitedImages.length,
                images: limitedImages
            };
        }
        catch (error) {
            // No longer quitting browser here to allow reuse
            throw new errorHandler_1.default(`Scraping failed: ${error.message}`);
        }
    }
    /**
     * Initialize browser with appropriate settings
     */
    initializeBrowser() {
        if (!this.initializationPromise) {
            console.log(chalk_1.default.yellow('Browser not initialized. Initializing...'));
            this.initializationPromise = this._initializeBrowser();
        }
        return this.initializationPromise;
    }
    async _initializeBrowser() {
        const headless = process.env.CHROME_HEADLESS !== 'false';
        const serviceBuilder = new chrome.ServiceBuilder('/opt/homebrew/bin/chromedriver');
        console.log(chalk_1.default.blue(`Initializing Chrome driver... Headless: ${headless}`));
        try {
            this.driver = new selenium_webdriver_1.Builder()
                .forBrowser('chrome')
                .setChromeService(serviceBuilder)
                .setChromeOptions(new chrome.Options()
                .windowSize({ width: 1920, height: 1080 })
                .addArguments(headless ? '--headless' : '')
                .addArguments('--disable-gpu', '--log-level=3', '--no-sandbox', '--disable-dev-shm-usage'))
                .build();
            console.log(chalk_1.default.green('Browser initialized successfully.'));
        }
        catch (error) {
            console.error(chalk_1.default.red('Failed to initialize browser:'), error);
            this.initializationPromise = null; // Reset promise on failure
            throw error;
        }
    }
    /**
     * Build Pinterest search URL from category
     */
    buildSearchUrl(category) {
        const baseUrl = process.env.PINTEREST_BASE_URL || 'https://pinterest.com/search/pins/?q=';
        const encodedCategory = encodeURIComponent(category.trim());
        return `${baseUrl}${encodedCategory}`;
    }
    /**
     * Scroll page and collect images
     */
    async scrollAndCollect() {
        if (!this.driver)
            throw new Error('Driver not initialized');
        // Scroll to bottom and collect
        await this.driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
        await this.driver.sleep(2000); // Wait for images to load
        await this.collectImagesFromPage();
    }
    /**
     * Collect images from current page
     */
    async collectImagesFromPage() {
        if (!this.driver)
            return;
        try {
            // Use a more specific and efficient selector for Pinterest image elements
            const imageElements = await this.driver.findElements(selenium_webdriver_1.By.css('img[src*="i.pinimg.com"]'));
            for (const imageElement of imageElements) {
                try {
                    const source = await imageElement.getAttribute('src');
                    if (source) {
                        // Filter Pinterest images and avoid duplicates
                        if (this.isPinterestImage(source) && !this.pinList.includes(source)) {
                            const cleanedUrl = this.cleanImageUrl(source);
                            this.pinList.push(cleanedUrl);
                        }
                    }
                }
                catch (error) {
                    if (error.name !== 'StaleElementReferenceError') {
                        // A stale element reference means the element was removed from the DOM. We can safely ignore this.
                        console.warn(chalk_1.default.yellow('Error getting image source:', error.message));
                    }
                }
            }
        }
        catch (error) {
            console.warn(chalk_1.default.yellow('Failed to collect images from page:', error.message));
        }
    }
    /**
     * Check if URL is a valid Pinterest image
     */
    isPinterestImage(url) {
        return url.includes('pinimg.com') &&
            !url.includes('75x75_RS') &&
            !url.includes('/30x30_RS/') &&
            !url.includes('avatar') &&
            (url.includes('originals') || url.includes('564x'));
    }
    /**
     * Clean and enhance image URL for better quality
     */
    cleanImageUrl(url) {
        // Convert to original size if possible
        if (url.includes('564x')) {
            return url.replace('/564x/', '/originals/').replace(/\/\d+x\d+\//, '/originals/');
        }
        return url;
    }
    /**
     * Filter accessible images (remove 403/404 responses)
     */
    async filterAccessibleImages(imageUrls) {
        console.log(chalk_1.default.blue(`Filtering ${imageUrls.length} images for accessibility...`));
        const accessibleImages = [];
        const batchSize = 10; // Process in batches to avoid overwhelming
        for (let i = 0; i < imageUrls.length; i += batchSize) {
            const batch = imageUrls.slice(i, i + batchSize);
            const promises = batch.map(url => this.checkUrlAccessibility(url));
            try {
                const results = await Promise.allSettled(promises);
                results.forEach((result, index) => {
                    if (result.status === 'fulfilled' && result.value) {
                        accessibleImages.push(batch[index]);
                    }
                });
            }
            catch (error) {
                console.warn(chalk_1.default.yellow('Batch accessibility check failed:', error.message));
                // Add URLs anyway if batch check fails
                accessibleImages.push(...batch);
            }
        }
        console.log(chalk_1.default.green(`${accessibleImages.length} accessible images found`));
        return accessibleImages;
    }
    /**
     * Check if URL is accessible
     */
    async checkUrlAccessibility(url) {
        return new Promise((resolve) => {
            const request = url.startsWith('https') ? https_1.default : http_1.default;
            const timeoutDuration = 2000; // 2 second timeout
            const req = request.request(url, { method: 'HEAD', timeout: timeoutDuration }, (res) => {
                resolve(res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 400);
            });
            req.on('error', () => resolve(false));
            req.on('timeout', () => {
                req.destroy();
                resolve(false);
            });
            req.setTimeout(timeoutDuration, () => {
                req.destroy();
                resolve(false);
            });
            req.end();
        });
    }
    /**
     * Clean up browser resources
     */
    async cleanup() {
        if (this.driver) {
            try {
                await this.driver.quit();
                this.driver = null;
                this.initializationPromise = null;
                console.log(chalk_1.default.yellow('Browser instance cleaned up.'));
            }
            catch (error) {
                console.warn(chalk_1.default.yellow('Browser cleanup warning:', error.message));
            }
        }
    }
    /**
     * Gracefully shuts down the browser instance
     */
    async shutdown() {
        await this.cleanup();
    }
}
exports.default = PinterestService;
