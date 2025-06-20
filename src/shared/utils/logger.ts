import fs from 'fs';
import paths from "../constants/paths.js";
import winston from "winston";

// Clear info log file before starting
const infoLogPath = paths.paths.infoLogFile;
fs.truncate(infoLogPath, 0, () => {
  console.log('Info log file cleared');
});

const logConfig = {
    // Use default levels or define your own as `levels`
    level: "info",
    transports: [
        new winston.transports.File({ 
            filename: paths.paths.errorLogFile,
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