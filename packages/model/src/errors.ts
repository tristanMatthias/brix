import chalk from 'chalk';

export class BaseError extends Error {
  constructor(err: string) {
    super(chalk.redBright(err));
  }
}

// ------------------------------------------------------------------ Decorators
export class ErrorInvalidType extends BaseError {
  constructor(proto: string, property: string, type: string) {
    super(`${proto}.${property} has an invalid type of ${type}. Should be of type String, Number, Date, or Boolean`);
  }
}

// --------------------------------------------------------------- Model Builder
export class ErrorStoreAlreadyRegistered extends BaseError {
  constructor() {
    super(`Model Builder already has a store registered`);
  }
}
export class ErrorNoStoreRegistered extends BaseError {
  constructor() {
    super(`Model Builder does not have a store registered`);
  }
}

// ---------------------------------------------------------------------- Models
export class ErrorNoModelRegistered extends BaseError {
  constructor(model: string) {
    super(`No model registered with name ${chalk.yellow(`'${model}'`)}`);
  }
}
