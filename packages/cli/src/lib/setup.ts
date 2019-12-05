import chalk from 'chalk';
import ora from 'ora';
import * as yarn from 'yarn-programmatic';

import { addAPI } from './addAPI';
import { chdir } from './chdir';
import { copy } from './copy';
import { editJSON } from './editJSON';


const packages = [
  'lerna',
  'nodemon',
  'tslint',
  'tslint-config-airbnb',
  'typescript'
];

export interface SetupOptions {
  dir?: string;
  api?: string;
}

export const setup = async (options: SetupOptions) => {
  const spinner = ora(`Creating new blokz project`).start();
  const goBack = await chdir(options.dir);

  spinner.text = 'Installing dependencies';
  await yarn.init({ private: true });
  spinner.text = 'Installing dev dependencies';
  await yarn.add(packages, { dev: true });
  spinner.text = 'Setting version';
  await yarn.version('0.0.0');

  spinner.text = 'Generating files';
  copy('.gitignore');
  copy('lerna.json');
  copy('tsconfig.json');
  copy('tslint.json');

  editJSON('package.json', {
    workspaces: ['packages/*'],
    scripts: {
      bootstrap: 'yarn lerna bootstrap'
    }
  });

  spinner.succeed(chalk.green('Successfully created your Blokz project'));
  goBack();

  if (options.api) await addAPI();
};
