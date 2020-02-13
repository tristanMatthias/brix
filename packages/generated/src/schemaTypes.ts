import path from 'path';
import API from '@brix/api';

/**
 * Generates schema.gql and schema.d.ts to @brix/generated
 */
export const generateSchemaTypes = async () => {
  await API.config.loadConfig(process.cwd());

  await API.lib.generateSchemaFile.generateSchema(undefined, path.resolve(__dirname, '../'));
  await API.lib.generateSchemaFile.generateTypes(
    path.resolve(__dirname, '../schema.gql'),
    path.resolve(__dirname, '../schema.d.ts')
  );
};