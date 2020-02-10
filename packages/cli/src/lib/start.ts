import brix, { ApiConfig } from '@brix/api';
import fs from 'fs-extra';
import path from 'path';

import { build } from './build';

export const start = async (
  dir?: string,
  config?: Partial<ApiConfig>
): Promise<{ httpServer: import('http').Server }> => {
  let rootDir;

  const api = path.join(process.cwd(), 'packages/api');
  const apiDist = path.join(api, 'dist');

  const pkg = path.join(process.cwd(), 'package.json');
  const pkgDist = path.join(process.cwd(), 'dist');

  // Load from passed dir
  if (dir) {
    if (fs.existsSync(dir)) rootDir = dir;
    else throw new Error(`${dir} does not exist`);

    // Check if lerna project, and run api from packages/api
  } else if (fs.existsSync(api)) {
    // Build the project first
    if (!fs.existsSync(apiDist)) await build(api);
    rootDir = apiDist;

    // Check if @blockz/api exists in package.json and run from cwd
  } else if (fs.existsSync(pkg)) {
    const isBrixDir = (await fs.readJSON(pkg)).dependencies['@brix/api'];
    if (isBrixDir && !fs.existsSync(pkgDist)) await build();
    rootDir = pkgDist;
  }

  return await brix.server({
    ...config,
    rootDir
  });
};
