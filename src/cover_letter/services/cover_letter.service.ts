import { Instructions, UserPrompts, prompts } from '../../shared/constants/prompts.js';
import { ResumeSectionNotFoundError, ZodFormatError } from '../../shared/errors/resume_builder.errors.js';
import { countTokens, getOpenAIResponse, messageOpenAI } from "../../shared/libs/open_ai/openai.js";
import { formatLatexSection, formatPlaintextSection, sectionFormatters } from '../../shared/utils/formatters/resume.formatter.js'
import { replaceSectionContent, sectionToLatexEnvMap } from '../../shared/utils/documents/latex/latex.helpers.js';

import { CoverLetterSchema } from '../models/cover_letter.models.js';
import Handlebars from 'handlebars';
import { ZodType } from 'zod';
import { combineJSONData } from '../../shared/utils/documents/json/json.helpers.js';
import { exportLatex } from '../../documents/services/export.service.js';
import fs from 'fs';
import { getWritingExamples } from "../../shared/utils/formatters/string.formatter.js";
import { infoStore } from '../../shared/data/info.store.js';
import { logger } from '../../shared/utils/logger.js';
import paths from '../../shared/constants/paths.js';

export const compileCoverLetter = async (): Promise<void> => {

    // Export to PDF
    try {
        await generateCoverLetterDraft();
        let jobContent = infoStore.jobPosting;
        await exportLatex({
        jobNameSuffix: 'cover_letter',
        latexFilePath: paths.latex.coverLetter.letter,
        targetDirectory: paths.paths.dir,
        compiledPdfPath: paths.paths.compiledCoverLetter(jobContent.companyName),
        movedPdfPath: paths.paths.movedCoverLetter(jobContent.companyName)
        });

        console.log('Cover letter exported successfully.');
    } catch (err) {
    console.error(`Error exporting cover letter to PDF: ${(err as Error).message}\n${(err as Error).stack}`);
    return;
    }
}

const generateCoverLetterDraft = async (): Promise<void> => {
    try {
        const sections = ['experiences', 'skills', 'projects'];
        const resumeData = await combineJSONData(sections);
        const aboutMe = await fs.promises.readFile(paths.paths.aboutMe, 'utf-8');
        const writingExamples = await getWritingExamples();
        const instructions = Instructions.CoverLetter();

        const prompt = UserPrompts.CoverLetter(
            resumeData,
            infoStore.jobPosting,
            aboutMe,
            infoStore.jobPosting.rawCompanyName,
            infoStore.jobPosting.position,
            writingExamples
        );

        // Create top-most info
        const coverLetterTemplate = await fs.promises.readFile(
            paths.latex.coverLetter.template,
            "utf8"
        );

        const extraData = {
            company: infoStore.jobPosting.rawCompanyName,
            position: infoStore.jobPosting.position,
            
        }

        const coverLetterInfo = Handlebars.compile(coverLetterTemplate)({
            ...infoStore.user_info,
            ...extraData
        });
        await fs.promises.writeFile(paths.latex.coverLetter.letter, coverLetterInfo);

        await loadCoverLetterContent(instructions, prompt, CoverLetterSchema);
    } catch (err) {
        logger.error(`Error generating cover letter content: ${(err as Error).message}\n${(err as Error).stack}`);
        throw err;
    }
};

const loadCoverLetterContent = async <T>(
    instructions: string,
    prompt: string,
    schema: ZodType<T>
): Promise<void>  => {
    // Load the cover letter content from OpenAI
    try {
        const res = await getOpenAIResponse(instructions, prompt, schema);

        // Validate the response using the provided Zod schema
        const parsedResponse = schema.safeParse(res);
        if (!parsedResponse.success) {
            throw new ZodFormatError(
                `Invalid cover letter format: ${parsedResponse.error.message}`,
                parsedResponse.error.issues
            );
        }

        const newContent = formatLatexSection('cover_letter')(parsedResponse.data);
        let originalContent  = await fs.promises.readFile(paths.latex.coverLetter.letter, "utf8");

        const updatedContent = replaceSectionContent(originalContent, [newContent], "cvletter");
        await fs.promises.writeFile(paths.latex.coverLetter.letter, updatedContent, "utf-8");
    } catch (err) {
        if ( err instanceof ResumeSectionNotFoundError) {
            logger.error(`Cover letter section not found: ${err.message}`);
        } else {
            logger.error(`Error loading cover letter content: ${(err as Error).message}\n${(err as Error).stack}`);
        }
        throw err;
    }

}