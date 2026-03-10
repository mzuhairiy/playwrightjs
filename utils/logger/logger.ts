import winston from 'winston';
import path from 'path';

// Define log levels
const levels: Record<string, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
};

// Define colors for each level
const colors: Record<string, string> = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue'
};

// Create the logger
const logger = winston.createLogger({
    levels: levels,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        // Console logging
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // File logging - separate files for different log levels
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/error.log'),
            level: 'error'
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/combined.log')
        })
    ]
});

winston.addColors(colors);

// Add test context information to logs
const addTestInfo = (testInfo: { title: string }) => {
    return (message: string): string => {
        return `[${testInfo.title}] ${message}`;
    };
};

export { logger, addTestInfo };
