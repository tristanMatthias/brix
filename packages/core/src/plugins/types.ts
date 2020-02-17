import { GraphQLScalarType } from 'graphql';

/**
 * Setting for `type-graphql` scalars
 * @see https://typegraphql.ml/docs/scalars.html#custom-scalars
 */
export interface ScalarsTypeMap {
  type: Function;
  scalar: GraphQLScalarType;
}

/** Generic Class type */
export interface ClassType<T = any> {
  new(...args: any[]): T;
}
