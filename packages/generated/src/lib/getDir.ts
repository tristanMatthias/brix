import { Config } from '@brix/core';
import path from 'path';

export const getDir = async (file?: string) => {
  await Config.loadConfig(process.cwd());
  const dir = Config.generatedDir || path.resolve(__dirname, `../../`);
  return file ? path.join(dir, file) : dir;
};
