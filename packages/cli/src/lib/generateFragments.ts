import { generateFragments as gen, Config, BrixPlugins } from '@brix/core';
import fs from 'fs-extra';
import ora from 'ora';


export const generateFragments = async (dest: string = './fragments.json') => {
  await Config.update({ rootDir: process.cwd() });
  await BrixPlugins.build();
  const spinner = ora(`Generating fragments`).start();
  try {
    await fs.writeJSON(dest, await gen());
  } catch (e) {
    spinner.fail(e.message);
    return false;
  }
  spinner.succeed(`Generated fragments to ${dest}`);
  return true;
};
