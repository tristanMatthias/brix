import { logger } from '../lib';
import { BaseError } from './general';

export * from './authentication';
export * from './config';
export * from './general';
export * from './plugins';
export * from './resource';

// @ts-ignore
process.on('unhandledRejection', async (error: BaseError) => {
  let msg = error.stack || error.message;
  if (!msg) throw error;
  // tslint:disable-next-line no-boolean-literal-compare
  if (error.showStack === false) msg = `[ ${error.name} ] ${error.message}`;
  logger.error(msg);
  if (error.causeExit) process.exit(1);
});
