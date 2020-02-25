import { buildSchema, Config } from '@brix/core';
import { GraphQLObjectType, GraphQLUnionType } from 'graphql';
import path from 'path';

import { compile } from './lib/tsProject';
import { argType, Field } from './testClient';


const DEFAULT_TYPES = [
  'Query',
  'Mutation',
  'String',
  'Float',
  'DateTime',
  'Boolean'
];

const oneOfSchemas = `
yup.addMethod(yup.mixed, 'oneOfSchemas', function (schemas) {
  return this.test(
    'one-of-schemas',
    'Not all items in ${path} match one of the allowed schemas',
    item => schemas.some(schema => schema.isValidSync(item, { strict: true }))
  )
})\n\n\n`;

const fieldToYup = (field: Field) => {
  const { isArray, isRequired, type } = argType(field.type.toString())!;

  let base;
  let lazy = false;
  switch (type) {
    case 'Date':
    case 'boolean':
    case 'number':
    case 'string':
      base = `yup.${type.toLowerCase()}()`;
      break;
    default:
      base = `yup.lazy(() => ${type}${isArray ? '.required()' : ''})`;
      lazy = true;
  }

  if (isArray) base = `yup.array().of(${base})`;

  if (isRequired && !lazy) base += '.required()';
  return `${field.name}: ${base}`;
};


export const generateShapes = async () => {
  await Config.loadConfig(process.cwd());

  const schema = await buildSchema();

  const map = Object.values(schema.getTypeMap());

  const objectTypes = map.filter(t =>
    (!DEFAULT_TYPES.includes(t.name)) &&
    !t.name.startsWith('__') &&
    (t as GraphQLObjectType).getFields
  ) as GraphQLObjectType[];

  const unionTypes = map.filter(t =>
    (!DEFAULT_TYPES.includes(t.name)) &&
    !t.name.startsWith('__') &&
    ((t as GraphQLUnionType).toConfig().types)
  ) as GraphQLUnionType[];


  let ts = `import * as yup from 'yup'\n\n`;
  if (unionTypes.length) ts += oneOfSchemas;


  objectTypes.forEach(t => {
    ts += `export const ${t.name} = yup.object().shape({
    ${
      Object.values(t.getFields())
        .map(fieldToYup)
        .join(',\n  ')
      }\n}); \n\n`;
  });


  unionTypes.forEach(t => {
    const types = t.getTypes().join(',\n  ');
    ts += `export const ${t.name} = yup.mixed().oneOfSchemas([
    ${types}\n]); \n\n`;
  });

  ts += `\n\nexport default {
  ${ objectTypes.map(t => t.name.toString()).join(',\n  ')}
} `;

  await compile('shapes.ts', ts);
};
