import { z } from 'zod';

export const InterviewPrepSchema = z.object({
    tech_stack_info: z.array(
        z.object({
            tech: z.string(),
            tech_info: z.array (
                z.object({
                    info: z.string(),
                })
            ),
        })
    ),
    job_requirement_info: z.array(
        z.object({
            requirement: z.string(),
            things_to_know: z.string(),
        })
    ),
    product_info: z.object({
        product_name: z.string(),
        product_info: z.array(
            z.object({
                info: z.string(),
            })
        ),
    }),
    team_specifics: z.array(
        z.object({
            team: z.string(),
            team_structure: z.string(),
            team_working_style: z.string(),
            team_goals: z.string(),
        })
    ),
    behavioral_questions: z.array(
        z.object({ 
            question: z.string(),
            question_source: z.string(),
            answer: z.string(),
            what_they_look_for: z.string(),
            what_to_study: z.string(),
        })
    ),
    technical_questions: z.array(
        z.object({
            question: z.string(),
            question_source: z.string(),
            answer: z.string(),
            what_they_look_for: z.string(),
            what_to_study: z.string(),
        })
    ),
    coding_questions: z.array(
        z.object({
            question: z.string(),
            question_source: z.string(),
            answer: z.string(),
            what_they_look_for: z.string(),
            what_to_study: z.string(),
        })
    ),
    additional_information: z.array( 
        z.object({
            information_title: z.string(),
            text: z.string(),
        })
    ),
});

export type InterviewPrepType = z.infer<typeof InterviewPrepSchema>;