import chalk from 'chalk';

import { logger } from './lib';

// @ts-ignore
process.on('unhandledRejection', async (error: BaseError) => {
  let msg = error.stack || error.message;
  // tslint:disable-next-line no-boolean-literal-compare
  if (error.showStack === false) msg = `[ ${error.name} ] ${error.message}`;
  logger.error(msg);
  if (error.causeExit) process.exit(1);
});

export class BaseError extends Error {
  name = 'BaseError';
  brixError = true;
  causeExit = true;
  showStack = false;
  constructor(err: string) {
    super(chalk.redBright(err));
  }
}

// ---------------------------------------------------------------------- Config
export class ErrorInvalidConfigOption extends BaseError {
  name = 'ErrorInvalidConfigOption';
  constructor(message: string) {
    super(`Error loading config: ${message}`);
  }
}
export class ErrorInvalidEnvironment extends BaseError {
  name = 'ErrorInvalidEnvironment';
  constructor(environment: string) {
    super(`Invalid config environment ${chalk.yellow(environment)}, Should be one of 'development', 'test', or 'production'`);
  }
}

export class ErrorNoConfigFileFound extends BaseError {
  name = 'ErrorNoConfigFileFound';
  constructor(dir: string) {
    super(`Could not find a brix config file at ${chalk.yellow(dir)}`);
  }
}


// --------------------------------------------------------------------- Plugins

export class ErrorPluginRegistered extends BaseError {
  name = 'ErrorPluginRegistered';
  constructor(plugin: string) {
    super(`Plugin ${chalk.yellow(plugin)} is already registered`);
  }
}

export class ErrorPluginUnknown extends BaseError {
  name = 'ErrorPluginUnknown';
  constructor(plugin: string) {
    // TODO: Add help install text
    super(`Could not load unknown plugin ${chalk.yellow(plugin)}, and 'installPlugins' is disabled. Is it installed?`);
  }
}

export class ErrorPluginNotAFunction extends BaseError {
  name = 'ErrorPluginNotAFunction';
  constructor(plugin: string) {
    // TODO: Add help install text
    super(`${chalk.yellow(plugin)} plugin does not export a default function.`);
  }
}

export class ErrorRequiredPluginMissing extends BaseError {
  name = 'ErrorRequiredPluginMissing';
  constructor(plugin: string, required: string) {
    // TODO: Add help install text
    super(`Plugin ${chalk.yellow(plugin)} requires the ${chalk.yellow(required)} plugin to be installed.`);
  }
}

export class ErrorPluginsNotBuilt extends BaseError {
  name = 'ErrorPluginsNotBuilt';
  constructor() {
    super(`BrixPlugins is not built. Try running BrixPlugins.build() first.`);
  }
}

export class ErrorPluginsNotInstallable extends BaseError {
  name = 'ErrorPluginsNotInstallable';
  constructor(p: string) {
    super(`Could not automatically install ${chalk.yellow(p)} plugin. Attempted '@brix/${p}', '@brix/plugin-${p}', and 'brix-plugin-${p}'`);
  }
}


// --------------------------------------------------------------------- GraphQL
export class ErrorGQLNoResolvers extends Error {
  name = 'ErrorGQLNoResolvers';
  constructor() {
    super('No resolvers could be found for GraphQL');
  }
}
