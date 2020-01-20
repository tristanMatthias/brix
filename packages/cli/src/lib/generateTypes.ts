import API from '@brix/api';
import path from 'path';
import ora from 'ora';


export const generateTypes = async (dir?: string) => {
  const spinner = ora(`Generating types`).start();
  await API.lib.generateSchemaFile.generateSchema(dir || path.resolve(process.cwd(), 'dist/gql/resolvers'));
  await API.lib.generateSchemaFile.generateTypes();
  spinner.succeed('Generated types');
};
