// Browser-safe logger that doesn't import Node.js modules
const isDevelopment = typeof window !== 'undefined' && import.meta.env?.DEV;

export const logger = {
  error: (message: string, meta?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      console.error(message, meta);
    }
  },
  info: (message: string, meta?: Record<string, any>) => {
    if (isDevelopment && typeof window !== 'undefined') {
      console.info(message, meta);
    }
  },
  warn: (message: string, meta?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      console.warn(message, meta);
    }
  },
  debug: (message: string, meta?: Record<string, any>) => {
    if (isDevelopment && typeof window !== 'undefined') {
      console.debug(message, meta);
    }
  }
};

export const logError = (error: Error, context?: Record<string, any>) => {
  logger.error('Application Error', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
};

export const logInfo = (message: string, meta?: Record<string, any>) => {
  logger.info(message, meta);
};

export const logWarning = (message: string, meta?: Record<string, any>) => {
  logger.warn(message, meta);
};