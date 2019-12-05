import path from 'path';
import { DataType, Sequelize, Sequelize as TSSequelize, SequelizeOptions } from 'sequelize-typescript';

import { CONFIG } from '../config';
import { Env } from '../config/types';
import { logger } from '../lib/logger';

export let db: Sequelize;
// @ts-ignore
Sequelize.Promise = global.Promise;


export const setupDatabase = async (database?: string) => {
  if (CONFIG.skipDatabase) return;

  const options: SequelizeOptions = {
    ...CONFIG.dbConnection,
    logging: false,
    modelPaths: [
      path.resolve(__dirname, '../models/**/!(BaseModel)*')
    ],
    define: {
      paranoid: true
    },
    pool: {}
  };


  if (database) options.database = database;
  if (CONFIG.env === Env.development) {
    options.storage = path.resolve(process.cwd(), `../../${options.database}.db`);
  }

  db = new TSSequelize(options);
  db.beforeDefine(attrs => {
    // Define default ID on all models
    attrs.id = {
      autoIncrement: true,
      primaryKey: true,
      type: DataType.BIGINT
    };
  });


  try {
    await db.authenticate();
    logger.info('✅ Database connected');
  } catch (e) {
    logger.error('Unable to connect to the database:', e.message);
  }


  await db.sync({ alter: true });


  return db;
};
