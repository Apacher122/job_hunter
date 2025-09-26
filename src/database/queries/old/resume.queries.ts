import { ResumeItemsType } from '../../../features/resume/models/resume.models.js';
import pool from '../../index.js';

export async function upsertResume(
    jobPostingId: number,
    resume: ResumeItemsType
): Promise<any> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insert or update the resume entry for the job posting
        const result = await client.query(
            `INSERT INTO resumes (job_posting_id)
            VALUES ($1)
            ON CONFLICT (job_posting_id)
            DO UPDATE SET job_posting_id = EXCLUDED.job_posting_id
            RETURNING id`,
            [jobPostingId]
        );
        const resumeId = result.rows[0].id;

        for (const experience of resume.experiences) {
            const experienceRes = await client.query(
                `INSERT INTO experiences (
                    resume_id,
                    position,
                    company,
                    start_date,
                    end_date
                )
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (company, position)
                DO UPDATE SET
                    start_date = EXCLUDED.start_date,
                    end_date = EXCLUDED.end_date
                RETURNING id`,
                [
                    resumeId,
                    experience.position,
                    experience.company,
                    experience.start,
                    experience.end
                ]
            );
            const experienceId = experienceRes.rows[0].id;

            await client.query(
                `DELETE FROM experience_descriptions
                WHERE experience_id = $1`,
                [experienceId]
            );

            for (const description of experience.description) {
                await client.query(
                    `INSERT INTO experience_descriptions (
                        experience_id,
                        text,
                        justification_for_change,
                        is_new_suggestion
                    )
                    VALUES ($1, $2, $3, $4)`,
                    [
                        experienceId,
                        description.text,
                        description.justification_for_change,
                        description.is_new_suggestion
                    ]
                );
            }
        }

        for (const skill of resume.skills) {
            const skillRes = await client.query(
                `INSERT INTO skills (resume_id, category, justification_for_changes)
                VALUES ($1, $2, $3)
                ON CONFLICT (resume_id, category)
                DO UPDATE SET justification_for_changes = EXCLUDED.justification_for_changes
                RETURNING id`,
                [
                    resumeId,
                    skill.category,
                    skill.justification_for_changes
                ]
            );

            const skillId = skillRes.rows[0].id;

            await client.query(
                `DELETE FROM skill_items
                WHERE skill_id = $1`,
                [skillId]
            );

            for (const description of skill.skill) {
                await client.query(
                    `INSERT INTO skill_items (
                        skill_id,
                        item
                    )
                    VALUES ($1, $2)`,
                    [skillId, description.item]
                )
            }
        }

        await client.query('COMMIT');
        console.log('Resume upserted successfully for job posting ID:', jobPostingId);
    } catch (error) {
        await client.query('ROLLBACK');
        const e = error as Error;
        console.error('Error upserting resume:', e.message, e.stack);
        throw error;
    } finally {
        client.release();
    }
}