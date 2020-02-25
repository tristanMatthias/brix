import chalk from 'chalk';

export class BaseError extends Error {
  constructor(err: string) {
    super(chalk.redBright(err));
  }
}

// ---------------------------------------------------------------------- Config
export class ErrorInvalidConfigOption extends BaseError {
  constructor(message: string) {
    super(`Error loading config: ${message}`);
  }
}


// --------------------------------------------------------------------- Plugins

export class ErrorPluginRegistered extends BaseError {
  constructor(plugin: string) {
    super(`Plugin ${chalk.yellow(plugin)} is already registered`);
  }
}

export class ErrorPluginUnknown extends BaseError {
  constructor(plugin: string) {
    // TODO: Add help install text
    super(`Could not load unknown plugin ${chalk.yellow(plugin)}. Is it installed?`);
  }
}

export class ErrorPluginNotAFunction extends BaseError {
  constructor(plugin: string) {
    // TODO: Add help install text
    super(`${chalk.yellow(plugin)} does not export a default function.`);
  }
}

export class ErrorRequiredPluginMissing extends BaseError {
  constructor(plugin: string, required: string) {
    // TODO: Add help install text
    super(`Plugin ${chalk.yellow(plugin)} requires the ${chalk.yellow(required)} plugin to be installed.`);
  }
}

export class ErrorPluginsNotBuilt extends BaseError {
  constructor() {
    super(`BrixPlugins is not built. Try running BrixPlugins.build() first.`);
  }
}


// --------------------------------------------------------------------- GraphQL
export class ErrorGQLNoResolvers extends Error {
  constructor() {
    super('No resolvers could be found for GraphQL');
  }
}
