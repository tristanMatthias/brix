import path from 'path';
import winston from 'winston';

import { Env } from '../config/types';
import { Config } from '../config';

/** * Winston logger instance */
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: path.join(process.cwd(), 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(process.cwd(), 'combined.log') })
  ]
});


/**
 * Setup the logger instance depending on the current Env
 */
export const setupLogger = () => {
  // If we're not in production or test then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  if (Config.env !== Env.production) {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }));
  }
};
