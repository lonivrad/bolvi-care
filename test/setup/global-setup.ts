import { execSync } from 'node:child_process';
import { config as loadEnv } from 'dotenv';

// Runs once before the whole suite: verify we're pointed at a test database,
// then push the current Prisma schema into it (fresh each run).
export default async function globalSetup() {
  loadEnv({ path: '.env.test' });

  const url = process.env.DATABASE_URL ?? '';
  const dbName = url.split('/').pop()?.split('?')[0] ?? '';

  // Hard guard: never run the destructive schema push against a non-test DB.
  if (!/test/i.test(dbName)) {
    throw new Error(
      `Refusing to run tests: DATABASE_URL database "${dbName}" does not look ` +
        `like a test database. The name must contain "test".`
    );
  }

  execSync('npx prisma db push --skip-generate --force-reset', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DIRECT_URL: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
    },
  });
}
