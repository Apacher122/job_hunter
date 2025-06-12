import { countTokens, messageOpenAI } from "../../shared/libs/open_ai/openai.js";
import { formatLatexSection, formatPlaintextSection, sectionFormatters } from '../../shared/utils/formatters/resume.formatter.js'
import { replaceSectionContent, sectionToLatexEnvMap } from '../../shared/utils/documents/latex/latex.helpers.js';

import { CoverLetterSchema } from '../models/cover_letter.models.js';
import { ResumeSectionNotFoundError } from '../../shared/errors/resume_builder.errors.js';
import { ZodType } from 'zod';
import { cleanup } from '../../shared/utils/documents/file.helpers.js';
import { combineJSONData } from '../../shared/utils/documents/json/json.helpers.js';
import { exportLatex } from '../../shared/services/export.service.js';
import fs from 'fs';
import { getWritingExamples } from "../../shared/utils/formatters/string.formatter.js";
import { infoStore } from '../../shared/data/info.store.js';
import { logger } from '../../shared/utils/logger.js';
import paths from '../../shared/constants/paths.js';
import { prompts } from '../../shared/constants/prompts.js';

export const compileCoverLetter = async (): Promise<void> => {
    if (!infoStore.jobPosting || !infoStore.jobPosting.companyName) {
        console.error('Job posting content or company name is not available in infoStore.');
        return;
    }

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
    } catch (error) {
    const e = error as Error;
    console.error(`Error exporting cover letter to PDF: ${ e.message} See logs for more information`);
    return;
    }
}

const generateCoverLetterDraft = async () => {
    try {
    const jobPostingContent = infoStore.jobPosting;
    const sections = ['experiences', 'skills', 'projects'];
    const resumeData = await combineJSONData(sections);
    const aboutMe = await fs.promises.readFile(paths.paths.aboutMe, 'utf-8');

    const writingExamples = await getWritingExamples();
    if (!writingExamples) {
        throw new Error('Writing examples not found.');
    }

    const prompt = prompts.cover_letter(
        resumeData,
        jobPostingContent,
        aboutMe,
        jobPostingContent.rawCompanyName,
        jobPostingContent.position,
        writingExamples
    )

    // Create topmost info
    const coverLetterTemplate = await fs.promises.readFile(
        paths.latex.coverLetter.template,
        "utf8"
    );

    const extraData = {
        company: jobPostingContent.rawCompanyName,
        position: jobPostingContent.position,
        
    }

    const coverLetterInfo = Handlebars.compile(coverLetterTemplate)({
        ...infoStore.user_info,
        ...extraData
    });
    await fs.promises.writeFile(paths.latex.coverLetter.letter, coverLetterInfo);

    await loadCoverLetterContent(prompt, CoverLetterSchema);
    logger.info("Cover letter generated successfully");
    } catch (error) {
        const e = error as Error;
        logger.error(`Error generating cover letter content: ${e.message}`);
        throw error;
    }
};

const loadCoverLetterContent = async <T>(
    prompt: string, 
    schema: ZodType<T>
): Promise<void>  => {
    // Load the cover letter content from OpenAI
    const response = await messageOpenAI(prompt, schema);

    // Validate the response using the provided Zod schema
    const parsedResponse = schema.safeParse(response);
    if (!parsedResponse.success) {
        logger.error(
            `Invalid response format for cover letter: ${JSON.stringify(
                parsedResponse.error.errors
            )}`
        );
        throw new Error("Invalid response format for cover letter");
    }

    const newContent = formatLatexSection('cover_letter')(parsedResponse.data);

    let latexContent;
    try {
        latexContent = await fs.promises.readFile(paths.latex.coverLetter.letter, "utf8");
    } catch (error) {
        const e = error as Error;
        logger.error(`Error reading from cover letter file: ${ e.message}`);
        throw error;
    }

    try {
        const sectionMap = {
            cover_letter: 'cvletter',
        };
        const updatedContent = replaceSectionContent(latexContent, [newContent], "cvletter");
        await fs.promises.writeFile(paths.latex.coverLetter.letter, updatedContent, "utf-8");
    } catch (error) {
        if (error instanceof ResumeSectionNotFoundError) {
            logger.error(
                `Error replacing cover letter content: ${error.message}\n\tCheck LaTeX syntax in ${paths.latex.coverLetter.letter}`
            );
        } else {
            const e = error as Error;
            logger.error(`Error writing to cover letter file: ${e.message}`);
        }
        throw error;
    }
}