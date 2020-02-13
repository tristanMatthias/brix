import { CommandBuilder, CommandModule } from 'yargs';

import { generate, GenerateType } from '../lib/generate';


export const command = 'generate [type]';
export const description = 'Generate typed code under @brix/generated';
export const builder: CommandBuilder<{ type: GenerateType }> = {

  type: {
    default: 'all',
    describe: 'Type of code to generate',
    choices: ['all', 'TestClient', 'schema', 'queries', 'shapes']
  }
};

export const handler: CommandModule<any, { type: GenerateType }>['handler'] = async ({
  type
}) => {
  await generate(type);
};
