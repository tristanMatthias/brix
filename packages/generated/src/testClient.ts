import API from '@brix/api';
import fs from 'fs-extra';
import { GraphQLField, GraphQLFieldMap } from 'graphql';
import path from 'path';

import { compile } from './lib/tsProject';
import { Config } from '@brix/core';

export type FieldMap = GraphQLFieldMap<any, any, { [key: string]: any; }>;
export type Field = GraphQLField<any, any, { [key: string]: any; }>;

export type ArgType = 'number' | 'Date' | 'string' | 'boolean' | 'number';
export const argType = (type?: string) => {
  if (!type) return;

  let t = type;
  const isRequired = t.endsWith('!');
  if (isRequired) t = t.slice(0, -1);
  const isArray = t.startsWith('[');
  if (isArray) t = t.slice(1, -1);
  let isUnknown = false;

  // Run second bang removal for isArray isRequired
  if (t.endsWith('!')) t = t.slice(0, -1);

  switch (t) {
    case 'Float':
      t = 'number';
      break;
    case 'DateTime':
      t = 'Date';
      break;
    case 'String':
    case 'Boolean':
    case 'Number':
      t = t.toLowerCase();
      break;
    default:
      t = t;
      isUnknown = true;
  }

  return {
    type: t as ArgType,
    isArray,
    isRequired,
    isUnknown
  };
};

const fieldType = (f: Field) => /(\w+)/.exec(f.type.toString())![1];

export const generateTestClientQuery = (
  name: string,
  field: Field,
  deps: string[]
) => {

  const args = field.args.map(v => {
    const arg = argType(v.type.toString());
    if (!arg) return v.name;

    const { type, isArray, isRequired, isUnknown } = arg;
    if (isUnknown && !deps.includes(type)) deps.push(type);
    return v.name + (isRequired ? ':' : '?:') + (isArray ? `${type}[]` : type);
  }).join(', ');

  let returnType = fieldType(field);
  if (field.type.toString().startsWith('[')) returnType = `${returnType}[]`;


  return `
    async ${name}(${args}): Promise<${returnType}> {
      return this._request<${returnType}>('query', '${name}');
    }
  `;
};


export const generateGQLTestClient = async () => {
  await Config.loadConfig(process.cwd());

  const schema = await API.lib.schema.buildSchema();
  const query = schema.getQueryType()!;
  const queries = query.getFields();


  const importTypes = Object.values(queries)
    .map(f => fieldType(f as Field))
    // Unique
    .filter((value, index, self) => self.indexOf(value) === index);


  const funcs = Object.entries(queries)
    .map(([name, f]) => generateTestClientQuery(name, f as Field, importTypes))
    .join('\n');

  let template = (await fs.readFile(
    path.resolve(__dirname, '../templates/GQLTestClient.ts'))
  ).toString();

  const funcReg = /\/\*\*\s\%QUERIES\%\s\*\//;
  template = template.replace(funcReg, funcs);


  const importReg = /\/\*\*\s\%IMPORT\%\s\*\//;
  template = template.replace(importReg, `import {${importTypes.join(', ')}} from './schema'`);


  return await compile('TestClient.ts', template);
};
