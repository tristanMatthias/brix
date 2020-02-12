import { CommandBuilder, CommandModule } from 'yargs';

import { generate } from '../lib/generate';


export const command = 'generate';
export const description = 'Generate typed files';
export const builder: CommandBuilder = {};

export const handler: CommandModule['handler'] = async () => {
  await generate();
};
