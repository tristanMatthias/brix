import path from 'path';

import { BrixPlugins, Config } from '../src';
import { ErrorPluginRegistered, ErrorPluginsNotBuilt, ErrorPluginUnknown, ErrorPluginNotAFunction, ErrorRequiredPluginMissing } from '../src/errors';

beforeEach(() => {
  BrixPlugins.clear();
  Config.reset();
});

const loadProject = async (pj: string) => {
  await Config.update({ rootDir: path.join(__dirname, `./projects/plugins/${pj}`) });
  await Config.loadConfig();
};

describe('BrixPlugins initialization', () => {
  it('should have default props', () => {
    expect(BrixPlugins).toHaveProperty('_plugins', {});
    expect(BrixPlugins).toHaveProperty('_buildData', undefined);
    expect(BrixPlugins).toHaveProperty('_building', null);
  });


  const beforeBuildError = (prop: string) => {
    it(`should throw ErrorPluginsNotBuilt for ${prop} property`, async () => {
      expect.assertions(1);
      try {
        expect(BrixPlugins).toHaveProperty('resolvers', []);
      } catch (e) {
        expect(e).toBeInstanceOf(ErrorPluginsNotBuilt);
      }
    });
  };
  beforeBuildError('scalars');
  beforeBuildError('middlewares');
  beforeBuildError('contextMiddlewares');
  beforeBuildError('authCheckers');
});


describe('BrixPlugins.register()', () => {
  it('should load package name from plugin root', async () => {
    await loadProject('simple');
    await BrixPlugins.build();
    expect(BrixPlugins.middlewares).toBeArrayOfSize(1);

  });
  it('should throw ErrorPluginRegistered for clashing plugin name', async () => {
    expect.assertions(1);
    await loadProject('name-clash');
    try {
      await BrixPlugins.build();
    } catch (e) {
      expect(e).toBeInstanceOf(ErrorPluginRegistered);
    }
  });
  it('should register plugin with options', async () => {
    await loadProject('with-options');
    await BrixPlugins.build();
    expect(Config.clsNamespace).toEqual('with-options');
    expect(BrixPlugins).toHaveProperty('_plugins', {
      'plugin-with-options': { name: 'plugin-with-options', package: 'plugin-with-options' }
    });
  });
});

describe('BrixPlugins.build()', () => {
  it('should return _buildData on rebuild', async () => {
    await loadProject('simple');
    const data1 = await BrixPlugins.build();
    const data2 = await BrixPlugins.build();
    expect(data1).toEqual(data2);
  });

  it('should return promise on rebuild', async () => {
    await loadProject('simple');
    const buildingPromise = BrixPlugins.build();
    const promiseDefer = BrixPlugins.build();
    expect(buildingPromise).toEqual(promiseDefer);

    const data1 = await buildingPromise;
    const data2 = await promiseDefer;
    expect(data1).toEqual(data2);
  });

  it('should return promise on rebuild', async () => {
    await loadProject('resolve-node-modules');
    await BrixPlugins.build();
    // @ts-ignore Access private
    expect(BrixPlugins._plugins).toContainAllKeys([
      'non-module-plugin',
      '@brix/plugin-one',
      '@brix/plugin-two',
      'brix-plugin-no-scope',
      'something'
    ]);
  });

  it('successfully builds and properties are accessible', async () => {
    await loadProject('successful');
    await BrixPlugins.build();
    expect(BrixPlugins.authCheckers).toBeArrayOfSize(1);
    expect(BrixPlugins.middlewares).toBeArrayOfSize(1);
    expect(BrixPlugins.contextMiddlewares).toBeArrayOfSize(1);
    expect(BrixPlugins.resolvers).toBeArrayOfSize(1);
    expect(BrixPlugins.scalars).toBeArrayOfSize(1);
  });

  it('should throw ErrorPluginUnknown for unknown plugin', async () => {
    expect.assertions(1);
    await loadProject('unknown');
    try {
      await BrixPlugins.build();
    } catch (e) {
      expect(e).toBeInstanceOf(ErrorPluginUnknown);
    }
  });

  it('should raise error from plugin loading', async () => {
    expect.assertions(1);
    await loadProject('raise-error');
    try {
      await BrixPlugins.build();
    } catch (e) {
      expect(e.message).toEqual('raise-error');
    }
  });

  it('should throw ErrorPluginNotAFunction for non function default export', async () => {
    expect.assertions(1);
    await loadProject('non-function');
    try {
      await BrixPlugins.build();
    } catch (e) {
      expect(e).toBeInstanceOf(ErrorPluginNotAFunction);
    }
  });

  it('successfully builds plugins with requires dependency', async () => {
    await loadProject('requires');
    await BrixPlugins.build();
    // @ts-ignore Access private
    expect(BrixPlugins._plugins).toContainAllKeys([
      'plugin-one',
      'plugin-two'
    ]);
  });

  it('throws ErrorRequiredPluginMissing when dependency is missing', async () => {
    expect.assertions(1);
    await loadProject('missing-requirement');
    try {
      await BrixPlugins.build();
    } catch (e) {
      expect(e).toBeInstanceOf(ErrorRequiredPluginMissing);
    }
  });
});
