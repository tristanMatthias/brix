import path from 'path';
import { emitSchemaDefinitionFile } from 'type-graphql';
import { generateTypeScriptTypes } from 'graphql-schema-typescript';

import { schema } from '../server/middleware/apollo';


export const generateSchema = async (dir?: string) => {
  await emitSchemaDefinitionFile(
    path.resolve(process.cwd(), 'dist/schema.gql'),
    await schema(dir)
  );
};

export const generateTypes = async (schema?: string, out?: string) => {
  generateTypeScriptTypes(schema || 'dist/schema.gql', out || 'dist/schema.d.ts', {
    typePrefix: ''
  })
    .then(() => {
      console.log('✅ Generated schema types');
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
};

// File is called from command line
if (require.main === module) generateSchema();
