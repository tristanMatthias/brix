import { BrixPlugins, Config, Env } from '@brix/core';

import { server } from '../src/server';
import { project } from './utils';


let httpServer;
beforeEach(() => {
  Config.reset();
  BrixPlugins.clear();
});

afterEach(async res => {
  await new Promise(res => httpServer?.close(res));
  res();
});


describe('Server initialization', () => {

  it('should return httpServer', async () => {
    ({ httpServer } = await server(await project()));
    expect(httpServer).toBeDefined();
    expect(httpServer).toHaveProperty('close');
  });

  it('should load config from rootDir', async () => {
    ({ httpServer } = await server(await project('default')));
    expect(Config.plugins).toHaveProperty(['./plugin/plugin.ts'], null);
  });

  it('should load development env if no process.env.NODE_ENV', async () => {
    const previous = process.env.NODE_ENV;
    delete process.env.NODE_ENV;
    ({ httpServer } = await server(await project()));
    expect(Config.env).toEqual(Env.development);
    process.env.NODE_ENV = previous;
  });
});
