"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const CACHE_DIR = path_1.default.resolve(__dirname, '../../cache');
if (!fs_1.default.existsSync(CACHE_DIR)) {
    fs_1.default.mkdirSync(CACHE_DIR);
}
class FileService {
    static write(filename, data) {
        try {
            const filePath = path_1.default.join(CACHE_DIR, filename);
            console.log(chalk_1.default.blue(`Writing ${data.length} URLs to ${filePath}...`));
            fs_1.default.writeFileSync(filePath, data.join('\n'));
            console.log(chalk_1.default.green(`Successfully wrote to ${filename}`));
        }
        catch (error) {
            console.error(chalk_1.default.red(`Error writing to file ${filename}:`), error);
        }
    }
    static read(filename) {
        try {
            const filePath = path_1.default.join(CACHE_DIR, filename);
            console.log(chalk_1.default.blue(`Reading from cache file: ${filePath}`));
            if (!fs_1.default.existsSync(filePath)) {
                console.warn(chalk_1.default.yellow(`Cache file ${filename} not found.`));
                return [];
            }
            const content = fs_1.default.readFileSync(filePath, 'utf-8');
            console.log(chalk_1.default.green(`Successfully read ${content.split('\n').length} lines from ${filename}.`));
            return content.split('\n').filter(line => line.trim() !== '');
        }
        catch (error) {
            console.error(chalk_1.default.red(`Error reading from file ${filename}:`), error);
            return [];
        }
    }
}
exports.FileService = FileService;
