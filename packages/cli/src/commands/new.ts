import { CommandBuilder, CommandModule } from 'yargs';

import { setup, SetupOptions } from '../lib/setup';


export const command = 'new [dir]';
export const description = 'Create a new Brix project';
export const builder: CommandBuilder = {
  dir: {
    default: './',
    describe: 'Directory to create the new project'
  },
  api: {
    describe: 'Create an API package in the new project'
  }
};

export const handler: CommandModule<any, SetupOptions>['handler'] = async args => {
  setup(args);
};

