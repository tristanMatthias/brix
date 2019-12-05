import blokz, { API_CONFIG } from '@blokz/api';
import fs from 'fs-extra';
import path from 'path';

import { build } from './build';

export const start = async (dir?: string, config?: Partial<API_CONFIG>) => {
  let rootDir;

  const api = path.join(process.cwd(), 'packages/api');
  const apiDist = path.join(api, 'dist');
  if (dir) {
    if (fs.existsSync(dir)) rootDir = dir;
    else throw new Error(`${dir} does not exist`);

  } else if (fs.existsSync(api)) {
    // Build the project first
    if (!fs.existsSync(apiDist)) await build(api);
    rootDir = apiDist;
  }

  await blokz.server({
    ...config,
    rootDir
  });
};
