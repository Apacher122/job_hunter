import { Kysely, PostgresDialect } from 'kysely';

import { DB } from './schemas/ordo-meritum.schemas.js';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'host.docker.internal',
  database: process.env.DB_NAME || 'OrdoMeritumDev',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool,
  }),
});

export async function shutdown() {
  try {
    await pool.end();
    console.log('Database connections closed.');
  } catch (err) {
    console.error('Error closing the database:', err);
  }
}

async function testConnection() {
  try {
    await db.selectFrom('companies').selectAll().limit(1).execute();
    console.log('Connected to the database successfully (via Kysely)');
  } catch (error) {
    console.error('Error connecting to the database via Kysely:', error);
  }
}

testConnection();

// Candidate
export * from './queries/crud/candidate/candidates.crud.js';
export * from './queries/crud/candidate/education.crud.js';
export * from './queries/crud/candidate/writing_samples.crud.js';
export * from './queries/crud/candidate/questions.crud.js';

// Resume
export * from './queries/crud/resume/resume.crud.js';
export * from './queries/crud/resume/experience.crud.js';
export * from './queries/crud/resume/projects.crud.js';
export * from './queries/crud/resume/skills.crud.js';

// Company & Role
export * from './queries/crud/company/company_info.crud.js';
export * from './queries/crud/job_posts/role.crud.js';
export * from './queries/crud/job_posts/job_requirements.crud.js';

// Guides
export * from './queries/crud/guides/match_summaries.crud.js';

export * from './queries/complex/jobs.queries.js';
