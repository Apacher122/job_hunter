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
    const formattedMetrics = metrics
        .map(({ scoreTitle, score, scoreJustification, isCompatible, probabilityOfSuccess, probabilityOfSuccessEquation, probabilityOfSuccessJustification }) => `
            ## Title: ${scoreTitle}
            ### Score: ${score}
            * Justification: ${scoreJustification}
            * Compatible: ${isCompatible ? 'Yes' : 'No'}
            * Probability of Success: ${probabilityOfSuccess}
            * Probability of Success Equation: ${probabilityOfSuccessEquation || 'N/A'}
            * Probability of Success Justification: ${probabilityOfSuccessJustification || 'N/A'}
        `)
        .join('\n');

    const formattedSummary = `
            # Overall Summary: ${overall_match_summary.summary.join('\n')}
            # Suggestions: ${overall_match_summary.suggestions.join('\n')}
        `;

    content += `# Company: ${companyName}\n\n# Match Metrics:\n${formattedMetrics}\n${formattedSummary}`;
    return content;
};

// 