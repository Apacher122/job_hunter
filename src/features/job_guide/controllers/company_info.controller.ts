import { Request, Response } from 'express';

import { getCompanyInfo } from '../services/company_info.service';
import { infoStore } from '../../../shared/data/info.store';
import paths from '../../../shared/constants/paths';
import { sendFileBuffer } from '../../../shared/utils/documents/file.helpers';

export const getCompanyInfoHandler = async (req: Request, res: Response): Promise<void> => {
    if (!infoStore.jobPosting || !infoStore.jobPosting.companyName) {
        return void res.status(400).json({ error: 'Job posting content or company name is not available in infoStore.' });
    }
    const content = await getCompanyInfo();
    sendFileBuffer(res, paths.paths.companyInfo(infoStore.jobPosting.companyName), 'company_info.txt', 'text/plain');
    res.status(200).json({ message: 'Company info retrieved successfully', content });
};