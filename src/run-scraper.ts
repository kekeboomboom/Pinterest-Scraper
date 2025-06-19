import dotenv from 'dotenv';
dotenv.config();

import chalk from 'chalk';
import PinterestService from './services/pinterestService';
import { FileService } from './services/fileService';

const FILENAME = 'top10_home.txt';

const runScrape = async () => {
  console.log(chalk.cyan('Starting standalone scrape for Pinterest home feed...'));
  const pinterestService = PinterestService.getInstance();

  try {
    const result = await pinterestService.scrapeHomepage({
      limit: 10,
    });

    console.log(chalk.magenta(`Scrape found ${result.images.length} images.`));

    if (result.images.length > 0) {
      FileService.write(FILENAME, result.images);
    } else {
      console.warn(chalk.yellow('No images were found during the scrape.'));
    }
  } catch (error) {
    console.error(chalk.red('An error occurred during the scrape:'), error);
  } finally {
    await pinterestService.shutdown();
    console.log(chalk.yellow('Scraper has finished and browser has been shut down.'));
  }
};

runScrape(); 
