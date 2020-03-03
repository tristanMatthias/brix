import del from 'del';

import { getDir } from './lib/getDir';

/**
 * Clean all generated files under @brix/generated
 */
export const clean = async () => {
  return await Promise.all([
    'schema.d.ts',
    'queries',
    'schema.gql',
    'shapes.d.ts',
    'shapes.js',
    'TestClient.d.ts',
    'TestClient.js'
  ].map(async f => del(
    await getDir(f),
    { force: true }
  )));
};
