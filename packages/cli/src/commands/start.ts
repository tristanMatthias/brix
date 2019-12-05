import { API_CONFIG, Env } from '@blokz/api';
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
    boolean: true,
    description: 'Skip connecting to the database'
  },
  port: {
    alias: 'p',
    number: true,
    description: 'Port to start the project on'
  },
  prod: {
    alias: 'production',
    boolean: true,
    description: 'Start the project in production mode (NODE_ENV=production)'
  }
};

interface StartArgs {
  dir?: string;
  skipDB: boolean;
  port?: number;
  prod: boolean;
}

export const handler: CommandModule<any, StartArgs>['handler'] = async args => {
  const { dir, skipDB, port, prod } = args;

  const config: Partial<API_CONFIG> = {
    skipDatabase: skipDB
  };
  if (port) config.port = port;
  if (prod) config.env = Env.production;

  start(dir, config);
};

