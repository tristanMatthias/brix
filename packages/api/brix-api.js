#!/usr/bin/env node

(async () => {
  await require('./dist/server').server({ rootDir: process.cwd() });
})();
