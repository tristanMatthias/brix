import chalk from 'chalk';
import { GraphQLError } from 'graphql';

import { BaseError } from './general';

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


// --------------------------------------------------------------------- GraphQL
export class ErrorGQLNoResolvers extends BaseError {
  name = 'ErrorGQLNoResolvers';
  constructor() {
    super('No resolvers could be found for GraphQL');
  }
}

export class ErrorGQLGenerateSchemaError extends BaseError {
  name = 'ErrorGQLGenerateSchemaError';
  constructor(details: GraphQLError[]) {
    super(`Error generating graphql schema:\n${details.map(e => `\n - ${e.message}`)}\n`);
  }
}

