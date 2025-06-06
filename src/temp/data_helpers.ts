import { promises as fsPromises } from 'fs';
import paths from '../constants/paths.js';
import { infoStore } from '../data/info_store.js';


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
        const combinedData = {};

        for (const section of sections) {
            const filePath = paths.paths.section_json(section);
            const data = await parseJSONData(filePath);
            const jsonData = JSON.parse(data);
            Object.assign(combinedData, jsonData);
        }
        return combinedData;
    } catch (error) {
        const e = error as Error;
        console.error(`Error combining JSON data: ${e.message}`);
        throw error;
    }
};

// Get job post description, company name, etc.
export const getJobPostingContent = async (isJson = false) => {
    infoStore.jobPosting;

    if (isJson == true) {
        return parseJSONData(paths.paths.job_data);
    }

    try {
        infoStore.jobPosting.body = await fsPromises.readFile(paths.paths.job_data, 'utf-8');
        const temp = infoStore.jobPosting.body.match(/Company:\s*(.+)/);
        infoStore.jobPosting.rawCompanyName = temp ? temp[1] : '';

        const urlMatch = infoStore.jobPosting.body.match(/URL:\s*(.+)/);
        const positionMatch = infoStore.jobPosting.body.match(/Position:\s*(.+)/);

        infoStore.jobPosting.url = urlMatch ? urlMatch[1].trim() : '';
        infoStore.jobPosting.position = positionMatch ? positionMatch[1].trim() : '';

        // Format the company name: replace spaces with underscores and convert to lowercase
        if (infoStore.jobPosting.rawCompanyName) {
            infoStore.jobPosting.companyName = infoStore.jobPosting.rawCompanyName.replace(/\s+/g, '_').toLowerCase();
        }
        // return {job: jobPostingContent, company: companyName, url: url, position: position, rawCompanyName: rawCompanyName};
    } catch (error) {
        const e = error as Error;
        console.error(`Error reading job posting: ${e.message}`);
        throw error;
    }
}


export const getDateToday = (): string => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return today.toLocaleDateString('en-US', options);
};