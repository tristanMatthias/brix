import chalk from 'chalk';
import ora from 'ora';
import * as yarn from 'yarn-programmatic';

import { chdir } from './chdir';
import { copy } from './copy';
import { editJSON } from './editJSON';


const packages = [
  '@blokz/api',
  'type-graphql'
];

export const addAPI = async () => {
  const spinner = ora(`Adding an API to your Blokz project`).start();
  const goBack = await chdir('packages/api');

  // Setup child package
  spinner.text = 'Installing dependencies';
  await yarn.init();
  await yarn.version('0.0.0');
  await yarn.add(packages);

  // Copy main files
  spinner.text = 'Generating files';
  await copy('api/entity.ts', 'src/gql/entities/User.entity.ts');
  await copy('api/resolver.ts', 'src/gql/resolvers/User.resolver.ts');
  await copy('api/resolverIndex.ts', 'src/gql/resolvers/index.ts');
  await copy('api/service.ts', 'src/services/User.service.ts');
  await copy('api/tsconfig.json', 'tsconfig.json');

  await editJSON('package.json', {
    scripts: {
      build: 'tsc -p ./'
    }
  });

  spinner.succeed(chalk.green('Successfully added an API your Blokz project'));

  goBack();
};
