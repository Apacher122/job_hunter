import { matchSummaryResponse } from "../../models/match_summary_model.js";
import { messageOpenAI } from "../../services/openai_services.js";
import { prompts } from "../../prompts/prompts.js";
import { preparePDFForOpenAI } from "../helpers/pdf_encoder.js";
import { getJobPostingContent } from "../helpers/info_helper.js";
import { appendFileSync } from "fs";
import paths from "../../config/paths.js";
import fs from "fs";

/**
 * Function to retrieve and save the match summary from OpenAI.
 * It processes the resume PDF, sends it to OpenAI along with the job posting,
 * and saves the generated match summary to a file.
 */
export const getMatchSummary = async () => {
    try {
        // Retrieve job posting content and company name
        const { jobPostingContent, companyName } = await getJobPostingContent();
        
        // Encode the resume PDF in Base64
        const pdfContentBase64 = await preparePDFForOpenAI(paths.paths.moved_resume(companyName));
        
        // Create a prompt for OpenAI with the encoded resume and job posting content
        const openAIPrompt = prompts.match_summary(pdfContentBase64, jobPostingContent);

        // Send the prompt to OpenAI and get the response
        const openAIResponse = await messageOpenAI(openAIPrompt, matchSummaryResponse);
        
        // Generate a formatted match summary from the OpenAI response
        const summaryContent = generateMatchSummary(openAIResponse);
        
        // Define the path for the match summary file
        const summaryFilePath = paths.paths.match_summary_path(companyName);

        // Clear the file if it exists, to ensure fresh content
        if (fs.existsSync(summaryFilePath)) {
            fs.truncateSync(summaryFilePath, 0);
        }

        // Append the generated summary content to the file
        appendFileSync(summaryFilePath, summaryContent);

    } catch (error) {
        // Log and rethrow any errors encountered
        console.error(`Error retrieving match summary: ${error.message}`);
        throw error;
    }
};

/**
 * Generates a formatted match summary from the OpenAI response.
 *
 * @param {Object} response The response from OpenAI
 * @returns {String} The formatted match summary
 */
export const generateMatchSummary = ({ match_summary: { metrics, overall_match_summary }, company_name: companyName }) => {
    let content = '';
    if (metrics) {
        content += `# Match Summary for ${companyName}\n\n`;
        content += `## Match Metrics:\n`;
        metrics.forEach(metric => {
            content += `### ${metric.scoreTitle}\n`;
            content += `- Score: ${metric.score}\n`;
            content += `- Justification: ${metric.scoreJustification}\n`;
            content += `- Compatible: ${metric.isCompatible ? 'Yes' : 'No'}\n`;
            content += `- Probability of Success: ${metric.probabilityOfSuccess}\n`;
            content += `- Probability of Success Equation: ${metric.probabilityOfSuccessEquation || 'N/A'}\n`;
            content += `- Probability of Success Justification: ${metric.probabilityOfSuccessJustification || 'N/A'}\n\n`;
        });

        content += `## Overall Match Summary:\n`;
        content += `- Summary:\n\t- ${overall_match_summary.summary.join('\n\t- ')}\n`;
        content += `- Suggestions:\n\t- ${overall_match_summary.suggestions.join('\n\t- ')}\n`;
    }

    return content;
};
 
