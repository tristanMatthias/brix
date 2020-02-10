import chalk from 'chalk';
import { Express } from 'express';
import fs from 'fs-extra';
import path from 'path';

import { CONFIG } from '../../config';
import { logger } from '../../lib/logger';

/**
 * Load middleware from the `CONFIG`, or else from the middleware directory
 * @param app Express application
 */
export const loadMiddleware = async (app: Express) => {

  // Load middleware from what was passed in explicitly
  if (CONFIG.middleware) {
    if (CONFIG.middleware instanceof Array) {
      CONFIG.middleware.forEach(mw => app.use(mw));

    } else app.use(CONFIG.middleware);


  } else {
    // Load middleware from the project root
    const dir = CONFIG.middlewareDir || path.join(CONFIG.rootDir, 'middleware');

    if (await fs.pathExists(dir)) {
      const files = (await fs.readdir(dir)).filter(f => f.endsWith('.js'));
      files.forEach(async f => {
        const fp = path.join(dir, f);
        const mw = await import(fp);

        if (!mw.default) {
          return logger.error(
            `'${chalk.yellow(fp)}' does not export a default Express router or middleware function`
          );
        }

        app.use(mw.default);
        logger.info(`Loaded middleware ${chalk.yellow(f)}`);
        return mw;
      });
    }
  }
};
