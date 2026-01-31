import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset({
}).transform;

export default {
  testEnvironment: "node",
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@akdev1l/constructs$': '<rootDir>/src/index.ts'
  },
  transform: {
    ...tsJestTransformCfg,
  },
};
