import fs from 'fs-extra';
import path from 'path';

/**
 * If the directory contains a `dist` resolce to this, otherwise return the
 * passed directory
 * @param dir Directory to resolve
 */
export const dirOrDist = (dir: string) => {
  const dist = path.join(dir.toString(), 'dist');
  if (fs.existsSync(dist)) return dist;
  return dir;
};
