import { CompanyInfoSchema } from '../models/company_info.models.js';
import { companyInfoFormatter } from '../../../shared/utils/formatters/company_info.formatter.js';
import fs from 'fs';
import { getOpenAIResponse } from "../../../shared/libs/open_ai/openai"
import { infoStore } from '../../../shared/data/info.store.js';
import { loadTemplate } from '../../../shared/utils/templates/template.loader.js';
import paths from '../../../shared/constants/paths';
import { upsertCompanyInfo } from '../../../database/queries/company.queries';

export const getCompanyInfo = async (): Promise<any> => {
    if (!infoStore.jobPosting || !infoStore.jobPosting.companyName) {
        console.error('Job posting content or company name is not available in infoStore.');
        return;
    }
    
    const resumeData = fs.readFileSync(paths.paths.plaintextResume('resume'), 'utf-8');
    const instructions = await loadTemplate(
        'instructions',
        'companyinfo',
        {
            company: infoStore.jobPosting.companyName,
            position: infoStore.jobPosting.position,
        }
    );

    const prompt = await loadTemplate(
        'prompts',
        'companyinfo',
        {
            resume: resumeData,
            jobPosting: infoStore.jobPosting.body,
            company: infoStore.jobPosting.rawCompanyName,
            position: infoStore.jobPosting.position,
        }
    );

    const response = await getOpenAIResponse(
        instructions,
        prompt,
        CompanyInfoSchema
    );
    const parsedResponse = CompanyInfoSchema.safeParse(response);
    if (!parsedResponse.success) {
        throw new Error("Invalid response format from OpenAI");
    }

    const info = parsedResponse.data;
    const formattedContent = companyInfoFormatter(info);
    const filePath = paths.paths.companyInfo(infoStore.jobPosting.companyName);
    await fs.promises.writeFile(filePath, formattedContent, 'utf-8');

    await upsertCompanyInfo(
        infoStore.jobPosting.id,
        response
    );
}