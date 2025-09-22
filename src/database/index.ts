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

export async function shutdown() {
  try {
    await pool.end(); // closes all connections in the pool
    console.log('Database connections closed.');
  } catch (err) {
    console.error('Error closing the database:', err);
  }
}

async function testConnection() {
  try {
    await db.selectFrom('candidates').selectAll().limit(1).execute();
    console.log('Connected to the database successfully (via Kysely)');
  } catch (error) {
    console.error('Error connecting to the database via Kysely:', error);
  }
}

// Main table CRUD
export * from './queries/crud/candidate/candidates.crud';
export * from './queries/crud/candidate/education.crud';
export * from './queries/crud/resume/resume.crud';
export * from './queries/crud/resume/experience.crud';
export * from './queries/crud/resume/projects.crud';
export * from './queries/crud/resume/skills.crud';
export * from './queries/crud/job_posts/job_posting.crud';
export * from './queries/crud/job_posts/job_info.crud';
export * from './queries/crud/job_posts/additional_info.crud';
export * from './queries/crud/guides/interview_prep.crud';
export * from './queries/crud/guides/match_summaries.crud';
export * from './queries/crud/guides/suggestions.crud';

// Many-to-many table operations
export * from './queries/relations/company_culture.crud';
export * from './queries/relations/company_values.crud';
export * from './queries/relations/job_requirements/requirements.crud';
export * from './queries/relations/job_requirements/req_certs.crud';
export * from './queries/relations/job_requirements/req_cloud_plats.crud';
export * from './queries/relations/job_requirements/req_databases.crud';
export * from './queries/relations/job_requirements/req_frameworks.crud';
export * from './queries/relations/job_requirements/req_industry_kwds.crud';
export * from './queries/relations/job_requirements/req_prog_langs.crud';
export * from './queries/relations/job_requirements/req_soft_skills.crud';
export * from './queries/relations/job_requirements/req_tools.crud';
