import dedent from 'dedent';
import { extractTextFromFile } from '../documents/file.helpers.js';
import fs from 'fs';
import path from 'path';
import paths from '../../constants/paths.js';

export const formatTitle = (str: string): string => {
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

const formatText = (text: string): string => {
    return text
    .replace(/%/g, '\\%')
    .replace(/#/g, '\\#')
    .replace(/&/g, '\\&')
};

export const getWritingExamples = async (): Promise<string> => {
    const files = await fs.promises.readdir(paths.paths.writingExamplesDir);
    const examples: string[] = [];


    for (const file of files) {
        const filePath = path.join(paths.paths.writingExamplesDir, file);
        const stat = await fs.promises.stat(filePath);

        if (stat.isFile()) {
            const text = await extractTextFromFile(filePath);
            if (text.trim()) {
                examples.push(text.trim());
            }
        }
    }

    let output = '';
    examples.slice(0, 6).forEach((example, index) => {
        output += dedent(`
        #### Example ${index + 1}
        
            \`\`\`plainttext

            ${example.replace(/\n/g, '\n    ')}
            
            \`\`\`\n\n
        `);
    });
    return output;
}


export const sanitizeText = (text: string): string => {
    return text.replace(/[^\w\s.,!?'"()-]/g, '');
}