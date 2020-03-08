import walk from 'walk-sync';

import { options } from '..';
import { ETemplate } from '../entities/Template.entity';
import path from 'path';
import fs from 'fs-extra';
import { Config, Env, logger } from '@brix/core';
import consolidate from 'consolidate';

export const templateFileEngineMap: { [ext: string]: keyof typeof consolidate } = {
  pug: 'pug',
  haml: 'haml',
  ejs: 'ejs',
  hbs: 'handlebars',
  jsx: 'react',
  swig: 'swig',
  nunjucks: 'nunjucks',
  marko: 'marko',
  whiskers: 'whiskers',
  hamlcoffee: 'haml-coffee'
};

export abstract class TemplateService {
  static templateFiles: string[];
  static templates: ETemplate[];

  static findAll(): ETemplate[] {
    return this.getTemplates();
  }

  static async findByUrl(url: string) {
    await this.getTemplates();
    return this.templates.find(t => t.url === url);
  }

  static getEngine(ext: keyof typeof templateFileEngineMap) {
    return templateFileEngineMap[ext];
  }

  private static getTemplates() {
    // Don't refresh on prod
    if (Config.env === Env.production && this.templates) return this.templates;
    this.templateFiles = walk(
      options.templatesDir,
      { globs: Object.keys(templateFileEngineMap).map(ext => `**/*.${ext}`) }
    );

    return this.templates = this.templateFiles.map<ETemplate>(f => {
      const name = path.basename(f).split('.').slice(0, -1).join('.');
      const dir = path.dirname(f);
      const dataJson = path.join(options.templatesDir, dir, `${name}.json`);
      const data = fs.existsSync(dataJson) ? require(dataJson) : [];

      if (!(data instanceof Array)) {
        throw new Error(`[TemplatesPlugin] ${dataJson} does not export a form field array. Received '${typeof data}'`);
      }

      const type = path.extname(f).slice(1) as keyof typeof templateFileEngineMap;
      if (!this.getEngine(type)) logger.error(`Unknown template extension ${type}`);

      return { name, data, type, url: f, };
    });
  }
}
