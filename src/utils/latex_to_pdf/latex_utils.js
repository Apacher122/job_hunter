import fs from "fs/promises";
import Handlebars from "handlebars";
import config from "../../config/user_info.js";
import paths from "../../config/paths.js";
import { messageOpenAI } from "../../services/openai_services.js";
import { ResumeSectionNotFoundError } from "../../errors/resume_builder_errors.js";
import { logger, generateChangeReport } from "../index.js";
import { formatLatexSection } from "../helpers/formatter.js";

// Load the basic information of the user into resume.tex
export const loadBasicInfo = async () => {
    const resumeTemplate = await fs.readFile(
        paths.latex_files.resume_template,
        "utf8"
    );
    const resumeInfo = Handlebars.compile(resumeTemplate)(config.user_info);
    await fs.writeFile(paths.latex_files.resume, resumeInfo);

    const educationTemplate = await fs.readFile(
        paths.latex_files.education_template,
        "utf8"
    );

    const educationInfo = Handlebars.compile(educationTemplate)(config.education_info);
    await fs.writeFile(paths.latex_files.education, educationInfo);
};

// Load the content of a resume section from OpenAI and update the LaTeX file
export const loadSections = async (section, prompt, schema, filePath) => {
    const response = await messageOpenAI(prompt, schema);

    // Validate the response using the provided Zod schema
    const parsedResponse = schema.safeParse(response);
    if (!parsedResponse.success) {
        logger.error(
            `Invalid response format for ${sectionType}: ${JSON.stringify(
                parsedResponse.error.errors
            )}`
        );
        throw new Error(`Invalid response format for ${sectionType}`);
    }

    const newContent = parsedResponse.data[section].map(
        formatLatexSection(section)
    );

    let latexContent;
    try {
        latexContent = await fs.readFile(filePath, "utf8");
    } catch (error) {
        logger.error(`Error reading from ${filePath}: ${error.message}`);
        throw error;
    }

    try {
        const updatedContent = replaceSectionContent(latexContent, newContent);
        await fs.writeFile(filePath, updatedContent, "utf-8");
        generateChangeReport(response);
    } catch (error) {
        if (error instanceof ResumeSectionNotFoundError) {
            logger.error(
                `Error replacing ${section}: ${error.message}\n\tCheck LaTeX syntax in ${filePath}`
            );
        } else {
            logger.error(`Error writing to ${filePath}: ${error.message}`);
        }
        throw error;
    }
};

// Replace the content of a LaTeX section with new content
const replaceSectionContent = (texContent, newContent) => {
    const environments = [
        {
            name: "cvskills",
            start: "\\begin{cvskills}",
            end: "\\end{cvskills}",
        },
        {
            name: "cventries",
            start: "\\begin{cventries}",
            end: "\\end{cventries}",
        },
    ];

    for (const { name, start, end } of environments) {
        const startIndex = texContent.indexOf(start);
        const endIndex = texContent.indexOf(end);

        if (startIndex !== -1 || endIndex !== -1) {
            const newEnvContent = `${start}\n${newContent.join("\n")}\n${end}`;
            return (
                texContent.slice(0, startIndex) +
                newEnvContent +
                texContent.slice(endIndex + end.length)
            );
        }
    }

    throw new ResumeSectionNotFoundError(
        `No ${sectionType} environment found in the file.`,
        { captureStackTrace: true }
    );
};