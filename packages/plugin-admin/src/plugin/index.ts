import { BrixPlugins, MiddlewareFunction } from '@brix/core';
import express from 'express';
import path from 'path';
import serveStatic from 'serve-static';

const fallback = require('express-history-api-fallback');

export default () => {
  const root = path.join(__dirname, './dist');
  const serve: MiddlewareFunction = app => {
    const r = express.Router();
    r
      .use(serveStatic(root))
      .use(fallback('index.html', { root }));
    app.use('/admin', r);
  };

  BrixPlugins.register({
    name: 'Brix Admin',
    requires: [
      '@brix/plugin-entity-user',
      '@brix/plugin-auth-jwt'
    ],
    middlewares: [serve]
  });
};
