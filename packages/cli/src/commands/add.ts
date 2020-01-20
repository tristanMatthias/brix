import { CommandBuilder, CommandModule } from 'yargs';

import { addAPI } from '../lib/addAPI';

export const command = 'add <type>';
export const description = 'Add a Brix package to the project';


export const builder: CommandBuilder = {
  type: {
    describe: 'Brix package',
    choices: ['api']
  }
};

export const handler: CommandModule<any, { type?: string }>['handler'] = async args => {
  switch (args.type) {
    case 'api':
      addAPI();
  }
};

