module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__/test_cases/e2e", "<rootDir>/test"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFiles: ["<rootDir>/__tests__/test-constants.ts"],
  modulePathIgnorePatterns: ["<rootDir>/cdk.out"],
  collectCoverageFrom: [
    "functions/**/*.ts",
    "bin/**/*.ts",
    "lib/**/*.ts",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  testTimeout: 90000,
  globals: {
    "ts-jest": {
      tsconfig: {
        esModuleInterop: true,
      },
    },
  },
};
