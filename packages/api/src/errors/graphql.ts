import { GraphQLError } from 'graphql';

import { ErrorGeneral } from './general';
import { ErrorValidationRequired } from './validation';
import { Config, Env, logger } from '@brix/core';

const gqlRegex = {
  required: /Variable "\$(\w+)" .* Field (\w*) of required type (\w+)! was not provided.$/
};

/**
 * Prettifies GraphQL errors for better client handling
 * @param e GraphQL error to wrap
 */
export const handleGraphQLError = (e: GraphQLError): Error => {

  // Required field missing
  if (gqlRegex.required.test(e.message)) {
    const [, variable, field] = gqlRegex.required.exec(e.message)!;
    return new ErrorValidationRequired(variable, field);
  }

  // If on dev or test and it's an unknown error, return it
  if ([Env.development].includes(Config.env)) return e;

  logger.error(e);
  // Otherwise return a general error in prod-like environment
  return new ErrorGeneral();
};


export class ErrorGQLNoResolvers extends Error {
  constructor() {
    super('No resolvers could be found for GraphQL');
  }
}
