import 'dotenv/config';
// import { PrismaClient } from '../../prisma/generated/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../../prisma/generated/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in the environment');
}

const adapter = new PrismaNeon({ connectionString });

export const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
});
