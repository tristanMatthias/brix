import { CommandBuilder, CommandModule } from 'yargs';

import { start } from '../lib/start';


export const command = ['start [dir]', '$0 [dir]'];
export const description = 'Run a Blokz project';


export const builder: CommandBuilder = {
  dir: {
    describe: 'Directory to start the project'
  },
  skipDB: {
    alias: 'skipDatabase',
    description: 'Skip connecting to the database'
  }
};

interface StartArgs {
  dir?: string;
  skipDB: boolean;
}

export const handler: CommandModule<any, StartArgs>['handler'] = async args => {
  const { dir, skipDB } = args;

  start(dir, {
    skipDatabase: skipDB
  });
};

