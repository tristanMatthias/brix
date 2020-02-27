import { BrixConfig, Config } from '@brix/core';
import fetch from 'node-fetch';
import path from 'path';
import getPort from 'get-port';

export const baseOptions: Partial<BrixConfig> = {
  resolverDir: path.join(__dirname, '../mocks/resolvers'),
  middlewareDir: path.join(__dirname, '../mocks/middlewares'),
  skipDatabase: true
};

export const pjPath = (...pj: string[]) => path.join(__dirname, '../projects', ...pj), ;

export const project = async (pj: string = './default', options: Partial<BrixConfig> = {}) => ({
  ...baseOptions,
  rootDir: pjPath(pj),
  port: await getPort({ port: Math.round(Math.random() * 1000) }),
  ...options
});


export const query = async (
  query: string,
  variables: any = {},
  headers: any = {}
) => {
  const res = await fetch(`http://localhost:${Config.port}/graphql`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...headers
    },
    body: JSON.stringify({
      query,
      variables
    })
  });
  const json = await res.json();
  return json.errors || json.data;
};
