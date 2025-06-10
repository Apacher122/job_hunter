import { promises as fsPromises } from 'fs';
import paths from '../../constants/paths.js';
import { infoStore } from '../../data/info_store.js';
import { parseJSONData } from './json_helpers.js';


export const getJobPostingContent = async (isJson = false): Promise<string | undefined> => {
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

export const getJobPostFromCall = async (jobContent: string): Promise<void> => {
    try {
        infoStore.jobPosting.body = jobContent;
        const temp = jobContent.match(/Company:\s*(.+)/);
        infoStore.jobPosting.rawCompanyName = temp ? temp[1] : '';

        const urlMatch = jobContent.match(/URL:\s*(.+)/);
        const positionMatch = jobContent.match(/Position:\s*(.+)/);

        infoStore.jobPosting.url = urlMatch ? urlMatch[1].trim() : '';
        infoStore.jobPosting.position = positionMatch ? positionMatch[1].trim() : '';

        // Format the company name: replace spaces with underscores and convert to lowercase
        if (infoStore.jobPosting.rawCompanyName) {
            infoStore.jobPosting.companyName = infoStore.jobPosting.rawCompanyName.replace(/\s+/g, '_').toLowerCase();
        }
    } catch (error) {
        const e = error as Error;
        console.error(`Error processing job posting content: ${e.message}`);
        throw error;
    }
}
