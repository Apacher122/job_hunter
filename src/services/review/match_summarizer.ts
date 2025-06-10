import fs, { appendFileSync} from "fs";
import paths from "../../shared/constants/paths";
import { prompts } from "../../shared/constants/prompts";
import { matchSummaryResponse } from "../../models/response_models/reviews/match_summary_model";
import { infoStore } from "../../shared/data/info_store";
import { messageOpenAI } from "../../shared/apis/open_ai/openai_services";
import { formatSuccessMetric, formatOverallMatchSummary } from "../../shared/utils/formatters/summary_formatter.js";
import { convertPDFToBase64 } from "../../shared/utils/files/file_helpers.js";
import { format } from "path";

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
        
        // Encode the resume PDF in Base64
        console.log("Encoding resume PDF for OpenAI...");
        const pdfContentBase64 = await convertPDFToBase64(paths.paths.moved_resume(jobPosting.companyName));
        
        // Create a prompt for OpenAI with the encoded resume and job posting content
        console.log("Getting match summary...");
        const openAIPrompt = prompts.match_summary(pdfContentBase64, jobPosting.body);

        // Send the prompt to OpenAI and get the response
        const openAIResponse = await messageOpenAI(openAIPrompt, matchSummaryResponse);
        console.log(openAIResponse);
        // Generate a formatted match summary from the OpenAI response
        console.log("Generating match summary...");
        const { content: summaryContent, projects_section_missing_entries: hasMissingProjects} = generateMatchSummary(openAIResponse);

        console.log(hasMissingProjects)
        
        // Define the path for the match summary file
        const summaryFilePath = paths.paths.match_summary_path(jobPosting.companyName);

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