import chalk from 'chalk';

import { BaseError } from './general';

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
