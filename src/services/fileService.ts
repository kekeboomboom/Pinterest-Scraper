import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const CACHE_DIR = path.resolve(__dirname, '../../cache');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

export class FileService {
  public static write(filename: string, data: string[]): void {
    try {
      const filePath = path.join(CACHE_DIR, filename);
      console.log(chalk.blue(`Writing ${data.length} URLs to ${filePath}...`));
      fs.writeFileSync(filePath, data.join('\n'));
      console.log(chalk.green(`Successfully wrote to ${filename}`));
    } catch (error) {
      console.error(chalk.red(`Error writing to file ${filename}:`), error);
    }
  }

  public static read(filename: string): string[] {
    try {
      const filePath = path.join(CACHE_DIR, filename);
      console.log(chalk.blue(`Reading from cache file: ${filePath}`));
      if (!fs.existsSync(filePath)) {
        console.warn(chalk.yellow(`Cache file ${filename} not found.`));
        return [];
      }
      const content = fs.readFileSync(filePath, 'utf-8');
      console.log(chalk.green(`Successfully read ${content.split('\n').length} lines from ${filename}.`));
      return content.split('\n').filter(line => line.trim() !== '');
    } catch (error) {
      console.error(chalk.red(`Error reading from file ${filename}:`), error);
      return [];
    }
  }
} 
