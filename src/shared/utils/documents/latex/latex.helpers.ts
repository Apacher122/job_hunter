import Handlebars from "handlebars";
import { ResumeSectionNotFoundError } from "../../../errors/resume_builder.errors.js";
import { formatTitle } from "../../formatters/string.formatter";
import fs from "fs";
import { infoStore } from "../../../data/info.store.js";
import paths from "../../../constants/paths.js";
import { text } from "express";

export const sectionToLatexEnvMap: Record<
  string,
  "cvskills" | "cventries" | "cvletter"
> = {
  projects: "cventries",
  experiences: "cventries",
  skills: "cvskills",
  "cover letter": "cvletter",
};

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

  const educationInfo = Handlebars.compile(educationTemplate)(
    infoStore.education_info
  );
  await fs.promises.writeFile(paths.latex.resume.education, educationInfo);
};

export const replaceSectionContent = (
  texContent: string,
  newContent: string[],
  sectionType: "cvskills" | "cventries" | "cvletter"
) => {
  const environments = [
    { name: "cvskills", start: "\\begin{cvskills}", end: "\\end{cvskills}" },
    { name: "cventries", start: "\\begin{cventries}", end: "\\end{cventries}" },
    { name: "cvletter", start: "\\begin{cvletter}", end: "\\end{cvletter}" },
  ];

  const env = environments.find((env) => env.name === sectionType);
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

export const formatLatexSection = (sectionType: string) => (sectionData: any) => {
  switch (sectionType) {
    case "experiences": return formatExperiences(sectionData);
    case "skills": return formatSkills(sectionData);
    case "projects": return formatProjects(sectionData);
    case "cover_letter": return formatCoverLetter(sectionData);
    default: throw new Error(`Invalid section type: ${sectionType}`);
  }
};


export const formatTextForLatex = (text: string) => {
  if (!text) return '';

  const replacements: Record<string, string> = {
    '\\': '\\textbackslash{}',
    '%': '\\%',
    '#': '\\#',
    '&': '\\&',
    '$': '\\$',
    '{': '\\{',
    '}': '\\}',
    '^': '\\^{}',
    '_': '\\_',
    '~': '\\~{}',
    '\u00A0': ' ',
    '\u2000': ' ',
    '\u2001': ' ',
    '\u2002': ' ',
    '\u2003': ' ',
    '\u2004': ' ',
    '\u2005': ' ',
    '\u2006': ' ',
    '\u2007': ' ',
    '\u2008': ' ',
    '\u2009': ' ',
    '\u200A': ' ',
    '\u200B': ' ',
    '\u200C': ' ',
    '\u200D': ' ',
    '\u202F': ' ',
    '\u205F': ' ',
    '\u3000': ' ',
    '\u2018': "'", 
    '\u2019': "'", 
    '\u201A': "'", 
    '\u201B': "'", 
    '\u201C': '"', 
    '\u201D': '"', 
    '\u2013': '-', 
    '\u2014': '-', 
    '\u2015': '-',
  };

  const escapeForRegex = (char: string) => char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  const regex = new RegExp(
    `[${Object.keys(replacements).map(escapeForRegex).join('')}]`,
    'g'
  );

  let result = text.replace(regex, (match) => replacements[match] || match);
  result = result.replace(/\s+/g, ' ').trim();

  return result;
};

const formatExperiences = (data: any) => {
  const items = data.description
    .map(({ text }: { text: string }) => `    \\item {${formatTextForLatex(text)}}`)
    .join("\n");

  return `
\\cventry
  {${formatTextForLatex(data.company)}} % Organization
  {${formatTextForLatex(data.position)}} % Job title
  {} % Location
  {${formatTextForLatex(data.start)} - ${formatTextForLatex(data.end)}} % Date(s)
  {
    \\begin{cvitems}
${items}
    \\end{cvitems}
  }`;
};

const formatSkills = (data: any) => {
  const skillList = data.skill.map(({ item }: { item: string }) => formatTextForLatex(item)).join(", ");
  return `
\\cvskill
  {${formatTitle(data.category)}} % Category
  {${skillList}} % Skills`;
};

const formatProjects = (data: any) => {
  const items = data.description.map(({ text }: { text: string }) => `    \\item {${formatTextForLatex(text)}}`).join("\n");
  return `
\\cventry
  {${formatTextForLatex(data.role)}} % Role
  {${formatTextForLatex(data.name)}} % Event
  {} % Location
  {${formatTextForLatex(data.status)}} % Date(s)
  {
    \\begin{cvitems}
${items}
    \\end{cvitems}
  }`;
};

const formatCoverLetter = (data: any) => `
\\lettersection{About}
${formatTextForLatex(data.about)}

\\lettersection{Experience}
${formatTextForLatex(data.experience)}

\\lettersection{What I Bring}
${formatTextForLatex(data.whatIBring)}
`;
