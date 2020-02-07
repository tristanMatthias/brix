import { ApiConfig, Env } from '@brix/api';
import { CommandBuilder, CommandModule } from 'yargs';

import { start } from '../lib/start';

export const command = ['start [dir]', '$0 [dir]'];
export const description = 'Run a Brix project';


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
  },
  mocks: {
    alias: 'm',
    boolean: true,
    description: 'Mock data based on the GQL schema (persistent)'
  }
};

interface StartArgs {
  dir?: string;
  skipDB: boolean;
  port?: number;
  prod: boolean;
  mocks: boolean;
}

export const handler: CommandModule<any, StartArgs>['handler'] = async args => {
  const { dir, skipDB, port, prod, mocks } = args;

  const config: Partial<ApiConfig> = {};
  if (port) config.port = port;
  if (prod) config.env = Env.production;
  if (mocks) config.mocks = true;
  if (skipDB !== undefined) config.skipDatabase = skipDB;

  start(dir, config);
};

