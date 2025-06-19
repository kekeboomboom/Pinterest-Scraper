"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const pinterestService_1 = __importDefault(require("./services/pinterestService"));
const fileService_1 = require("./services/fileService");
const FILENAME = 'top10_animal.txt';
const runScrape = async () => {
    console.log(chalk_1.default.cyan('Starting standalone scrape for "animal" category...'));
    const pinterestService = pinterestService_1.default.getInstance();
    try {
        const result = await pinterestService.scrapeByCategory({
            category: 'animal',
            limit: 10,
            quality: 'high',
        });
        console.log(chalk_1.default.magenta(`Scrape found ${result.images.length} images.`));
        if (result.images.length > 0) {
            fileService_1.FileService.write(FILENAME, result.images);
        }
        else {
            console.warn(chalk_1.default.yellow('No images were found during the scrape.'));
        }
    }
    catch (error) {
        console.error(chalk_1.default.red('An error occurred during the scrape:'), error);
    }
    finally {
        await pinterestService.shutdown();
        console.log(chalk_1.default.yellow('Scraper has finished and browser has been shut down.'));
    }
};
runScrape();
