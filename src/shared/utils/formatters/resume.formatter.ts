import dedent from "dedent";
import { formatTitle } from "./string.formatter.js";

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

export const formatPlaintextSection = (sectionType: string) => (sectionData: any): string => {
    switch (sectionType) {
        case "experiences":
            // Each experience as a block with company, position, dates, and bullet points
            const expItems = sectionData.description
                .map(({ text }: { text: string }) => `  - ${text}`)
                .join("\n");
            
            return dedent(`
                **Company:**${sectionData.company}
                **Position:** ${sectionData.position}
                **Dates:** ${sectionData.start} - ${sectionData.end}
                **Responsibilities:**
                ${expItems}
            `);
        
        case "skills":
            // Skills as comma-separated list under category
            const skillList = sectionData.skill
                .map(({ item }: { item: string }) => item)
                .join(", ");
            return `**${sectionData.category} Skills:** ${skillList}`;
        
        case "projects":
            // Each project with role, name, status and bullet points
            const projItems = sectionData.description
                .map(({ text }: { text: string }) => `  - ${text}`)
                .join("\n");
            return dedent(`
                **Project Name:** ${sectionData.name}
                **Role:** ${sectionData.role}
                **Status:** ${sectionData.status}
                **Details:**
                ${projItems}
            `);
        case "cover_letter":
        return dedent(`
            ### About:

            ${sectionData.about}
                    
            ### Experience:

            ${sectionData.experience}
                    
            ### What I Bring:
            
            ${sectionData.whatIBring}
            `);
        
        default:
        throw new Error(`Invalid section type: ${sectionType}`);
    }
};

const formatDescriptions = (descriptions: any[]) =>
  descriptions.map((desc) => {
  const justification = desc.justification_for_change || desc.justification_for_changes || 'No justification provided';
  return `* ${desc.text}\n***Justification: ${desc.justification_for_change || desc.justification_for_changes}***\n`;
})
.join('\n');

export const sectionFormatters: Record<
string,
(items: any[]) => string
> = {
  experiences: (items) =>
    '# Changes made to Experience Section\n\n' +
  items
  .map(
    (exp) =>
      `## Position: ${exp.position}\n\n### Company: ${exp.company}\n\n` +
    formatDescriptions(exp.description)
  )
  .join('\n'),
  skills: (items) =>
    '# Changes made to Skills Section\n\n' +
  items
  .map(
    (skill) => {
      const skillItems = skill.skill.map((item: any) => item.item).join(', ');
      return `* ${skill.category}: ${skillItems}\n  ***Justification: ${skill.justification_for_changes}***\n`;
    }
  )
  .join('\n'),
  projects: (items) =>
    '# Changes made to Projects Section\n\n' +
  items
  .map(
    (project) =>
      `## Project: ${project.name}\n\n### Role: ${project.role}\n\n### Status: ${project.status}\n\n` +
    formatDescriptions(project.description)
  )
  .join('\n'),
};