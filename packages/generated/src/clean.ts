import del from 'del';
import path from 'path';

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
  ].map(f => del(
    path.resolve(__dirname, `../${f}`),
    { force: true }
  )));
};
