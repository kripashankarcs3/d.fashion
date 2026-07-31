import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    env: {
      JWT_SECRET: "test-secret",
      MONGODB_URI: "mongodb://localhost:27017/deestyle_test",
      YOUCAM_API_KEY: "test-key",
    },
  },
});
