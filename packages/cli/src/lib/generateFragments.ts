import { Env, generateFragments as gen } from '@brix/core';
import ora from 'ora';

import { start } from './start';


export const generateFragments = async (url?: string, dest?: string) => {
  const spinner = ora(`Generating fragments`).start();

  const { httpServer } = await start(process.cwd(), {
    // Disable logging
    env: Env.production
  });
  await gen(url, dest);
  await httpServer.close();
  spinner.succeed(`Generated fragments to ${dest}`);
};
