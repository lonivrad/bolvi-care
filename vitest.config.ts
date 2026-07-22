import { defineConfig } from 'vitest/config';
import { config as loadEnv } from 'dotenv';

// Load the test env before anything reads DATABASE_URL / AUTH_SECRET.
loadEnv({ path: '.env.test' });

export default defineConfig({
  // Native resolution of the tsconfig `@/*` path aliases (Vite 6+).
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    globals: false,
    include: ['test/**/*.test.ts'],
    globalSetup: ['./test/setup/global-setup.ts'],
    setupFiles: ['./test/setup/truncate.ts'],
    // The suite shares one Postgres database and truncates between tests, so
    // run files serially to avoid cross-test interference.
    pool: 'forks',
    fileParallelism: false,
    hookTimeout: 60_000,
    testTimeout: 30_000,
  },
});
