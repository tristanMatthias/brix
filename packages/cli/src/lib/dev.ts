import { Config, logger, setupLogger } from '@brix/core';
import chalk from 'chalk';
import { watch } from 'chokidar';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { Project } from 'ts-morph';

import { generate } from './generate';
import { start } from './start';

/**
 * Start a dev server and watch for changes (also rebuilds @brix/generated)
 * @param dir Directory to watch
 */
export const dev = async (dir: string = process.cwd()) => {
  // Setup env
  await Config.loadEnv('development');
  await Config.update({ logLevel: 'info' });
  await setupLogger();

  logger.info('Starting Brix in dev mode');

  // Watch from src or current dir
  let watchDir = dir;
  if (fs.pathExists(path.join(dir, 'src'))) watchDir = path.join(dir, 'src');

  // Load TS project
  const tsConfigFilePath = path.join(dir, 'tsconfig.json');
  const isTS = fs.existsSync(tsConfigFilePath);
  let project: Project;
  if (isTS) project = new Project({ tsConfigFilePath });


  // Restart dev server function
  let close: Function;
  const restart = async () => {
    if (close) await close();

    const { httpServer } = await start(dir);

    close = async () => await new Promise(res => {
      httpServer.close(res);
    });
  };
  // Start the server
  restart();

  // Rebuild TS project and @brix/generated on file change, then restart server
  watch(watchDir)
    .on('change', async (_file) => {
      const spinner = ora(chalk.cyanBright(`Rebuilding…`)).start();

      await project?.emit();
      const generated = await generate('all', false);
      if (!generated) return;

      spinner.text = 'Restarting server';
      await restart();
      spinner.stop();
    });
};
