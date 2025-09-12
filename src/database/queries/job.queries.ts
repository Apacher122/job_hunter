import { AppliedJob } from '../../shared/types/types';
import { JobPosting } from '../../shared/data/info.store.js';
import pool from '../index.js';

export async function insertJobInfo(jobPost: JobPosting): Promise<any> {
    if (!jobPost || !jobPost.companyName) {
        console.error('Job posting content or company name is not available in infoStore.');
        return;
    }
    console.log(`-----Applicant Count: ${jobPost.applicantCount}\n------Details: ${jobPost.jobDetails}`)

    const client = await pool.connect();

    const query = `
    INSERT INTO job_postings (
        body,
        companyName,
        rawCompanyName,
        applicantCount,
        jobDetails,
        url,
        position,
        positionSummary,
        yearsOfExp,
        educationLvl,
        requirements,
        niceToHaves,
        toolsAndTech,
        progLanguages,
        frmwrksAndLibs,
        databases,
        cloudPlatforms,
        industryKeywords,
        softSkills,
        certifications,
        companyCulture,
        companyValues,
        salary
        )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
    ON CONFLICT (companyName, position) DO UPDATE SET
        body = EXCLUDED.body,
        url = EXCLUDED.url,
        rawCompanyName = EXCLUDED.rawCompanyName
    RETURNING id
    `;
    
    try {
        // const jobPost = infoStore.jobPosting;
        // const { body, companyName, url, position, rawCompanyName } = infoStore.jobPosting;
        const values = [
            jobPost.body,
            jobPost.companyName,
            jobPost.rawCompanyName,
            jobPost.applicantCount,
            jobPost.jobDetails,
            jobPost.url,
            jobPost.position,
            jobPost.positionSummary,
            jobPost.yearsOfExp,
            jobPost.educationLvl,
            jobPost.requirements,
            jobPost.niceToHaves,
            jobPost.toolsAndTech,
            jobPost.progLanguages,
            jobPost.frmwrksAndLibs,
            jobPost.databases,
            jobPost.cloudPlatforms,
            jobPost.industryKeywords,
            jobPost.softSkills,
            jobPost.certifications,
            jobPost.companyCulture,
            jobPost.companyValues,
            jobPost.salary,
        ]
        await client.query('BEGIN');
        const result = await client.query(query, values);
        await client.query('COMMIT');
        return Number(result.rows[0].id);
    } catch (error) {
        console.log("Error inserting job posting");
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export async function getApplicationList(): Promise<AppliedJob[]> {
    const client = await pool.connect();

    const query = `
        SELECT id, rawCompanyName, position
        FROM job_postings
        ORDER BY id desc
    `
    try {
        await client.query('BEGIN');
        const res = await client.query(query);
        await client.query('COMMIT');
        return res.rows.map(row => ({
            id: row.id,
            company: row.rawcompanyname,
            position: row.position
        }));
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

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

export async function getJobPost(id: number): Promise<JobPosting> {
       const client = await pool.connect();

    try {
        await client.query('BEGIN');


        const query = `
            SELECT
                id,
                body,
                companyname AS "companyName",
                rawcompanyname AS "rawCompanyName",
                applicantcount AS "applicantCount",
                jobdetails AS "jobDetails",
                url,
                position,
                positionsummary AS "positionSummary",
                yearsofexp AS "yearsOfExp",
                educationlvl AS "educationLvl",
                requirements,
                nicetohaves AS "niceToHaves",
                toolsandtech AS "toolsAndTech",
                proglanguages AS "progLanguages",
                frmwrksandlibs AS "frmwrksAndLibs",
                databases,
                cloudplatforms AS "cloudPlatforms",
                industrykeywords AS "industryKeywords",
                softskills AS "softSkills",
                certifications,
                companyculture AS "companyCulture",
                companyvalues AS "companyValues",
                salary
            FROM job_postings WHERE id = $1
        `;

        const values = [id];
        const result = await client.query<JobPosting>(query, values);
        await client.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    } 
}