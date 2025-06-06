import fs from "fs";
import Handlebars from "handlebars";
import paths from "../../constants/paths.js";
import { messageOpenAI } from "../../apis/open_ai/openai_services.js";
import { ResumeSectionNotFoundError } from "../../errors/resume_builder_errors.js";

import { infoStore } from "../../data/info_store.js";
import { formatTitle } from "../../utils/formatters/text_formatter.js";

export const sectionToLatexEnvMap: Record<string, 'cvskills' | 'cventries' | 'cvletter'> = {
    projects: 'cventries',
    experiences: 'cventries',
    skills: 'cvskills',
    'cover letter': 'cvletter',
}

// Load the basic information of the user into resume.tex
export const loadUserInfoToLatex = async () => {
    const resumeTemplate = await fs.promises.readFile(
        paths.latex_files.resume_template,
        "utf8"
    );
    const resumeInfo = Handlebars.compile(resumeTemplate)(infoStore.user_info);
    await fs.promises.writeFile(paths.latex_files.resume, resumeInfo);

    const educationTemplate = await fs.promises.readFile(
        paths.latex_files.education_template,
        "utf8"
    );

    const educationInfo = Handlebars.compile(educationTemplate)(infoStore.education_info);
    await fs.promises.writeFile(paths.latex_files.education, educationInfo);
};

// // Load the content of a resume section from OpenAI and update the LaTeX file
// export const loadSections = async (
//     section: string,
//     prompt: string,
//     schema: any,
//     filePath: string
// ) => {
//     const latexEnv = sectionToLatexEnvMap[section];
//     if (!latexEnv) {
//         logger.error(`No LaTeX environment found for section: ${section}`);
//         throw new Error(`No LaTeX environment found for section: ${section}`);
//     }

//     const response = await messageOpenAI(prompt, schema);

//     // Validate the response using the provided Zod schema
//     const parsedResponse = schema.safeParse(response);
//     if (!parsedResponse.success) {
//         logger.error(
//             `Invalid response format for ${section}: ${JSON.stringify(
//                 parsedResponse.error.errors
//             )}`
//         );
//         throw new Error(`Invalid response format for ${section}`);
//     }

//     const jsonFilePath = paths.paths.section_json(section);
//     await fs.writeFile(jsonFilePath, JSON.stringify(parsedResponse.data, null, 2));
//     logger.info(`Saved ${section} data to ${jsonFilePath}`);

//     const newContent = parsedResponse.data[section].map(
//         formatLatexSection(section)
//     );

//     let latexContent;
//     try {
//         latexContent = await fs.readFile(filePath, "utf8");
//     } catch (error) {
//         logger.error(`Error reading from ${filePath}: ${error.message}`);
//         throw error;
//     }

//     try {
//         const updatedContent = replaceSectionContent(latexContent, newContent, latexEnv);
//         await fs.writeFile(filePath, updatedContent, "utf-8");
//         generateChangeReport(response);
//     } catch (error) {
//         if (error instanceof ResumeSectionNotFoundError) {
//             logger.error(
//                 `Error replacing ${section}: ${error.message}\n\tCheck LaTeX syntax in ${filePath}`
//             );
//         } else {
//             logger.error(`Error writing to ${filePath}: ${error.message}`);
//         }
//         throw error;
//     }
// };

// Replace the content of a LaTeX section with new content
export const replaceSectionContent = (
    texContent: string,
    newContent: string[],
    sectionType: 'cvskills' | 'cventries' | 'cvletter') => {
    const environments = [
        { name: "cvskills", start: "\\begin{cvskills}", end: "\\end{cvskills}" },
        { name: "cventries", start: "\\begin{cventries}", end: "\\end{cventries}" },
        { name: "cvletter", start: "\\begin{cvletter}", end: "\\end{cvletter}" },
    ];

    const env = environments.find(env => env.name === sectionType);
    if (!env) {
        throw new ResumeSectionNotFoundError(
            `Unknown LateX environment for section: ${sectionType}`,
            { captureStackTrace: true }
        );
    }

    const { start, end } = env;
    const startIndex = texContent.indexOf(start);
    const endIndex = texContent.indexOf(end);

    if (startIndex === -1 || endIndex === -1) {
        throw new ResumeSectionNotFoundError(
            `No ${sectionType} environment found in the file.`,
            { captureStackTrace: true }
        );
    }

    const newEnvContent = `${start}\n${newContent.join("\n")}\n${end}`;
    return (
        texContent.slice(0, startIndex) +
        newEnvContent +
        texContent.slice(endIndex + end.length)
    );
};

// Fill and format LaTeX content with new content received from OpenAI
export const formatLatexSection = (sectionType: string) => (sectionData: any) => {
    let cvItems;
    switch (sectionType) {
        case "experiences":
            cvItems = sectionData.description
                .map(
                    ({ text }: { text: string }) =>
                        `    \\item {${text.replace(/[%#&]/g, "\\$&")}}`
                )
                .join("\n");
            return `
        \\cventry
          {${sectionData.company}} % Organization
          {${sectionData.position}} % Job title
          {} % Location
          {${sectionData.start} - ${sectionData.end}} % Date(s)
          {
            \\begin{cvitems} % Description(s) of tasks/responsibilities
        ${cvItems}
            \\end{cvitems}
          }`;
        case "skills":
            const skillList = sectionData.skill
                .map(({ item }: { item: string }) =>
                    item.replace(
                        /[%#&]/g,
                        (match) =>
                            ({
                                "%": "\\%",
                                "#": "\\#",
                                "&": "\\&",
                            }[match] || match)
                    )
                ) // Escape special characters for LaTeX
                .join(", ");

            return `
          \\cvskill
            {${formatTitle(sectionData.category)}} % Category
            {${skillList}} % Skills
          `;
        case "projects":
            cvItems = sectionData.description
                .map(
                    ({ text }: { text: string }) =>
                        `    \\item {${text
                            .replace(/%/g, "\\%")
                            .replace(/#/g, "\\#")}}` // Escape '%' for LaTeX
                )
                .join("\n");

            return `
          \\cventry
            {${sectionData.role}} % Role
            {${sectionData.name}} % Event
            {} % Location
            {${sectionData.status}} % Date(s)
            {
              \\begin{cvitems} % Description(s)
          ${cvItems}
              \\end{cvitems}
            }`;
        case "cover_letter":
                let about = sectionData.about
                    .replace(/%/g, '\\%')
                    .replace(/#/g, '\\#')
                    .replace(/&/g, '\\&');
                let experience = sectionData.experience
                    .replace(/%/g, '\\%')
                    .replace(/#/g, '\\#')
                    .replace(/&/g, '\\&');
                let whatIBring = sectionData.whatIBring
                    .replace(/%/g, '\\%')
                    .replace(/#/g, '\\#')
                    .replace(/&/g, '\\&');

                return `
                
                \\lettersection{About}
                ${about}
                
                \\lettersection{Experience}
                ${experience}
                
                \\lettersection{What I Bring}
                ${whatIBring}
                
                `;
        default:
            throw new Error(`Invalid section type: ${sectionType}`);
    }
};