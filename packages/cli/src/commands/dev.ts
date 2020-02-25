import { CommandBuilder, CommandModule } from 'yargs';
import { dev } from '../lib/dev';


export const command = ['dev [dir]', '$0 [dir]'];
export const description = 'Run a Brix project in dev mode';


export const builder: CommandBuilder = {
  dir: {
    describe: 'Directory to start the project'
  }
};

interface StartArgs {
  dir?: string;
}

export const handler: CommandModule<any, StartArgs>['handler'] = async args => {
  dev(args.dir);
};

