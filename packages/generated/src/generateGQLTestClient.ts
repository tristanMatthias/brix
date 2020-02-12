import API from '@brix/api';
import fs from 'fs-extra';
import { GraphQLField, GraphQLFieldMap } from 'graphql';
import path from 'path';

import { compile } from './lib/tsProject';

export type FieldMap = GraphQLFieldMap<any, any, { [key: string]: any; }>;
export type Field = GraphQLField<any, any, { [key: string]: any; }>;

const argType = (type?: string) => {
  if (!type) return '';

  let t = type;
  const isArray = t.startsWith('[');
  if (isArray) t = t.slice(1, -1);
  const isRequired = t.endsWith('!');
  if (isRequired) t = t.slice(0, -1);

  switch (t) {
    default:
      t = t.toLowerCase();
  }

  return (isRequired ? ':' : '?:') + (isArray ? `${t}[]` : t);
};

const fieldType = (f: Field) => /(\w+)/.exec(f.type.toString())![1];

export const generateTestClientQuery = (
  name: string,
  field: Field
) => {

  const args = field.args.map(v => {
    return v.name + argType(v.type.toString());
  }).join(', ');

  const returnType = fieldType(field);

  return `
    async ${name}(${args}): Promise<${returnType}> {
      return this._request<${returnType}>('query', '${name}');
    }
  `;
};


export const generateGQLTestClient = async () => {
  await API.config.loadConfig(process.cwd());

  const schema = await API.lib.schema.buildSchema();
  const query = schema.getQueryType()!;
  const queries = query.getFields();

  const funcs = Object.entries(queries)
    .map(([name, f]) => generateTestClientQuery(name, f as Field))
    .join('\n');

  let template = (await fs.readFile(
    path.resolve(__dirname, '../templates/GQLTestClient.ts'))
  ).toString();

  const funcReg = /\/\*\*\s\%QUERIES\%\s\*\//;
  template = template.replace(funcReg, funcs);


  const importTypes = Object.values(queries)
    .map(f => fieldType(f as Field))
    // Unique
    .filter((value, index, self) => self.indexOf(value) === index)
    .join(', ');

  const importReg = /\/\*\*\s\%IMPORT\%\s\*\//;
  template = template.replace(importReg, `import {${importTypes}} from './schema'`);


  compile('TestClient.ts', template);
};
