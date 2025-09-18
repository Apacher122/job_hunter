import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from './schemas/ordo-meritum.schemas';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: 'host.docker.internal',
  database: process.env.DB_NAME || 'ResumeBuilder',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool,
  }),
});

async function testConnection() {
  try {
    await db.selectFrom('candidates').selectAll().limit(1).execute();
    console.log('Connected to the database successfully (via Kysely)');
  } catch (error) {
    console.error('Error connecting to the database via Kysely:', error);
  }
}

