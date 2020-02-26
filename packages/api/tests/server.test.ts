import { BrixPlugins, Config, Env } from '@brix/core';

import { server } from '../src/server';
import { project, query, pjPath } from './utils';


let httpServer;
beforeEach(() => {
  Config.reset();
  BrixPlugins.clear();
});

afterEach(async res => {
  await new Promise(res => httpServer.close(res));
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


describe('Server middleware', () => {
  it('should load middleware array passed manually into config', async () => {
    ({ httpServer } = await server(await project('./', { middleware: [() => { }] }));
    expect(Config.middleware).toBeArrayOfSize(1);
  });

  it('should load single middleware passed manually into config', async () => {
    ({ httpServer } = await server(await project('./', { middleware: () => { } }));
    expect(Config.middleware).toBeFunction();
  });

  it('should load single middleware from default middleware directory', async () => {
    ({ httpServer } = await server(await project('middleware', {
      middlewareDir: undefined
    })));
    expect(Config.middleware).toBeArrayOfSize(2);
  });

  it('should not load middleware that doesn\'t export default function', async () => {
    ({ httpServer } = await server(await project('middleware-error', {
      middlewareDir: pjPath('middleware-error', 'middleware')
    })));
    expect(Config.middleware).toBeArrayOfSize(0);
  });
});


describe('Server auth', () => {
  it('should successfully register auth middleware', async () => {
    ({ httpServer } = await server(await project('authChecker')));
    expect(BrixPlugins.authCheckers).toBeArrayOfSize(2);
  });

  it('should pass authCheckers with no auth', async () => {
    ({ httpServer } = await server(await project('authChecker')));
    const { authedMock } = (await query('query{authedMock{test}}'));
    expect(authedMock).toHaveProperty('test', 1);
  });
  it('should pass authCheckers with auth', async () => {
    ({ httpServer } = await server(await project('authChecker')));
    const { authedMock } = (await query('query{authedMock{test}}', {}, {
      authorization: 'valid'
    }));

    expect(authedMock).toHaveProperty('test', 1);
  });
  it('should fail authCheckers', async () => {
    ({ httpServer } = await server(await project('authChecker')));
    const [err] = (await query('query{authedMock{test}}', {}, {
      authorization: 'invalid'
    }));
    expect(err).toHaveProperty('message');
    expect(err.message).toContain('Access denied!');
  });
});
