import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset({
  useESM: true,
}).transform;

export default {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@akdev1l/constructs$': '<rootDir>/src/index.ts'
  },
  transform: {
    ...tsJestTransformCfg,
  },
};
