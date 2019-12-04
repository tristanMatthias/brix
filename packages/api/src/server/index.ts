import 'reflect-metadata';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http, { Server } from 'http';

import { CONFIG, updateConfig } from '../config';
import { Env, API_CONFIG } from '../config/types';
import { setupDatabase } from '../lib/database';
import { logger } from '../lib/logger';
import { apollo } from './middleware/apollo';


let httpServer: Server;

export const server = async (config?: Partial<API_CONFIG>) => {
  await updateConfig(config || process.env.NODE_ENV as Env);

  const db = CONFIG.skipDatabase ? null : await setupDatabase();

  const app = express();
  httpServer = http.createServer(app);

  app.use(cors({
    origin: CONFIG.corsAllowFrom
  }));
  app.use(helmet({
    xssFilter: true
  }));
  apollo(app, httpServer);

  // TODO: Pipeline injection

  await new Promise(res => httpServer.listen(CONFIG.port, res));

  logger.info(`🚀 Server ready at http://localhost:${CONFIG.port}/graphql`);
  return { httpServer, db };

};


// File is called from command line
if (require.main === module) server();
