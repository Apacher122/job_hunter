import { formatOverallMatchSummary, formatSuccessMetric } from '../../../shared/utils/formatters/summary.formatter.js';

import { appendFileSync } from 'fs';
import { combineJSONData } from "../../../shared/utils/documents/json/json.helpers.js";
import fs from 'fs';
import { infoStore } from '../../../shared/data/info.store.js';
import { matchSummaryResponse } from '../models/match_summary.models.js';
import { messageOpenAI } from "../../../shared/libs/open_ai/openai.js";
import paths from '../../../shared/constants/paths.js';
import { prompts } from '../../../shared/constants/prompts.js';

interface OpenAIResponse {
  match_summary: any;
  company_name: string;
}

export const getMatchSummary = async (): Promise<void> => {
    try {
        const jobPosting = infoStore.jobPosting;
        const education = {
            school: infoStore.education_info.school,
            degree: infoStore.education_info.degree,
            start_end: infoStore.education_info.start_end,
            location: infoStore.education_info.location,
            coursework: infoStore.education_info.coursework
        }

        fs.writeFileSync(
            paths.paths.sectionJson('education'),
            JSON.stringify(education, null, 2)
        );

        const resumeJson = await combineJSONData([
            'education',
            'experiences',
            'skills',
            'projects'
        ]);
        
        console.log("Getting match summary...");
        const openAIPrompt = prompts.match_summary(resumeJson, jobPosting.body);

        const openAIResponse = await messageOpenAI(openAIPrompt, matchSummaryResponse);
        console.log("Generating match summary...");
        const { content: summaryContent, projects_section_missing_entries: hasMissingProjects} = generateMatchSummary(openAIResponse);
        const summaryFilePath = paths.paths.matchSummary(jobPosting.companyName);

        if (fs.existsSync(summaryFilePath)) {
            fs.truncateSync(summaryFilePath, 0);
        }

        appendFileSync(summaryFilePath, summaryContent);

    } catch (error) {
        const e = error as Error;
        console.error(`Error retrieving match summary: ${e.message}`);
        throw error;
    }
};

export const generateMatchSummary = (
    response: OpenAIResponse
): {content: string, projects_section_missing_entries: boolean} => {
    const { metrics, overall_match_summary, projects_section_missing_entries } = response.match_summary;
    const companyName = response.company_name;
    let content = '';
    console.log("Generating match summary content...");
    if (metrics) {
        content += `# Match Summary for ${companyName}\n\n`;
        content += `## Match Metrics:\n`;
        content += metrics.map(formatSuccessMetric).join('\n');

        console.log("Processing overall match summary...");
        content += formatOverallMatchSummary(overall_match_summary);
    }

    return {content, projects_section_missing_entries};
};

// 