import { BrixPlugins, Config } from '@brix/core';

import { server } from '../src/server';
import { project, query } from './utils';


let httpServer;
beforeEach(() => {
  Config.reset();
  BrixPlugins.clear();
});

afterEach(async res => {
  await new Promise(res => httpServer?.close(res));
  res();
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
