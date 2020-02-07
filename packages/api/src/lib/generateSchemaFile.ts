import { generateTypeScriptTypes } from 'graphql-schema-typescript';
import path from 'path';
import { emitSchemaDefinitionFile } from 'type-graphql';

import { buildSchema } from './schema';

/**
 * Generates a schema.gql file based on a Graph API schema
 * your API types/queries/etc for a front end application
 * @param dir Directory to load the schema gql file from
 */
export const generateSchema = async (dir?: string) => {
  await emitSchemaDefinitionFile(
    path.resolve(process.cwd(), 'dist/schema.gql'),
    await buildSchema(dir)
  );
};


/**
 * Generate a schema definition file (.d.ts) from a schema.gql file.
 * Useful for exporting your API types/queries/etc for a front end application.
 * @param schema Schema file to load
 * @param out Definition file to write (.d.ts)
 */
export const generateTypes = async (schema?: string, out?: string) => {
  generateTypeScriptTypes(schema || 'dist/schema.gql', out || 'dist/schema.d.ts', {
    typePrefix: ''
  })
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
};


// File is called from command line
if (require.main === module) generateSchema();
