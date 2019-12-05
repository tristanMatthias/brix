import fs from 'fs-extra';
import path from 'path';

const templates = path.resolve(__dirname, '../../templates');

export const copy = async (file: string, to?: string) => {
  const from = path.resolve(templates, file);
  const dest = path.resolve(process.cwd(), to || file);
  await fs.ensureDir(path.dirname(dest));
  await fs.copyFile(from, dest);
};
