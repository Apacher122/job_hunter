import winston from "winston";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Clear info log file before starting
const infoLogPath = path.resolve(__dirname, "../logs/info.log");
fs.truncate(infoLogPath, 0, () => {
  console.log('Info log file cleared');
});

const logConfig = {
    // Use default levels or define your own as `levels`
    level: "info",
    transports: [
        new winston.transports.File({ 
            filename: path.resolve(__dirname, "../logs/error.log"),
            level: "error",
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message, stack }) =>
                    `${timestamp} [${level}]: ${stack || message}`
                )
            )
        }),
    
        new winston.transports.File({
            filename: infoLogPath,
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message }) =>
                    `${timestamp} [${level}]: ${message}`
                )
            )
        }),
    ]
};

export const logger = winston.createLogger(logConfig);