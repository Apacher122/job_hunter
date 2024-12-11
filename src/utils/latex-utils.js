import fs from "fs/promises";
import Handlebars from "handlebars";
import config from "../config/config.js";
import { messageOpenAI } from "../services/openai-services.js";
import { ResumeSectionNotFoundError } from "../errors/resume-builder-errors.js";
import { logger, generateChangeReport } from "./index.js";
import { formatLatexSection } from "../helpers/formatter.js";

// Load the basic information of the user into resume.tex
export const loadBasicInfo = async () => {
    const resumeTemplate = await fs.readFile(
        config.latex_files.resume_template,
        "utf8"
    );
    const resumeInfo = Handlebars.compile(resumeTemplate)(config.user_info);
    await fs.writeFile(config.latex_files.resume, resumeInfo);
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

// Format new LaTeX content from the zod object returned by openai
// const formatSectionText = (sectionType) => (sectionData) => {
//     let cvItems;
//     switch (sectionType) {
//         case "experiences":
//             cvItems = sectionData.description
//                 .map(
//                     ({ text }) =>
//                         `    \\item {${text.replace(/[%#&]/g, "\\$&")}}`
//                 )
//                 .join("\n");
//             return `
//         \\cventry
//           {${sectionData.company}} % Organization
//           {${sectionData.position}} % Job title
//           {} % Location
//           {${sectionData.start} - ${sectionData.end}} % Date(s)
//           {
//             \\begin{cvitems} % Description(s) of tasks/responsibilities
//         ${cvItems}
//             \\end{cvitems}
//           }`;
//         case "skills":
//             const skillList = sectionData.skill
//                 .map(({ item }) =>
//                     item.replace(
//                         /[%#&]/g,
//                         (match) =>
//                             ({
//                                 "%": "\\%",
//                                 "#": "\\#",
//                                 "&": "\\&",
//                             }[match])
//                     )
//                 ) // Escape special characters for LaTeX
//                 .join(", ");

//             return `
//           \\cvskill
//             {${titleFormat(sectionData.category)}} % Category
//             {${skillList}} % Skills
//           `;
//         case "projects":
//             cvItems = sectionData.description
//                 .map(
//                     ({ text }) =>
//                         `    \\item {${text
//                             .replace(/%/g, "\\%")
//                             .replace(/#/g, "\\#")}}` // Escape '%' for LaTeX
//                 )
//                 .join("\n");

//             return `
//           \\cventry
//             {${sectionData.role}} % Role
//             {${sectionData.name}} % Event
//             {} % Location
//             {${sectionData.status}} % Date(s)
//             {
//               \\begin{cvitems} % Description(s)
//           ${cvItems}
//               \\end{cvitems}
//             }`;
//         default:
//             throw new Error(`Invalid section type: ${sectionType}`);
//     }
// };

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