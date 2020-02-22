import { Config, logger, BrixPlugins } from '@brix/core';
import chalk from 'chalk';
import { Express } from 'express';
import fs from 'fs-extra';
import path from 'path';


/**
 * Load middleware from the `Config`, or else from the middleware directory
 * @param app Express application
 */
export const loadMiddleware = async (app: Express) => {

  await Promise.all(
    BrixPlugins.middlewares.map(async mw => {
      const res = await mw(app);
      if (res) app.use(res);
    })
  );

  // Load middleware from what was passed in explicitly
  if (Config.middleware) {
    if (Config.middleware instanceof Array) {
      Config.middleware.forEach(mw => app.use(mw));

    } else app.use(Config.middleware);


  } else {
    // Load middleware from the project root
    const dir = Config.middlewareDir || path.join(Config.rootDir, 'middleware');

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
