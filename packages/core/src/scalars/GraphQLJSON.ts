/**
 * For some strange reason, graphql-type-json does not work with type-graphql
 * and manually writing this out does
 * @see https://github.com/taion/graphql-type-json/blob/master/src/index.js
 */
import { GraphQLScalarType } from 'graphql';
import { ASTNode, Kind, ObjectValueNode } from 'graphql/language';


const identity = (value: any) => {
  return value;
};

const ensureObject = (value: any) => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new TypeError(
      `JSONObject cannot represent non-object value: ${value}`
    );
  }

  return value;
};

const parseObject = (ast: ObjectValueNode, variables: any) => {
  const value = Object.create(null);
  ast.fields.forEach(field => {
    // eslint-disable-next-line no-use-before-define
    value[field.name.value] = parseLiteral(field.value, variables);
  });

  return value;
};

const parseLiteral = (ast: ASTNode, variables: any): any => {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT:
      return parseObject(ast, variables);
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

// This named export is intended for users of CommonJS. Users of ES modules
// should instead use the default export.
export const GraphQLJSON = new GraphQLScalarType({
  name: 'JSON',
  description:
    'The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
  serialize: identity,
  parseValue: identity,
  parseLiteral
});

export default GraphQLJSON;

export const GraphQLJSONObject = new GraphQLScalarType({
  name: 'JSONObject',
  description:
    'The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
  serialize: ensureObject,
  parseValue: ensureObject,
  parseLiteral: (ast, variables) =>
    ast.kind === Kind.OBJECT ? parseObject(ast, variables) : undefined
});
