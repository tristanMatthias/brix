import { Config, logger } from '@brix/core';
import { BrixStore, ModelBuilder } from '@brix/model';

/** The Brix Store global instance. Is populated by the `setupDatabase` function */
export let db: BrixStore;


/**
 * Attempt to connect to the database via the global `BrixConfig`
 * @param database Database name
 */
export const setupDatabase = async (database?: string) => {
  if (Config.skipDatabase) return;

  const options: any = { ...Config.dbConnection };
  if (database) options.database = database;

  db = await ModelBuilder.build();

  try {
    await db.connect(options);
    logger.success('Database connected');
  } catch (e) {
    logger.error(`Unable to connect to the database: ${e.message}`);
  }


  return db;
};
