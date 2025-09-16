import { CompanyInfoType } from "../../../features/job_guide/models/company_info.models";
import { InterviewQuestion } from "../../../shared/types/interview-prep.types";
import { AdditionalInfo } from "../../../shared/types/company-info.types";
import prisma from "../../prisma_client"; 

export async function upsertCompanyInfo(
    jobPostId: number,
    companyInfo: CompanyInfoType
): Promise<any> {
    const jobInfo = companyInfo.job_info;

    try {
        await prisma.job_info.upsert({
            where: { job_posting_id: jobPostId },
            update: {
                company_description: companyInfo.company_description,
                company_website: companyInfo.company_website,
                company_industry: companyInfo.company_industry,
                company_size: companyInfo.company_size,
                company_location: companyInfo.company_location,
                company_culture: companyInfo.company_culture,
                company_values: companyInfo.company_values,
                company_benefits: companyInfo.company_benefits,
                position_review: jobInfo.position_review,
                typical_salary_ask: jobInfo.typical_salary_ask,
                typical_salary_ask_reason: jobInfo.typical_salary_ask_reason,
                advised_salary_ask: jobInfo.advised_salary_ask,
                advised_salary_ask_reason: jobInfo.advised_salary_ask_reason,
                application_process: jobInfo.application_process,
                expected_response_time: jobInfo.expected_response_time,
            },
            create: {
                job_posting_id: jobPostId,
                company_description: companyInfo.company_description,
                company_website: companyInfo.company_website,
                company_industry: companyInfo.company_industry,
                company_size: companyInfo.company_size,
                company_location: companyInfo.company_location,
                company_culture: companyInfo.company_culture,
                company_values: companyInfo.company_values,
                company_benefits: companyInfo.company_benefits,
                position_review: jobInfo.position_review,
                typical_salary_ask: jobInfo.typical_salary_ask,
                typical_salary_ask_reason: jobInfo.typical_salary_ask_reason,
                advised_salary_ask: jobInfo.advised_salary_ask,
                advised_salary_ask_reason: jobInfo.advised_salary_ask_reason,
                application_process: jobInfo.application_process,
                expected_response_time: jobInfo.expected_response_time,
            },
        });

        await prisma.possible_interview_questions.deleteMany({
            where: { job_posting_id: jobPostId },
        });

        const allQuestions = [
            ...jobInfo.behavioral_questions.map((q: InterviewQuestion) => ({ ...q, type: 'behavioral' })),
            ...jobInfo.technical_questions.map((q: InterviewQuestion) => ({ ...q, type: 'technical' })),
            ...jobInfo.coding_questions.map((q: InterviewQuestion) => ({ ...q, type: 'coding' })),
        ];

        await prisma.possible_interview_questions.createMany({
            data: allQuestions.map(q => ({
                jobPostId,
                is_behavioral_or_technical: q.type,
                question: q.question,
                question_source: q.question_source,
                answer: q.answer,
                what_they_look_for: q.what_they_look_for,
                what_to_study: q.what_to_study,
            })),
        });

        await prisma.additional_information.deleteMany({
            where: { job_posting_id: jobPostId },
        });

        await prisma.additional_information.createMany({
            data: jobInfo.additional_information.map((info: AdditionalInfo) => ({
            jobPostId,
            information_title: info.information_title,
            text: info.text,
        })),
    });

    return { success: true };
    } catch (err) {
        return false;
    }

    return true;
}