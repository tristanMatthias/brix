import { CommandBuilder, CommandModule } from 'yargs';

import { generateFragments } from '../lib/generateFragments';


export const command = 'fragments [file]';
export const description = 'Generate fragments.json for an API block';
export const builder: CommandBuilder = {
  file: {
    default: 'fragments.json',
    describe: 'Destination of the fragment JSON file'
  }
};

export const handler: CommandModule<any, { file: string }>['handler'] = async ({ file }) => {
  await generateFragments(file);
};
