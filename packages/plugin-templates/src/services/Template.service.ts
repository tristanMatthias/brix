import { Config, Env, getSchema, logger } from '@brix/core';
import consolidate from 'consolidate';
import fs from 'fs-extra';
import { graphql } from 'graphql';
import path from 'path';
import walk from 'walk-sync';

import { options } from '..';
import { ETemplate } from '../entities/Template.entity';

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
  private static _gqlFiles: { [path: string]: string } = {};

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

  static async getGQLFile(file: string) {

    if (Config.env !== Env.production || !this._gqlFiles[file]) {
      try {
        const gql = (await fs.readFile(file)).toString();
        this._gqlFiles[file] = gql;
        return gql;
      } catch (e) {
        return;
      }
    } return this._gqlFiles[file];
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

  static async query(url: string, variables: object) {
    const name = path.basename(url).split('.').slice(0, -1).join('.');
    const dir = path.dirname(url);
    const gql = await this.getGQLFile(path.join(options.templatesDir, dir, `${name}.gql`));
    if (gql) return (await graphql(getSchema(), gql, null, null, variables)).data;
    return;
  }
}
