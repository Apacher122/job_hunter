import { promises as fsPromises } from 'fs';
import paths from '../../../constants/paths.js';

// Read in JSON data for current resume
export const parseJSONData = async (filePath: string) => {
    try {
        const data = await fsPromises.readFile(filePath, 'utf-8');
        const parsedData = JSON.parse(data);
        return JSON.stringify(parsedData)
    } catch (error) {
        const e = error as Error;
        console.error(`Could not parse JSON data ${e.message}`);
        throw error;
    }
}

export const combineJSONData = async (sections: string[]) => {
    try{
        const combinedData: Record<string, any> = {};

        for (const section of sections) {
            const filePath = paths.paths.sectionJson(section);
            const data = await parseJSONData(filePath);
            const jsonData = JSON.parse(data);
            combinedData[section] = jsonData;
        }
        return combinedData;
    } catch (error) {
        const e = error as Error;
        console.error(`Error combining JSON data: ${e.message}`);
        throw error;
    }
};

export const appendJSONData = async (filePath: string, data: any): Promise<void> => {
    try {
        const content = await fsPromises.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(content);

        if (!Array.isArray(jsonData)) {
            throw new Error('JSON data is not an array');
        }

        jsonData.push(data);

        await fsPromises.writeFile(filePath, JSON.stringify(jsonData, null, 2));
    } catch (error) {
        if ((error as any).code === 'ENOENT') {
            await fsPromises.writeFile(filePath, JSON.stringify([data], null, 2));
        } else {
            const e = error as Error;
            console.error(`Error appending JSON data: ${e.message}`);
            throw error;
        }
    }    
};