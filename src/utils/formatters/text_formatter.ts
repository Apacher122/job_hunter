import fs from 'fs';
import path from 'path';
import { extractTextFromFile } from '../files/file_helpers.js';
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
    const files = await fs.promises.readdir(paths.paths.writing_examples_dir);
    const examples: string[] = [];


    for (const file of files) {
        const filePath = path.join(paths.paths.writing_examples_dir, file);
        const stat = await fs.promises.stat(filePath);

        if (stat.isFile()) {
            const text = await extractTextFromFile(filePath);
            if (text.trim()) {
                examples.push(text.trim());
            }
        }
    }

    let output = '--- Writing Examples ---\n\n';
    examples.slice(0, 6).forEach((example, index) => {
        output += `- Example ${index + 1}:\n    ${example.replace(/\n/g, '\n    ')}\n\n\n`;
    });
    return output;
}