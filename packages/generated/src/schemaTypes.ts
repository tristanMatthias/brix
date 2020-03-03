import { Config, generateSchema, generateTypes } from '@brix/core';

import { getDir } from './lib/getDir';

/**
 * Generates schema.gql and schema.d.ts to @brix/generated
 */
export const generateSchemaTypes = async () => {
  await Config.loadConfig(process.cwd());

  await generateSchema(undefined, await getDir());
  await generateTypes(
    await getDir('schema.gql'),
    await getDir('schema.d.ts')
  );
};
