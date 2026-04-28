import winston from 'winston';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';

const isDevelopment = process.env.NODE_ENV === 'development';

// Ensure logs directory exists
try {
  await mkdir('logs', { recursive: true });
} catch (error) {
  console.warn('Could not create logs directory:', error);
}

export const serverLogger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'bukidgo-server' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (isDevelopment) {
  serverLogger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export const logServerError = (error: Error, context?: Record<string, any>) => {
  serverLogger.error('Server Error', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
};

export const logServerInfo = (message: string, meta?: Record<string, any>) => {
  serverLogger.info(message, meta);
};

export const logServerWarning = (message: string, meta?: Record<string, any>) => {
  serverLogger.warn(message, meta);
};