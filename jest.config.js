import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset({
  useESM: true,
}).transform;

export default {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  roots: ['<rootDir>/test'],
  moduleNameMapper: {
    '^@akdev1l/constructs$': '<rootDir>/src/index.ts'
  },
  transform: {
    ...tsJestTransformCfg,
  },
};
