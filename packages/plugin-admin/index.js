const { BrixPlugins } = require('@brix/core');
const static = require('serve-static');
const path = require('path');
const fallback = require('express-history-api-fallback');
const express = require('express');

module.exports = () => {
  const root = path.join(__dirname, './dist/client');
  const serve = app => {
    const r = express.Router();
    r
      .use(static(root))
      .use(fallback('index.html', { root }));
    app.use('/admin', r);
  };

  BrixPlugins.register({
    name: 'Brix Admin',
    requires: [
      '@brix/plugin-entity-user',
      '@brix/plugin-auth-jwt',
    ],
    middlewares: [serve]
  });
};
