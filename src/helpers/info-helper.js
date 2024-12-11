import { promises as fsPromises } from 'fs';
import config from '../config/config.js';
export const parseJSONData = async (filePath) => {
    try {
        const data = await fsPromises.readFile(filePath, 'utf-8');
        const parsedData = JSON.parse(data);
        return JSON.stringify(parsedData)
    } catch (error) {
        console.error(`Could not parse JSON data ${error.message}`);
        throw error;
    }
}

export const getCurrentResumeContent = async (isJson = false) => {
    if (isJson ) {
        return parseJSONData(config.paths.current_resume_data);
    }

    try {
        const resumeContent = await fsPromises.readFile(config.paths.current_resume_data, 'utf-8');
        return resumeContent;
    } catch (error) {
        console.error(`Error reading resume data: ${error.message}`);
        throw error;
    }
}

export const getJobPostingContent = async (isJson = false) => {
    if (isJson == true) {
        return parseJSONData(config.paths.job_data);
    }

    try {
        const jobPostingContent = await fsPromises.readFile(config.paths.job_data, 'utf-8');
        const temp = jobPostingContent.match(/Company:\s*(.+)/);
        let companyName = temp ? temp[1] : '';
        // Format the company name: replace spaces with underscores and convert to lowercase
        if (companyName) {
            companyName = companyName.replace(/\s+/g, '_').toLowerCase();
        }
        return {jobPostingContent, companyName};
    } catch (error) {
        console.error(`Error reading job posting: ${error.message}`);
        throw error;
    }
}
