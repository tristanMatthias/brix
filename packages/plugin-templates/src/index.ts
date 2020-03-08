import { BrixPlugins, Config } from '@brix/core';
import { WidgetFormFieldSelectOption } from '@brix/plugin-admin';
import path from 'path';

import { renderDynamic } from './middlewares/renderDynamic';
import { renderStatic } from './middlewares/renderStatic';
import queryTemplateData from './queries/templateData';
import { PageResolver } from './resolvers/Page.resolver';
import { TemplateResolver } from './resolvers/Template.resolver';
import { TemplateService } from './services/Template.service';

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

export interface PluginTemplateOptions {
  prefix?: string;
  pagesDir: string;
  templatesDir: string;
}

export let options: PluginTemplateOptions;

export default async (override: Partial<PluginTemplateOptions> = {}) => {
  const defaultOptions: PluginTemplateOptions = {
    pagesDir: path.join(Config.rootDir, 'views/pages'),
    templatesDir: path.join(Config.rootDir, 'views/templates')
  };

  options = {
    ...defaultOptions,
    ...override
  };

  const templates: WidgetFormFieldSelectOption[] = (await TemplateService.findAll()).map(t => ({
    label: t.name,
    value: t.url
  }));
  templates.unshift({
    selected: true,
    label: 'Please select a template',
    disabled: true
  });


  BrixPlugins.register({
    name: 'Templates',
    middlewares: [renderStatic(options), renderDynamic(options)],
    resolvers: [PageResolver, TemplateResolver]
  });

  if (global.BrixAdmin) {
    global.BrixAdmin.register({
      icon: 'note',
      path: '/pages',
      title: 'Pages',
      header: {
        heading: 'Pages',
        icon: 'note',
        buttons: [
          {
            color: 'main',
            text: 'New page',
            icon: 'plus',
            action: { action: 'link', to: '/pages/new' }
          }
        ]
      },

      content: [{
        widget: 'table',
        card: true,
        cardPadding: 0,
        width: 12,
        query: `{pageList { id url title author { id firstName lastName } } } `,
        queryKey: 'pageList',
        columns: [
          { accessor: 'title', header: 'Title' },
          { accessor: 'url', header: 'URL' },
          { cell: '$.author.firstName $.author.lastName', header: 'Author' }
        ],
        rowClick: { action: 'link', to: '/pages/$.id' }
      }],


      pages: [
        {
          path: '/new',
          title: 'New page',
          content: [{
            widget: 'form',
            card: true,
            cardPadding: 2,
            width: 4,
            fields: [
              { widget: 'input', name: 'title', label: 'title', type: 'text', placeholder: 'Title' },
              { widget: 'input', name: 'url', label: 'url', type: 'text', placeholder: 'url' },
              { widget: 'select', name: 'templateUrl', label: 'Template', options: templates },
              { widget: 'query', query: queryTemplateData, variables: { url: '$.templateUrl' }, resultKey: 'template.data' },
              { widget: 'button', text: 'Create page', icon: 'plus' }
            ],
            query: `mutation($page: ECreatePageInput!) { createPage(page:$page) { id } }`,
            variableKey: 'page'
          }]
        },


        {
          path: '/:id',
          title: 'Update page',
          query: `query($id: String!) {
            page (id: $id) {
              id
              title
              url
              templateUrl
              data
            }
          }`,
          queryKey: 'page',
          content: [{
            widget: 'form',
            card: true,
            cardPadding: 2,
            width: 4,
            fields: [
              { widget: 'input', name: 'id', type: 'hidden' },
              { widget: 'input', name: 'title', label: 'title', type: 'text', placeholder: 'Title' },
              { widget: 'input', name: 'url', label: 'url', type: 'text', placeholder: 'url' },
              { widget: 'select', name: 'templateUrl', label: 'Template', options: templates },
              { widget: 'query', query: queryTemplateData, variables: { url: '$.templateUrl' }, resultKey: 'template.data' },
              { widget: 'button', text: 'Update page', icon: 'plus' }
            ],
            query: `mutation($page: EUpdatePageInput!) { updatePage(page:$page) { id } }`,
            variableKey: 'page'
          }]
        }
      ]
    });
  }
};
