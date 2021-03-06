import 'reflect-metadata';

import { BrixConfig, BrixPlugins, buildSchema, Config, Env, logger } from '@brix/core';
import chalk from 'chalk';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http, { Server } from 'http';

import { authChecker } from './lib/auth';
import { setupDatabase } from './lib/database';
import { apollo } from './middleware/apollo';
import { loadMiddleware } from './middleware/loadMiddleware';
import bodyParser from 'body-parser';


let httpServer: Server;
const y = chalk.yellow;

/**
 * Starts a new Brix API server instance. Returns the `httpServer` and a Sequelize
 * instance.
 * @param config The API config to override all settings with (highest priority)
 */
export const server = async (config?: Partial<BrixConfig>) => {
  await Config.loadEnv(process.env.NODE_ENV as Env || 'development');
  await Config.loadConfig(config ? config.rootDir : undefined);
  await Config.update(config || process.env.NODE_ENV as Env || 'development');
  await BrixPlugins.build();

  const schema = await buildSchema(undefined, authChecker);

  if (schema) {
    const query = schema.getQueryType();
    const queryFields = query ? Object.keys(query.getFields()) : null;
    const queriesText = `${y('Queries:')}\n - ${queryFields?.join('\n - ')}`;
    const mutation = schema.getMutationType();
    const mutationFields = mutation ? Object.keys(mutation.getFields()) : null;
    const mutationsText = `${y('Mutations:')}\n - ${mutationFields?.join('\n - ')}`;
    logger.success(`GQL Schema built with:\n\n${queriesText}\n${mutationsText}\n`);
  }

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
  app.use(bodyParser.json({ limit: Config.bodySizeLimit }));

  await loadMiddleware(app);
  await apollo(app, httpServer, schema);


  await new Promise(res => httpServer.listen(Config.port, res));
  logger.success(`🚀 Server ready at ${y(`http://localhost:${Config.port}/graphql`)}`);
  return { httpServer, db };

};


// File is called from command line
if (require.main === module) server();
