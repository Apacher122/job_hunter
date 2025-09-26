import { promises as fsPromises } from 'fs';
import { infoStore } from '../../data/info.store.js';
import { insertJobInfo } from '../../../database/queries/old/job.queries.js';
import { parseJSONData } from '../documents/json/json.helpers.js';
import paths from '../../constants/paths.js';
import { sanitizeText } from '../formatters/string.formatter.js';

export const getDateToday = (): string => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return today.toLocaleDateString('en-US', options);
};

export const getJobPostingContent = async (isJson = false): Promise<void> => {
    infoStore.jobPosting;

    // if (isJson == true) {
    //     return parseJSONData(paths.paths.jobData);
    // }

    try {
        infoStore.jobPosting.body = await fsPromises.readFile(paths.paths.jobData, 'utf-8');
        const temp = infoStore.jobPosting.body.match(/Company:\s*(.+)/);
        infoStore.jobPosting.rawCompanyName = temp ? temp[1] : '';

        const urlMatch = infoStore.jobPosting.body.match(/URL:\s*(.+)/);
        const positionMatch = infoStore.jobPosting.body.match(/Position:\s*(.+)/);
        const applicantMatch = infoStore.jobPosting.body.match(/Applicants:\s*(.+)/);
        const detailsMatch = infoStore.jobPosting.body.match(/Details:\s*(.+)/)

        infoStore.jobPosting.url = urlMatch ? urlMatch[1].trim() : '';
        infoStore.jobPosting.position = positionMatch ? positionMatch[1].trim() : '';
        infoStore.jobPosting.applicantCount = applicantMatch ? applicantMatch[1].trim() : '';
        infoStore.jobPosting.jobDetails = detailsMatch ? detailsMatch[1].trim() : '';

        // Format the company name: replace spaces with underscores and convert to lowercase
        if (infoStore.jobPosting.rawCompanyName) {
            infoStore.jobPosting.companyName = infoStore.jobPosting.rawCompanyName.replace(/\s+/g, '_').toLowerCase();
            infoStore.jobPosting.companyName = sanitizeText(infoStore.jobPosting.companyName);
        }

        // Add to db
        const jobId = await insertJobInfo(infoStore.jobPosting);
        infoStore.jobPosting.id = jobId;
    } catch (error) {
        const e = error as Error;
        console.error(`Error reading job posting: ${e.message}`);
        throw error;
    }
}