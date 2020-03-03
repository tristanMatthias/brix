import chalk from 'chalk';
import * as yup from 'yup';

/**
 * Ensure that a Yup object doesn't have extra properties
 * @param valid Valid properties allowed for the object
 * @param prefix String to prefix the keys with
 */
const validateProps = (valid: string[], prefix?: string): yup.TestOptions => ({
  name: 'ExtraProps',
  test: v => {
    for (const p of Object.keys(v)) {
      const prop = prefix ? `${prefix}.${p}` : p;
      if (!valid.includes(p)) throw new Error(`Invalid option ${chalk.yellow(prop)}`);
    }
    return true;
  }
});


/**
 * Validates an `BrixConfig` object against the valid schema
 */
export const validateConfig = yup.object().shape({
  env: yup.string().required(),
  port: yup.number().required(),
  rootDir: yup.string(),
  skipDatabase: yup.boolean(),
  mocks: yup.boolean(),

  resolverDir: yup.string(),
  mocksDir: yup.string(),
  middlewareDir: yup.string(),
  generatedDir: yup.string(),

  dbConnection: yup.object({
    database: yup.string().when('skipDatabase', { is: false, then: yup.string().required() }),
    username: yup.string().when('skipDatabase', { is: false, then: yup.string().required() }),
    dialect: yup.string(),
    password: yup.string(),
    host: yup.string().when('skipDatabase', { is: false, then: yup.string().required() }),
    port: yup.number().when('skipDatabase', { is: false, then: yup.number().required() }),

    storage: yup.string()
  })
    .test(validateProps([
      'database',
      'username',
      'dialect',
      'password',
      'host',
      'port',
      'storage'
    ], 'dbConnection')),

  accessTokenSecret: yup.string().required(),

  corsAllowFrom: yup.mixed(),
  clsNamespace: yup.string(),
  logLevel: yup.string().oneOf(['error', 'warning', 'info', 'success']),
  plugins: yup.object(),
  installPlugins: yup.boolean()

}).test(validateProps([
  'env',
  'port',
  'mocks',
  'mocksDir',
  'rootDir',
  'resolverDir',
  'middlewareDir',
  'generatedDir',
  'middleware',
  'dbConnection',
  'skipDatabase',
  'accessTokenSecret',
  'corsAllowFrom',
  'plugins',
  'installPlugins',
  'clsNamespace',
  'logLevel'
]));
