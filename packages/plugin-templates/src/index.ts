import { BrixPlugins, Config } from '@brix/core';
import { WidgetFormFieldSelectOption } from '@brix/plugin-admin';
import path from 'path';

import { renderDynamic } from './middlewares/renderDynamic';
import { renderStatic } from './middlewares/renderStatic';
import queryTemplateData from './queries/templateData';
import { PageResolver } from './resolvers/Page.resolver';
import { TemplateResolver } from './resolvers/Template.resolver';
import { TemplateService } from './services/Template.service';
import { MenuResolver, MenuItemResolver } from './resolvers/Menu.resolver';
import { EAdminPage } from '@brix/plugin-admin/dist/plugin/Admin.resolver';

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

const PREFIX = '/cms';

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

  const menu: EAdminPage['menu'] = [
    { to: `${PREFIX}/pages`, text: 'Pages', icon: 'page' },
    { to: `${PREFIX}/menus/`, text: 'Menus', icon: 'menu' }
  ];

  const header: EAdminPage['header'] = {
    heading: 'CMS',
    icon: 'note',
    buttons: [
      {
        color: 'main',
        text: 'New page',
        icon: 'plus',
        action: { action: 'link', to: `${PREFIX}/pages/new` }
      }
    ]
  };


  BrixPlugins.register({
    name: 'CMS',
    middlewares: [renderStatic(options), renderDynamic(options)],
    resolvers: [
      PageResolver,
      TemplateResolver,
      MenuResolver,
      MenuItemResolver
    ]
  });

  if (global.BrixAdmin) {
    global.BrixAdmin.register({
      icon: 'note',
      path: PREFIX,
      title: 'Pages',
      menu,
      header,
      content: [],


      pages: [
        {
          path: '/pages/',
          title: 'Pages',
          menu,
          header,
          content: [{
            widget: 'table',
            card: true,
            cardPadding: 0,
            width: 8,
            query: `{pages { id url title author { id firstName lastName } } } `,
            queryKey: 'pages',
            columns: [
              { accessor: 'title', header: 'Title' },
              { accessor: 'url', header: 'URL' },
              { cell: '$.author.firstName $.author.lastName', header: 'Author' }
            ],
            rowClick: { action: 'link', to: `${PREFIX}/pages/$.id` }
          }]
        },
        {
          path: '/pages/new',
          title: 'New page',
          menu,
          header,
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
          path: '/pages/:id',
          title: 'Update page',
          menu,
          header,
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
        },


        {
          path: '/menus/',
          title: 'Menus',
          menu,
          header,
          queryKey: 'menu',
          content: [{
            widget: 'table',
            card: true,
            cardPadding: 0,
            width: 8,
            query: `{menus { id name size } }`,
            queryKey: 'menus',
            columns: [
              { accessor: 'name', header: 'Name' },
              { accessor: 'size', header: 'Size' }
            ],
            rowClick: { action: 'link', to: `${PREFIX}/menus/$.id` }
          }]
        },

        {
          path: '/menus/:id',
          title: 'Menu',
          menu,
          header,
          query: `query($id: String!) {
            menu(id: $id) {
              id name
              items { ...EMenuItem
                items { ...EMenuItem
                  items { ...EMenuItem }
                }
              }
            }
          }
          fragment EMenuItem on EMenuItem { pageId text }
          `,
          queryKey: 'menu',
          content: [{
            widget: 'form',
            card: true,
            cardPadding: 2,
            width: 6,
            fields: [
              { widget: 'input', name: 'name', label: 'Menu name', type: 'text', placeholder: 'Name' },
              {
                widget: 'tree',
                map: { value: 'pageId', title: 'text', children: 'items' }, // For serializing to query
                name: 'items'
              },
              { widget: 'button', text: 'Save menu', icon: 'plus', color: 'success' }
            ],
            query: `mutation($menu: EUpdateMenuInput!) { updateMenu(menu:$menu) { id } }`,
            variableKey: 'menu'
          }]
        }
      ]
    });
  }
};
