import { generateSchema } from '@brix/core';
import ora from 'ora';
import path from 'path';


export const generateTypes = async (dir?: string, out?: string) => {
  const spinner = ora(`Generating types`).start();
  await generateSchema(dir || path.resolve(process.cwd(), 'dist/gql/resolvers'));
  await generateTypes(undefined, out);
  spinner.succeed('Generated types to dist/schema.d.ts');
};
