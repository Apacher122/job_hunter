import Handlebars from "handlebars";
import { ResumeSectionNotFoundError } from "../../../errors/resume_builder.errors.js";
import { formatTitle } from "../../formatters/string.formatter";
import fs from "fs";
import { infoStore } from "../../../data/info.store.js";
import paths from "../../../constants/paths.js";
import { text } from "express";

export const sectionToLatexEnvMap: Record<string, 'cvskills' | 'cventries' | 'cvletter'> = {
    projects: 'cventries',
    experiences: 'cventries',
    skills: 'cvskills',
    'cover letter': 'cvletter',
}

// Load the basic information of the user into resume.tex
export const loadUserInfoToLatex = async () => {
    const resumeTemplate = await fs.promises.readFile(
        paths.latex.resume.resumeTemplate,
        "utf8"
    );
    const resumeInfo = Handlebars.compile(resumeTemplate)(infoStore.user_info);
    await fs.promises.writeFile(paths.latex.resume.resume, resumeInfo);

    const educationTemplate = await fs.promises.readFile(
        paths.latex.resume.educationTemplate,
        "utf8"
    );

    const educationInfo = Handlebars.compile(educationTemplate)(infoStore.education_info);
    await fs.promises.writeFile(paths.latex.resume.education, educationInfo);
};

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
                    .replace(/[\u00A0\u2000-\u200D\u202F\u205F\u3000]/g, ' ')
                    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
                    .replace(/[\u2013\u2014\u2015]/g, "-")
                    .replace(/%/g, '\\%')
                    .replace(/#/g, '\\#')
                    .replace(/&/g, '\\&');
                let experience = sectionData.experience
                    .replace(/[\u00A0\u2000-\u200D\u202F\u205F\u3000]/g, ' ')
                    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
                    .replace(/[\u2013\u2014\u2015]/g, "-")
                    .replace(/%/g, '\\%')
                    .replace(/#/g, '\\#')
                    .replace(/&/g, '\\&');
                let whatIBring = sectionData.whatIBring
                    .replace(/[\u00A0\u2000-\u200D\u202F\u205F\u3000]/g, ' ')
                    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
                    .replace(/[\u2013\u2014\u2015]/g, "-")
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

export const formatTextForLatex = (text: string) => {
    return text
        .replace(
            /[\u00A0\u2000-\u200D\u202F\u205F\u3000]/g, ' ')
        .replace(
            /[\u2018\u2019\u201A\u201B]/g, 
            "'")
        .replace(/[\u2013\u2014\u2015]/g, "-")
        .replace(/%/g, '\\%')
        .replace(/#/g, '\\#')
        .replace(/&/g, '\\&');
}