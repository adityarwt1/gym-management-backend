import { defineConfig } from '@prisma/config';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL environment variable is not set. Please create a .env file with DATABASE_URL="postgresql://user:password@localhost:5432/database?schema=public"',
  );
}

export default defineConfig({
  schema: 'prisma/schema.prisma',

  datasource: {
    // This replaces "url = env()"
    url: databaseUrl,
  },

  migrations: {
    path: 'prisma/migrations',
  },
});
