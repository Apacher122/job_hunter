import { CompanyInfoSchema } from '../models/company_info.models.js';
import { companyInfoFormatter } from '../../../shared/utils/formatters/company_info.formatter.js';
import fs from 'fs';
import { getOpenAIResponse } from "../../../shared/libs/open_ai/openai"
import { loadTemplate } from '../../../shared/utils/templates/template.loader.js';
import paths from '../../../shared/constants/paths';
import { upsertCompanyInfo } from '../../../database/queries/company.queries';
import { getJobPost } from '../../../database/queries/job.queries.js';
import { CompanyInfoMock } from '../models/mocks/company_info.mocks.js';

export const getCompanyInfo = async (id: number): Promise<any> => {
    const jobPost = await getJobPost(id);
    
    if (!jobPost || !jobPost.companyName) {
        console.error('Job posting content or company name is not available in infoStore.');
        return;
    }
    const resumeData = await fs.promises.readFile(paths.paths.jsonResume(jobPost.companyName, jobPost.id));
    const instructions = await loadTemplate(
        'instructions',
        'companyinfo',
        {
            company: jobPost.companyName,
            position: jobPost.position,
        }
    );

    const prompt = await loadTemplate(
        'prompts',
        'companyinfo',
        {
            resume: resumeData,
            jobPosting: jobPost.body,
            company: jobPost.rawCompanyName,
            position: jobPost.position,
        }
    );

    const response = 
        process.env.NODE_ENV === 'testing'
        ? CompanyInfoMock
        : await getOpenAIResponse(instructions, prompt, CompanyInfoSchema);

    const parsedResponse = CompanyInfoSchema.safeParse(response);
    if (!parsedResponse.success) {
        throw new Error("Invalid response format from OpenAI");
    }

    const info = parsedResponse.data;
    const formattedContent = companyInfoFormatter(info);
    const filePath = paths.paths.companyInfo(jobPost.companyName, jobPost.id);
    await fs.promises.writeFile(filePath, formattedContent, 'utf-8');

    await upsertCompanyInfo(
        jobPost.id,
        response
    );
}