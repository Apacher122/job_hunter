
// Format new LaTeX content from the zod object returned by openai

import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import config from '../constants/paths.js';

// Force single page. 
// Make the title pretty
export const titleFormat = (str: string) => {
    return str
    .replace(/[%#&_]/g, match => ({
        '%': '\\%',
        '#': '\\#',
        '&': '\\&',
        '_': ' '
      }[match] || match))
      .toLowerCase()
      .replace(/\b\w/g, s => s.toUpperCase());
};

const formatText = (text: string) => {
    return text
    .replace(/%/g, '\\%')
    .replace(/#/g, '\\#')
    .replace(/&/g, '\\&')
};


// export const formatSuccessMetric = (metric: any): string => [
//     `### ${metric.scoreTitle}`,
//     `- Score: ${metric.score}`,
//     `- Justification: ${metric.scoreJustification}`,
//     `- Compatible: ${metric.isCompatible ? 'Yes' : 'No'}`,
//     `- Probability of Success: ${metric.probabilityOfSuccess}`,
//     `- Probability of Success Equation: ${metric.probabilityOfSuccessEquation || 'N/A'}`,
//     `- Probability of Success Justification: ${metric.probabilityOfSuccessJustification || 'N/A'}`
// ].join('\n')

// export const formatOverallMatchSummary = (summary: any): string => [
//     `## Overall Match Summary:`,
//     `- Summary:\n\t- ${summary.summary.join('\n\t- ')}`,
//     `- Suggestions:\n\t- ${summary.suggestions.join('\n\t- ')}`,
//     '',
// ].join('\n');
