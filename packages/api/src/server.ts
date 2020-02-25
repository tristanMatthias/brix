import 'reflect-metadata';

import { BrixConfig, BrixPlugins, buildSchema, Config, Env, logger, setupLogger } from '@brix/core';
import chalk from 'chalk';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http, { Server } from 'http';

import { authChecker } from './lib/auth';
import { setupDatabase } from './lib/database';
import { apollo } from './middleware/apollo';
import { loadMiddleware } from './middleware/loadMiddleware';


let httpServer: Server;

/**
 * Starts a new Brix API server instance. Returns the `httpServer` and a Sequelize
 * instance.
 * @param config The API config to override all settings with (highest priority)
 */
export const server = async (config?: Partial<BrixConfig>) => {

  await Config.loadEnv(process.env.NODE_ENV as Env || 'development');
  await Config.loadConfig(config ? config.rootDir : undefined);
  await Config.update(config || process.env.NODE_ENV as Env);

  await BrixPlugins.build();
  const schema = await buildSchema(undefined, authChecker);


  await setupLogger();
  const db = await setupDatabase();

  const app = express();
  httpServer = http.createServer(app);

  // Middleware
  app.use(cors({
    origin: Config.corsAllowFrom
  }));
  app.use(helmet({
    xssFilter: true
  }));

  await loadMiddleware(app);
  await apollo(app, httpServer, schema);


  await new Promise(res => httpServer.listen(Config.port, res));
  logger.success(`🚀 Server ready at ${chalk.yellow(`http://localhost:${Config.port}/graphql`)}`);
  return { httpServer, db };

};


// File is called from command line
if (require.main === module) server();
