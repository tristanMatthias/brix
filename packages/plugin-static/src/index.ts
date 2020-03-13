import { BrixPlugins, logger } from '@brix/core';
import serveStatic from 'serve-static';
import path from 'path';

export default async (paths?: object) => {
  if (!paths) return;

  BrixPlugins.register({
    name: 'Static',
    middlewares: [app => {
      Object.entries(paths).forEach(([dir, prefix]) => {
        if (prefix === false) return;
        if (typeof prefix === 'string') {
          logger.info(`[Static] Serving ${dir} under ${prefix}`);
          app.use(prefix, serveStatic(dir));
        } else {
          logger.info(`[Static] Serving ${dir} under /${path.basename(dir)}`);
          app.use(`/${path.basename(dir)}`, serveStatic(dir));
        }
      });
    }]
  });
};
