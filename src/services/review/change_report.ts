import { appendFileSync } from 'fs';
import paths from '../../shared/constants/paths.js';
import { format } from 'path';

const changeReportPath = paths.paths.change_report;


const formatDescriptions = (descriptions: any[]) =>
  descriptions.map((desc) => {
  const justification = desc.justification_for_change || desc.justification_for_changes || 'No justification provided';
  return `* ${desc.text}\n***Justification: ${desc.justification_for_change || desc.justification_for_changes}***\n`;
})
.join('\n');

const sectionFormatters: Record<
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

export const generateChangeReport = (response: any) => {
  let content = '';
  Object.entries(sectionFormatters).forEach(([section, formatter]) => {
    if (response[section]) {
      content += formatter(response[section]);
    }
  });
  appendFileSync(changeReportPath, content);
}