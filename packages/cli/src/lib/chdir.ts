import path from 'path';
import fs from 'fs-extra';

export const chdir = async (to?: string) => {
  const oldDir = process.cwd();

  if (to) {
    const newDir = path.resolve(process.cwd(), to);
    await fs.ensureDir(newDir);
    process.chdir(newDir);
  }

  return () => {
    if (to) process.chdir(oldDir);
  };
};
