import API, { Env } from '@brix/api';
import ora from 'ora';

import { start } from './start';


export const generateFragments = async (url?: string, dest?: string) => {
  const spinner = ora(`Generating fragments`).start();
  const { httpServer } = await start(undefined, {
    // Disable logging
    env: Env.production
  });
  await API.lib.generateFragments(url, dest);
  await httpServer.close();
  spinner.succeed(`Generated fragments to ${dest}`);
};
