module.exports = {
  setupFilesAfterEnv: [
    'jest-extended',
  ],
  rootDir: './',

  setupFiles: [
    'reflect-metadata', // Allow for decorators
  ],

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // testRegex: [/tests\/.+\.test\.ts/],
  testMatch: ['**\.test\.ts'],
  testPathIgnorePatterns: ['./node_modules', './tests/projects', './tests/utils'],

  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
      diagnostics: false,
    },
  },

  // TODO fix this env
  // collectCoverage: process.env.NODE_ENV === 'CI',
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.ts'],
};
