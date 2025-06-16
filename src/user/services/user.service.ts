import { promises as fsPromises } from 'fs';
import { info } from 'console';
import { infoStore } from '../../shared/data/info.store';
import { insertJobInfo } from '../../database/queries/job.queries';
import { parseJSONData } from '../../shared/utils/documents/json/json.helpers';
import paths from '../../shared/constants/paths';
import { sanitizeText } from '../../shared/utils/formatters/string.formatter';

export const getJobPostFromCall = async (jobContent: string): Promise<void> => {
    try {
        infoStore.jobPosting.body = jobContent;
        // Store to local text
        await fsPromises.writeFile(paths.paths.jobData, jobContent, 'utf-8');

        // Extract company name, URL, and position from the job content
        const temp = jobContent.match(/Company:\s*(.+)/);
        infoStore.jobPosting.rawCompanyName = temp ? temp[1] : '';

        const urlMatch = jobContent.match(/URL:\s*(.+)/);
        const positionMatch = jobContent.match(/Position:\s*(.+)/);

        infoStore.jobPosting.url = urlMatch ? urlMatch[1].trim() : '';
        infoStore.jobPosting.position = positionMatch ? positionMatch[1].trim() : '';

        // Format the company name: replace spaces with underscores and convert to lowercase
        if (infoStore.jobPosting.rawCompanyName) {
            infoStore.jobPosting.companyName = infoStore.jobPosting.rawCompanyName.replace(/\s+/g, '_').toLowerCase();
            infoStore.jobPosting.companyName = sanitizeText(infoStore.jobPosting.companyName);
        }

        const jobId = await insertJobInfo();
        infoStore.jobPosting.id = jobId;
    } catch (error) {
        const e = error as Error;
        console.error(`Error processing job posting content: ${e.message}`);
        throw error;
    }
}
