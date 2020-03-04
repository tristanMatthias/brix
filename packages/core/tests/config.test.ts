import { Config, Env, BrixConfig } from '../src';
import { CONFIG_BASE, CONFIG_DEVELOPMENT, CONFIG_TEST } from '../src/config/defaults';
import { ErrorInvalidConfigOption, ErrorInvalidEnvironment } from '../src/errors';
import path from 'path';
beforeEach(() => Config.reset());

describe('Config initialization', () => {
  it('should have default Config', () => {
    expect(Config).toHaveProperty('env');
    expect(Config).toHaveProperty('port');
    expect(Config).toHaveProperty('rootDir');
    expect(Config).toHaveProperty('mocks');
    expect(Config).toHaveProperty('skipDatabase');
    expect(Config).toHaveProperty('dbConnection');
    expect(Config).toHaveProperty('accessTokenSecret');
    expect(Config).toHaveProperty('clsNamespace');
  });
});

describe('Config.reset()', () => {
  it('should reset back to defaults', async () => {
    await Config.update({
      port: 5000,
      middleware: [() => { }],
      plugins: { fake: { foo: 'bar' } },
      clsNamespace: 'updated'
    });
    Config.reset();
    expect(Config.port).toEqual(CONFIG_BASE.port);
    expect(Config.middleware).toBeArrayOfSize(0);
    expect(Object.keys(Config.plugins)).toBeArrayOfSize(0);
    expect(Config.clsNamespace).toEqual(CONFIG_BASE.clsNamespace);
  });
});


describe('Config.loadEnv()', () => {
  it('should load development environment', async () => {
    await Config.loadEnv(Env.development);
    expect(Config.accessTokenSecret).toEqual(CONFIG_DEVELOPMENT.accessTokenSecret);
    expect(Config.logLevel).toEqual('success');
  });
  it('should load test environment', async () => {
    await Config.loadEnv(Env.test);
    expect(Config.logLevel).toEqual('warning');
  });
  it('should load production environment', async () => {
    await Config.loadEnv(Env.production);
    expect(Config.logLevel).toEqual('error');
  });
});


describe('Config.loadConfig()', () => {
  it('should load config from Config.rootDir', async () => {
    await Config.update({ rootDir: path.join(__dirname, './projects/config/yml') });
    await Config.loadConfig();
    expect(Config.port).toEqual(1234);
    expect(Config.clsNamespace).toEqual('yml');
  });

  it('should load config from dir passed in', async () => {
    // Check it's reset
    expect(Config.port).toEqual(4000);
    await Config.loadConfig(path.join(__dirname, './projects/config/yml'));
    expect(Config.port).toEqual(1234);
    expect(Config.clsNamespace).toEqual('yml');
  });

  it('should load cached config if nothing changed', async () => {
    // Check it's reset
    expect(Config.port).toEqual(4000);
    await Config.loadConfig(path.join(__dirname, './projects/config/yml'));
    expect(Config.port).toEqual(1234);
    await Config.loadConfig();
    expect(Config.port).toEqual(1234);
  });

  it('should override if new dir is passed', async () => {
    // Check it's reset
    expect(Config.port).toEqual(4000);
    await Config.loadConfig(path.join(__dirname, './projects/config/yml'));
    expect(Config.port).toEqual(1234);
    expect(Config.clsNamespace).toEqual('yml');
    await Config.loadConfig(path.join(__dirname, './projects/config/yaml'));
    expect(Config.port).toEqual(5678);
    expect(Config.clsNamespace).toEqual('yaml');
  });

  it('should load brix.json files', async () => {
    // Check it's reset
    expect(Config.port).toEqual(4000);
    await Config.loadConfig(path.join(__dirname, './projects/config/json'));
    expect(Config.port).toEqual(1234);
    expect(Config.clsNamespace).toEqual('json');
  });
  it('should load .brixrc files', async () => {
    // Check it's reset
    expect(Config.port).toEqual(4000);
    await Config.loadConfig(path.join(__dirname, './projects/config/brixrc'));
    expect(Config.port).toEqual(5678);
    expect(Config.clsNamespace).toEqual('.brixrc');
  });
});


describe('Config.loadConfig()', () => {
  it('should successfully update with config as BrixConfig', async () => {
    expect(Config.port).toEqual(4000);
    await Config.update({ port: 1234 });
    expect(Config.port).toEqual(1234);
  });
  it('should successfully update with config as Env string', async () => {
    expect(Config.env).toEqual(Env.test);
    expect(Config.logLevel).toEqual('warning');
    // @ts-ignore
    await Config.update('development');
    expect(Config.env).toEqual(Env.development);
    expect(Config.logLevel).toEqual('success');
  });
  it('should throw ErrorInvalidEnvironment for invalid config as string', async () => {
    try {
      // @ts-ignore
      await Config.update('invalid');
    } catch (e) {
      expect(e).toBeInstanceOf(ErrorInvalidEnvironment);
    }
  });
  it('should throw ErrorInvalidConfigOption for invalid option', async () => {
    try {
      // @ts-ignore
      await Config.update({ port: 'asd' });
    } catch (e) {
      expect(e).toBeInstanceOf(ErrorInvalidConfigOption);
    }
  });
});


describe('validateConfig', () => {
  it('should throw error for extra prop', async () => {
    expect.assertions(1);
    try {
      await Config.update({
        // @ts-ignore Deliberately break
        foo: 'bar'
      });
    } catch (e) {
      expect(e).toBeInstanceOf(ErrorInvalidConfigOption);
    }
  });

  const testConfig = (
    prop: keyof BrixConfig,
    value: any = 123,
    expecting: string = 'string',
    required = false
  ) => {
    it(`validate ${prop} as ${expecting}`, async () => {
      expect.assertions(2);
      try {
        await Config.update({ [prop]: value });
      } catch (e) {
        expect(e).toBeInstanceOf(ErrorInvalidConfigOption);
        expect(e.message).toContain(`${prop} must be a \`${expecting}\``);
      }
    });
    if (required) {
      it(`validate ${prop} as required`, async () => {
        expect.assertions(2);
        try {
          await Config.update({ [prop]: undefined });
        } catch (e) {
          expect(e).toBeInstanceOf(ErrorInvalidConfigOption);
          expect(e.message).toContain(`${prop} is a required field`);
        }
      });
    }
  };

  const testConfigOneOf = (
    prop: keyof BrixConfig,
    value: any = 123,
    expecting: any[]
  ) => {
    const expectStr = expecting.join(', ');
    it(`validate ${prop} as one of ${expectStr}`, async () => {
      expect.assertions(2);
      try {
        await Config.update({ [prop]: value });
      } catch (e) {
        expect(e).toBeInstanceOf(ErrorInvalidConfigOption);
        expect(e.message).toContain(`${prop} must be one of the following values: ${expectStr}`);
      }
    });
  };

  testConfig('env');
  testConfig('port', 'asd', 'number');
  testConfig('rootDir');
  testConfig('distDir');
  testConfig('skipDatabase', 123, 'boolean');
  testConfig('mocks', 123, 'boolean');
  testConfig('resolverDir');
  testConfig('resolverDir');
  testConfig('mocksDir');
  testConfig('middlewareDir');
  testConfig('accessTokenSecret', 123, 'string', true);
  testConfig('clsNamespace');
  testConfigOneOf('logLevel', 'foo', ['error', 'warning', 'info', 'success']);

});
