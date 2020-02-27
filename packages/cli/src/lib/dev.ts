import { Config, logger, schemaToJSON } from '@brix/core';
import { watch } from 'chokidar';
import fs from 'fs-extra';
import path from 'path';
import { Project } from 'ts-morph';
import { getMetadataStorage } from 'type-graphql/dist/metadata/getMetadataStorage';

import { generate } from './generate';
import { start } from './start';


/**
 * Start a dev server and watch for changes (also rebuilds @brix/generated)
 * @param dir Directory to watch
 */
export const dev = async (dir: string = process.cwd()) => {
  console.clear();
  // Setup env
  await Config.loadEnv('development');
  logger.info('Starting Brix in dev mode');

  // Watch from src or current dir
  let watchDir = dir;
  if (fs.pathExists(path.join(dir, 'src'))) watchDir = path.join(dir, 'src');

  // Load TS project
  const tsConfigFilePath = path.join(dir, 'tsconfig.json');


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

  let currentBuild: Promise<any>;

  // Rebuild TS project and @brix/generated on file change, then restart server
  watch(watchDir)
    .on('change', async (_file) => {
      if (currentBuild) await currentBuild;
      currentBuild = new Promise(async (res) => {
        console.clear();
        // Is Typescript project
        if (fs.existsSync(tsConfigFilePath)) {
          logger.info('Building typescript');
          const project = new Project({ tsConfigFilePath });

          const diagnostics = project.getPreEmitDiagnostics();

          if (diagnostics.length) {
            console.log('\n\n', project.formatDiagnosticsWithColorAndContext(diagnostics), '\n\n');
            return res();

          } {
            const emitResult = await project.emit();

            for (const diagnostic of emitResult.getDiagnostics()) {
              logger.error(diagnostic.getMessageText().toString());
            }

            const projectRoot = path.dirname(tsConfigFilePath);
            Object.keys(require.cache).forEach(f => {
              if (f.startsWith(projectRoot)) delete require.cache[f];
            });

            const md = getMetadataStorage();
            md.clear();
            logger.success('Building typescript done!');
          }

        }

        const { changed } = await schemaToJSON();

        if (changed) {
          logger.info('Regenerating @brix/generated');
          const generated = await generate('all', false);
          if (!generated) return;
          logger.success('Regenerating done!');
        } else {
          logger.info('No changes found. Skipping regeneration');
        }
        await restart();
        res();
      });
    });
};
