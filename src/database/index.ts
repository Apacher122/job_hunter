import { Pool } from 'pg';
d
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: 'host.docker.internal',
  database: process.env.DB_NAME || 'ResumeBuilder',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
  // add other options as needed
});

pool.connect()
  .then(client => {
    console.log('Connected to the database successfully');
    client.release();
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  });

export default pool;