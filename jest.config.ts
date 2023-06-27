import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["./test/setEnv.js"],
  reporters: ["default", "github-actions"],
};

export default config;
