import { MiddlewareFunction } from '@brix/core';
import express from 'express';
import path from 'path';
import serveStaticLib from 'serve-static';
const fallback = require('express-history-api-fallback');

export const serveStatic: MiddlewareFunction = app => {
  const root = path.join(__dirname, '../client');

  const r = express.Router()
    .use(serveStaticLib(root))
    .use(fallback('index.html', { root }));
  app.use('/admin', r);
};
