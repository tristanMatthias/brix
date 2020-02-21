import { BrixPlugins } from '@brix/core';

import { render } from './middlewares/render';

export enum ExpressTemplateLang {
  pug = 'pug',
  haml = 'haml.js',
  ejs = 'ejs',
  hbs = 'hbs',
  react = 'react',
  h4e = 'h4e',
  hulk = 'hulk-hogan',
  combyne = 'combyne.js',
  swig = 'swig',
  nunjucks = 'nunjucks',
  marko = 'marko',
  whiskers = 'whiskers',
  blade = 'blade',
  hamlcoffee = 'haml-coffee',
  webfiller = 'webfiller',
  rivets = 'rivets-server',
  exbars = 'exbars',
  liquidjs = 'liquidjs',
  express = 'express-tl',
  vuexpress = 'vuexpress'
}

export interface PluginCMSOptions {
  prefix?: string;
  admin?: boolean;
  viewDir?: string;
}

export default (options: PluginCMSOptions = {}) => {
  const requires: string[] = ['@brix/plugin-entity-user'];
  if (options.admin) requires.push('@brix/plugin-cms-admin');

  BrixPlugins.register({
    name: 'CMS',
    requires,
    middlewares: [render(options)]
  });
};
