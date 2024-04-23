/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */


const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],

  verbose: true,
  forceExit: true,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: `<rootDir>${compilerOptions.baseUrl}`, useESM: true }),
  modulePaths: ['<rootDir>'],
  //clearMocks: true,
}
