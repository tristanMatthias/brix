import { Config, Env } from '@brix/core';
import { getStore } from '@brix/model';
import consolidate from 'consolidate';
import { Express, Router } from 'express';
import path from 'path';

import { PluginTemplateOptions } from '..';
import { EMenu } from '../entities/Menu.entity';
import { EPage } from '../entities/Page.entity';
import { TemplateService } from '../services/Template.service';

/**
 * Enables pages to be rendered
 * @param options Template Options
 */
export const renderDynamic = (options: PluginTemplateOptions) =>
  async (app: Express) => {
    // const { templatesDir } = options;
    const router = Router();
    const Page = getStore().model<EPage>('Page');
    const Menu = getStore().model<EMenu>('Menu');

    router.use(async (req, res, next) => {
      const page = await Page.findOne({ where: { url: req.url } });
      const menus = await Menu.findAll();
      if (!page) return next();

      const template = (await TemplateService.findByUrl(page.templateUrl))!;
      try {
        const query = await TemplateService.query(template.url, {
          url: req.url,
          ...page.data
        });
        console.log(query, page.data);


        const render = await (consolidate[TemplateService.getEngine(template.type)] as any)(
          path.join(options.templatesDir, template.url),
          {
            cache: Config.env === Env.production,
            ...page,
            menus,
            query
          }
        );
        res.send(render);
      } catch (e) {
        next(e);
      }
    });

    // Prefix the router
    if (options.prefix) app.use(options.prefix, router);
    else app.use(router);
  };
