import { Instructions, UserPrompts, prompts } from '../../shared/constants/prompts.js';
import { companyInfoStore, updateCompanyInfoStore } from '../../shared/data/open_ai.store';
import { getOpenAIResponse, messageOpenAI } from "../../shared/libs/open_ai/openai"

import { InterviewPrepSchema } from '../models/interview_prep.models.js';
import { combineJSONData } from '../../shared/utils/documents/json/json.helpers.js';
import fs from 'fs';
import { infoStore } from '../../shared/data/info.store.js';
import { interviewPrepFormatter } from '../../shared/utils/formatters/interview_prep.formatter.js';
import paths from '../../shared/constants/paths';
import { sendFileBuffer } from '../../shared/utils/documents/file.helpers';
import { upsertCompanyInfo } from '../../database/queries/company.queries';

export const getInterviewPrep = async (): Promise<any> => {
    if (!infoStore.jobPosting || !infoStore.jobPosting.companyName) {
        console.error('Job posting content or company name is not available in infoStore.');
        return;
    }
    
    const resumeData = combineJSONData(['experiences', 'skills', 'projects']);

    const instructions = Instructions.InterviewQuestions(
        infoStore.jobPosting.companyName,
        infoStore.jobPosting.position,
    );

    const prompt = UserPrompts.InterviewQuestions(
        resumeData,
        infoStore.jobPosting.body,
        infoStore.jobPosting.rawCompanyName,
        infoStore.jobPosting.position
    );

    // const response = await messageOpenAI(prompt, CompanyInfoSchema);
    const response = await getOpenAIResponse(
        instructions,
        prompt,
        InterviewPrepSchema
    );
    const parsedResponse = InterviewPrepSchema.safeParse(response);
    if (!parsedResponse.success) {
        throw new Error("Invalid response format from OpenAI");
    }

    const info = parsedResponse.data;
    const formattedContent = interviewPrepFormatter(info);
    const filePath = paths.paths.interviewPrep(infoStore.jobPosting.companyName);
    await fs.promises.writeFile(filePath, formattedContent, 'utf-8');

    // Add to db
    // await upsertCompanyInfo(
    //     infoStore.jobPosting.id,
    //     response
    // );
}