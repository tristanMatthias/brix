import { CommandBuilder, CommandModule } from 'yargs';

import { start } from '../lib/start';
import { API_CONFIG } from '@blokz/api';


export const command = ['start [dir]', '$0 [dir]'];
export const description = 'Run a Blokz project';


export const builder: CommandBuilder = {
  dir: {
    describe: 'Directory to start the project'
  },
  skipDB: {
    alias: 'skipDatabase',
    boolean: true,
    description: 'Skip connecting to the database'
  },
  port: {
    alias: 'p',
    number: true,
    description: 'Port to start the project on'
  }
};

interface StartArgs {
  dir?: string;
  skipDB: boolean;
  port?: number;
}

export const handler: CommandModule<any, StartArgs>['handler'] = async args => {
  const { dir, skipDB, port } = args;

  const config: Partial<API_CONFIG> = {
    skipDatabase: skipDB
  };
  if (port) config.port = port;
  start(dir, config);
};

