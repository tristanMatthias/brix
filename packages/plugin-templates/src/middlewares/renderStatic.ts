import { Config, logger } from '@brix/core';
import consolidate from 'consolidate';
import { Express, Router } from 'express';
import path from 'path';
import recursive from 'recursive-readdir';

import { PluginTemplateOptions } from '..';

/**
 * Enables pages to be rendered
 * @param options Template Options
 */
export const renderStatic = (options: PluginTemplateOptions) =>
  async (app: Express) => {
    const viewDir = options.pagesDir || path.resolve(Config.distDir, 'views');
    app.set('views', viewDir);

    const router = Router();


    /**
     * Load all available pages and templates able to be rendered and store in
     * `res.locals.templates`
     */
    router.use(async (_req, res, next) => {
      const files = (await recursive(viewDir, ['*.gql']));

      const paths = files
        .map(p => path.relative(viewDir, (p)))
        .reduce((paths, f, i) => {
          const _p = f.slice(0, path.extname(f).length * -1);
          paths[`/${_p}`] = files[i];
          if (_p.split('/').pop() === 'index') {
            paths[`/${_p.split('/').slice(0, -1).join('/')}`] = files[i];
          }
          return paths;
        }, {} as { [path: string]: string });

      res.locals.templates = paths;
      next();
    });


    /**
     * If the `req.url` exists in the `res.locals.templates`, attempt to render
     * it.
     */
    router.use(async (req, res, next) => {
      if (res.locals.templates[req.url]) {
        try {
          // TODO: Move off pug
          const data = await consolidate.pug(
            res.locals.templates[req.url],
            res.locals
          );
          res.send(data);
        } catch (e) {
          logger.error(e);
          next();
        }
      }
      else next();
    });


    // Prefix the router
    if (options.prefix) app.use(options.prefix, router);
    else app.use(router);
  };
