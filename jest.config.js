module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: [
    'jest-extended',
  ],
  setupFiles: [
    'reflect-metadata', // Allow for decorators
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
      diagnostics: false,
    },
  },
  roots: [
    'packages/',
  ],
  watchPathIgnorePatterns: [
    "packages\/\.*\/node_modules"
  ],

  collectCoverage: true,
  collectCoverageFrom: [
    './packages/*/src/**/*.ts',
    '!**/*.d.ts'
  ],
};
