import { countTokens, messageOpenAI } from "../../shared/libs/open_ai/openai.js";
import { formatOverallMatchSummary, formatSuccessMetric } from '../../shared/utils/formatters/summary.formatter.js';

import { appendFileSync } from 'fs';
import { combineJSONData } from "../../shared/utils/documents/json/json.helpers.js";
import { convertPDFToBase64 } from "../../shared/utils/documents/pdf/pdf.helpers.js";
import { extractTextFromFile } from "../../shared/utils/documents/file.helpers.js";
import fs from 'fs';
import { infoStore } from '../../shared/data/info.store.js';
import { matchSummaryResponse } from '../models/match_summary.models.js';
import paths from '../../shared/constants/paths.js';
import { prompts } from '../../shared/constants/prompts.js';

interface OpenAIResponse {
  match_summary: any;
  company_name: string;
}

/**
 * Function to retrieve and save the match summary from OpenAI.
 * It processes the resume PDF, sends it to OpenAI along with the job posting,
 * and saves the generated match summary to a file.
 */
export const getMatchSummary = async (): Promise<void> => {
    try {
        const jobPosting = infoStore.jobPosting;
        
        // Get latest resume as a JSON
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
        
        // Create a prompt for OpenAI with the encoded resume and job posting content
        console.log("Getting match summary...");
        const openAIPrompt = prompts.match_summary(resumeJson, jobPosting.body);

        // Send the prompt to OpenAI and get the response
        const openAIResponse = await messageOpenAI(openAIPrompt, matchSummaryResponse);
        console.log(openAIResponse);
        // Generate a formatted match summary from the OpenAI response
        console.log("Generating match summary...");
        const { content: summaryContent, projects_section_missing_entries: hasMissingProjects} = generateMatchSummary(openAIResponse);

        console.log(hasMissingProjects)
        
        // Define the path for the match summary file
        const summaryFilePath = paths.paths.matchSummary(jobPosting.companyName);

        // Clear the file if it exists, to ensure fresh content
        if (fs.existsSync(summaryFilePath)) {
            fs.truncateSync(summaryFilePath, 0);
        }

        // Append the generated summary content to the file
        appendFileSync(summaryFilePath, summaryContent);

    } catch (error) {
        // Log and rethrow any errors encountered
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