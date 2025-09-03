import { infoStore } from '../../shared/data/info.store.js';
import pool from '../index.js';

export async function insertJobInfo(): Promise<any> {
    if (!infoStore.jobPosting || !infoStore.jobPosting.companyName) {
        console.error('Job posting content or company name is not available in infoStore.');
        return;
    }

    const client = await pool.connect();

    const query = `
        INSERT INTO job_postings (company_name, position, body, url, raw_company_name)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (company_name, position) DO UPDATE SET
            body = EXCLUDED.body,
            url = EXCLUDED.url,
            raw_company_name = EXCLUDED.raw_company_name
        RETURNING id
    `;
    
    try {
        const { body, companyName, url, position, rawCompanyName } = infoStore.jobPosting;
        const values = [companyName, position, body, url, rawCompanyName]
        await client.query('BEGIN');
        const result = await client.query(query, values);
        await client.query('COMMIT');
        return Number(result.rows[0].id);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export async function getJobInfo(companyName: string, position: string): Promise<any> {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');


        const query = `
            SELECT * FROM job_info WHERE company_name = $1 AND position = $2
        `;

        const values = [companyName, position];
        const result = await client.query(query, values);
        await client.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};