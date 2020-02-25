import { Config, generateSchema, generateTypes } from '@brix/core';
import path from 'path';

/**
 * Generates schema.gql and schema.d.ts to @brix/generated
 */
export const generateSchemaTypes = async () => {
  await Config.loadConfig(process.cwd());

  await generateSchema(undefined, path.resolve(__dirname, '../'));
  await generateTypes(
    path.resolve(__dirname, '../schema.gql'),
    path.resolve(__dirname, '../schema.d.ts')
  );
};
