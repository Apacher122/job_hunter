import fs from 'fs';
import path from 'path';

export const loadTemplate = async (
    folder: 'prompts' | 'instructions',
    fileName: string,
    variables: Record<string, string>
): Promise<string> => {
    try {
        const templatePath = path.join(
            __dirname,
            '..',
            '..',
            'templates',
            folder,
            `${fileName}.txt`
        );

        let content = await fs.readFileSync(templatePath, 'utf-8');

        for (const [key, value] of Object.entries(variables)) {
            content = content.replace(`{{${key}}}`, value);
        }

        return content; 
    } catch (error) {
        const e = error as Error;
        console.error(`Error loading template: ${e.message}`);
        throw error;
    }
}