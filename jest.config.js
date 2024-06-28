/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/tests/**/*.test.ts'],
  setupFiles: ['<rootDir>/jest.setup.ts'],
  testTimeout: 10000,
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};