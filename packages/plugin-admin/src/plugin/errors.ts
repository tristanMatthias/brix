import { BaseError } from '@brix/core';
import chalk from 'chalk';

export class ErrorAdminPageRegistered extends BaseError {
  name = 'ErrorAdminPageRegistered';
  constructor(prefix: string) {
    super(`Admin page is already registered with prefix ${chalk.yellow(prefix)}`);
  }
}
