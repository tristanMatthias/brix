import { CommandModule } from 'yargs';

import { generateTypes } from '../lib/generateTypes';

export const command = ['types'];
export const description = 'Generate types for an API block';

export const handler: CommandModule['handler'] = async () => {
  await generateTypes();
};
