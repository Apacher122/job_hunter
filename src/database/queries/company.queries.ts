import { CompanyInfoType } from '../../job_guide/models/company_info.models';
import pool from '../index.js';

export async function upsertCompanyInfo(
    job_posting_id: number,
    companyInfo: CompanyInfoType
): Promise<any> {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // upsert company info
        const jobInfo = companyInfo.job_info;
        await client.query(`
            INSERT INTO job_info (
                job_posting_id,
                company_description,
                company_website,
                company_industry,
                company_size,
                company_location,
                company_culture,
                company_values,
                company_benefits,
                position_review,
                typical_salary_ask,
                typical_salary_ask_reason,
                advised_salary_ask,
                advised_salary_ask_reason,
                application_process,
                expected_response_time
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8,
                $9, $10, $11, $12, $13, $14, $15, $16
            )
            ON CONFLICT (job_posting_id) DO UPDATE SET
                company_description = EXCLUDED.company_description,
                company_website = EXCLUDED.company_website,
                company_industry = EXCLUDED.company_industry,
                company_size = EXCLUDED.company_size,
                company_location = EXCLUDED.company_location,
                company_culture = EXCLUDED.company_culture,
                company_values = EXCLUDED.company_values,
                company_benefits = EXCLUDED.company_benefits,
                position_review = EXCLUDED.position_review,
                typical_salary_ask = EXCLUDED.typical_salary_ask,
                typical_salary_ask_reason = EXCLUDED.typical_salary_ask_reason,
                advised_salary_ask = EXCLUDED.advised_salary_ask,
                advised_salary_ask_reason = EXCLUDED.advised_salary_ask_reason,
                application_process = EXCLUDED.application_process,
                expected_response_time = EXCLUDED.expected_response_time
        `, [
            job_posting_id,
            companyInfo.company_description,
            companyInfo.company_website,
            companyInfo.company_industry,
            companyInfo.company_size,
            companyInfo.company_location,
            companyInfo.company_culture,
            companyInfo.company_values,
            companyInfo.company_benefits,
            jobInfo.position_review,
            jobInfo.typical_salary_ask,
            jobInfo.typical_salary_ask_reason,
            jobInfo.advised_salary_ask,
            jobInfo.advised_salary_ask_reason,
            jobInfo.application_process,
            jobInfo.expected_response_time
        ]);

         // Delete old possible_interview_questions for this job_posting_id
        await client.query(`DELETE FROM possible_interview_questions WHERE job_posting_id = $1`, [job_posting_id]);

        for (const q of jobInfo.behavioral_questions) {
            await client.query(`
                INSERT INTO possible_interview_questions (
                    job_posting_id,
                    is_behavioral_or_technical,
                    question,
                    question_source,
                    answer,
                    what_they_look_for,
                    what_to_study
                )
                VALUES (
                    $1, $2, $3, $4, $5, $6, $7
                )
            `, [
                job_posting_id,
                "behavioral",
                q.question,
                q.question_source,
                q.answer,
                q.what_they_look_for,
                q.what_to_study
            ]);
        }

        for (const q of jobInfo.technical_questions) {
            await client.query(`
                INSERT INTO possible_interview_questions (
                    job_posting_id,
                    is_behavioral_or_technical,
                    question,
                    question_source,
                    answer,
                    what_they_look_for,
                    what_to_study
                )
                VALUES (
                    $1, $2, $3, $4, $5, $6, $7
                )
            `, [
                job_posting_id,
                "technical",
                q.question,
                q.question_source,
                q.answer,
                q.what_they_look_for,
                q.what_to_study
            ]);
        } 

        for (const q of jobInfo.coding_questions) {
            await client.query(`
                INSERT INTO possible_interview_questions (
                    job_posting_id,
                    is_behavioral_or_technical,
                    question,
                    question_source,
                    answer,
                    what_they_look_for,
                    what_to_study
                )
                VALUES (
                    $1, $2, $3, $4, $5, $6, $7
                )
            `, [
                job_posting_id,
                "coding",
                q.question,
                q.question_source,
                q.answer,
                q.what_they_look_for,
                q.what_to_study
            ]);
        }

         // Delete old additional_information for this job_posting_id

        for (const info of jobInfo.additional_information) {
            await client.query(`
                INSERT INTO additional_information (
                    job_posting_id,
                    information_title,
                    text
                )
                VALUES (
                    $1, $2, $3
                )
            `, [
                job_posting_id,
                info.information_title,
                info.text
            ]);
        }

        await client.query('COMMIT');
        return { success: true };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error upserting company info:', error);
        throw error;
    } finally {
        client.release();
    }
}