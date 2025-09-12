import { formatOverallMatchSummary, formatSuccessMetric } from '../../../shared/utils/formatters/summary.formatter.js';

import { appendFileSync } from 'fs';
import { combineJSONData } from "../../../shared/utils/documents/json/json.helpers.js";
import fs from 'fs';
import { getOpenAIResponse } from "../../../shared/libs/open_ai/openai.js";
import { infoStore } from '../../../shared/data/info.store.js';
import { loadTemplate } from "../../../shared/utils/templates/template.loader.js";
import { matchSummaryResponse } from '../models/match_summary.models.js';
import { messageOpenAI } from "../../../shared/libs/open_ai/openai.js";
import paths from '../../../shared/constants/paths.js';
import { prompts } from '../../../shared/constants/prompts.js';
import { getJobPost } from '../../../database/queries/job.queries.js';

const isTesting = false;

interface OpenAIResponse {
  match_summary: any;
  company_name: string;
}

export const getMatchSummary = async (id: number): Promise<void> => {
    try {
        const jobPosting = await getJobPost(id);
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

        const resumeJson = await fs.promises.readFile(paths.paths.jsonResume(jobPosting.companyName, jobPosting.id));


        const instructions = await loadTemplate(
            'instructions',
            'matchsummary',
            {}
        );

        const prompt = await loadTemplate(
            'prompts',
            'matchsummary',
            {
                applicants: jobPosting.applicantCount,
                details: jobPosting.jobDetails,
                resume: JSON.stringify(resumeJson),
                jobPosting: jobPosting.body,
                company: jobPosting.rawCompanyName,
                position: jobPosting.position,
            }
        );
        
        console.log("Getting match summary...");

        const res = isTesting
            ? matchSummaryResponse
            : await getOpenAIResponse(instructions, prompt, matchSummaryResponse);

        if (!res) {
            throw new Error('No match summary response received from OpenAI.');
        }

        console.log("Generating match summary...");
        const { content: summaryContent, projects_section_missing_entries: hasMissingProjects} = generateMatchSummary(res);
        const summaryFilePath = paths.paths.matchSummary(jobPosting.companyName, jobPosting.id);

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
    const { should_apply, should_apply_reasoning, metrics, overall_match_summary, projects_section_missing_entries } = response.match_summary;
    const companyName = response.company_name;
    let content = '';
    console.log("Generating match summary content...");
    if (metrics) {
        content += `# Match Summary for ${companyName}\n\n`;
        content += `## Match Metrics:\n`;
        content += `### Should you apply: ${should_apply}\n`;
        content += `${should_apply_reasoning}\n\n`;
        content += metrics.map(formatSuccessMetric).join('\n');

        console.log("Processing overall match summary...");
        content += formatOverallMatchSummary(overall_match_summary);
    }

    return {content, projects_section_missing_entries};
};

// 