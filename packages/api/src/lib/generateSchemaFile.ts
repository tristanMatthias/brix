import { dirOrDist } from '@brix/core';
import { generateTypeScriptTypes } from 'graphql-schema-typescript';
import path from 'path';
import { emitSchemaDefinitionFile } from 'type-graphql';

import { buildSchema } from './schema';


/**
 * Generates a schema.gql file based on a Graph API schema
 * your API types/queries/etc for a front end application
 * @param dir Directory to load the schema gql file from
 */
export const generateSchema = async (dir?: string, out?: string) => {
  await emitSchemaDefinitionFile(
    path.resolve(out || dirOrDist(process.cwd()), 'schema.gql'),
    // @ts-ignore
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
  await generateTypeScriptTypes(schema || 'dist/schema.gql', out || 'dist/schema.d.ts', {
    typePrefix: ''
  });
};


// File is called from command line
if (require.main === module) generateSchema();
