import chalk from 'chalk';
import path from 'path';
import winston from 'winston';

import { Config } from '../config';
import { Env } from '../config/types';

declare module 'winston' {
  export interface Logger {
    success: winston.LeveledLogMethod;
  }
}

/** * Winston logger instance */
export const logger = winston.createLogger({
  levels: {
    error: 0,
    warning: 1,
    info: 2,
    success: 3
  },
  level: 'info',
  transports: [
    new winston.transports.File({ filename: path.join(Config?.rootDir || process.cwd(), 'error.log'), level: 'error' })
  ]
});

winston.addColors({
  info: 'blue',
  warning: 'yellow',
  success: 'green',
  error: 'red'
});


let setupDev = false;
/**
 * Setup the logger instance depending on the current Env
 */
export const setupLogger = (env: Env = Config.env, logLevel = Config.logLevel) => {

  /**
   * If we're not in production or test then log to the `console` with the format:
   * `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
   */
  if (env !== Env.production && !setupDev) {
    logger.add(new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.printf(info => {
          let icon;
          let color: keyof typeof chalk;
          switch (info.level) {
            case 'error':
              icon = '❌';
              color = 'red';
              break;
            case 'warning':
              icon = '⚠️';
              color = 'yellow';
              break;
            case 'success':
              icon = '✅';
              color = 'greenBright';
              break;
            default:
            case 'info':
              icon = 'ℹ️ ';
              color = 'dim';
              break;
          }
          return chalk[color](`${icon} ${info.message}`);
        })
      )
    }));
    logger.add(new winston.transports.File({
      filename: path.join(Config.rootDir, 'debug.log')
    }));
    setupDev = true;

  }

  if (logLevel && logger.transports[1]) logger.transports[1].level = logLevel;

};
