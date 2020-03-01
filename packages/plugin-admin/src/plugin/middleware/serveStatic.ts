import { MiddlewareFunction, generateFragments } from '@brix/core';
import express from 'express';
import path from 'path';
import serveStaticLib from 'serve-static';
const fallback = require('express-history-api-fallback');

export const serveStatic: MiddlewareFunction = async app => {
  const root = path.join(__dirname, '../../client');
  const fragments = await generateFragments();

  const r = express.Router()
    .get('/fragments.json', (_req, res) => res.json(fragments))
    .use(serveStaticLib(root))
    .use(fallback('index.html', { root }));
  app.use('/admin', r);
};
