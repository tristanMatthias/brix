/**
 * For some strange reason, graphql-type-json does not work with type-graphql
 * and namually writing this out does
 * @see https://github.com/taion/graphql-type-json/blob/master/src/index.js
 */

import { GraphQLScalarLiteralParser, GraphQLScalarType, Kind, ObjectValueNode } from 'graphql';


const parseObject = (ast: ObjectValueNode, variables: { [key: string]: any }) => {
  const value = Object.create(null);
  ast.fields.forEach(field => {
    value[field.name.value] = parseLiteral(field.value, variables);
  });

  return value;
};

const parseLiteral: GraphQLScalarLiteralParser<any> = (ast, variables) => {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT:
      return parseObject(ast, variables!);
    case Kind.LIST:
      return ast.values.map(n => parseLiteral(n, variables));
    case Kind.NULL:
      return null;
    case Kind.VARIABLE: {
      const name = ast.name.value;
      return variables ? variables[name] : undefined;
    }
    default:
      return undefined;
  }
};

const identity = (value: any) => value;


/**
 * GraphQL JSON type
 */
export const GraphQLJSON = new GraphQLScalarType({
  name: 'JSON',
  description:
    'The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
  serialize: identity,
  parseValue: identity,
  parseLiteral
});
