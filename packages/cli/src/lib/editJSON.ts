import deepmerge from 'deepmerge';
import fs from 'fs-extra';
import path from 'path';

export const editJSON = (file: string, obj: { [key: string]: any }) => {
  const fp = path.resolve(process.cwd(), file);
  const f = require(fp);

  fs.writeJSON(fp, deepmerge(f, obj), {
    spaces: 2
  });
};
