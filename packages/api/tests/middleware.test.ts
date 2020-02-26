import { BrixPlugins, Config } from '@brix/core';

import { server } from '../src/server';
import { pjPath, project } from './utils';


let httpServer;
beforeEach(() => {
  Config.reset();
  BrixPlugins.clear();
});

afterEach(async res => {
  await new Promise(res => httpServer.close(res));
  res();
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

