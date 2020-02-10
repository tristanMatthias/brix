module.exports = {
  setupFilesAfterEnv: [
    'jest-extended',
  ],

  setupFiles: [
    'reflect-metadata', // Allow for decorators
  ],

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  testRegex: [/tests\/.+\.ts/],
  testPathIgnorePatterns: ['./node_modules', './tests/util'],

  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
      diagnostics: false,
    },
  },

  collectCoverage: process.env.NODE_ENV === 'CI',
  collectCoverageFrom: ['src/**/*.ts'],
};
