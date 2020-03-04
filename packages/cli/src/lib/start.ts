import brix from '@brix/api';
import { BrixConfig } from '@brix/core';
import fs from 'fs-extra';

export const start = async (
  dir: string = process.cwd(),
  config?: Partial<BrixConfig>
): Promise<{ httpServer: import('http').Server }> => {

  let rootDir;
  // Load from passed dir
  if (dir) {
    if (fs.existsSync(dir)) rootDir = dir;
    else throw new Error(`${dir} does not exist`);
  }
  return await brix.server({
    ...config,
    rootDir
  });

};
