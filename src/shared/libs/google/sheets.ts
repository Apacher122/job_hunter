import { appendJSONData } from '../../utils/documents/json/json.helpers.js';
import { authorize } from './login.js'; // Adjust the import path as necessary
import { google } from 'googleapis';
import { infoStore } from '../../data/info.store.js';
import paths from '../../constants/paths.js';

export const insertRowToSheet = async () => {
    const auth = await authorize();
    const sheets = google.sheets({ version: 'v4', auth: auth as any  });
    const sheetID = '1Gd1ZjeOoyBu4bzznppr8TzdwT1uvEFFeNqHDx8iRYak';
    const sheetName = 'Sheet1';
    const jobPostingContent = infoStore.jobPosting;
    if (!jobPostingContent || !jobPostingContent.companyName) {
        console.error('Job posting content or company name not found.');
        return;
    }

    const jobData = { "companyName": jobPostingContent.rawCompanyName, "position": jobPostingContent.position };
    await appendJSONData(paths.paths.jobList, jobData); // Append job data to the existing JSON file
   

    const entry = [
        {
            Company: jobPostingContent.rawCompanyName,
            'Date Applied': new Date().toLocaleDateString(),
            Position: { text: jobPostingContent.position, url: jobPostingContent.url }
        }
    ]


    console.log('Inserting row to Google Sheets');
    const request = {
        spreadsheetId: sheetID,
        range: `${sheetName}!1:1`
    };

    const getSheet = {
        spreadsheetId: sheetID,
        range: `${sheetName}!A2:C`,
    };
    try {

        const currentData = await sheets.spreadsheets.values.get(getSheet);
        const currentRows = currentData.data.values || [];

        const headersResponse = await sheets.spreadsheets.values.get(request);
        const headers = headersResponse.data.values?.[0] || [];

        const matchIndex = currentRows.findIndex(row => {
            const companyIndex = headers.indexOf('Company');
            const positionIndex = headers.indexOf('Position');
            return row[companyIndex] === entry[0].Company && row[positionIndex] === entry[0].Position.text;
        });

        const formatCell = (cell: { text: any; url: any; }) => {
            if (typeof cell === 'object' && cell.text && cell.url) {
                return `=HYPERLINK("${cell.url}", "${cell.text}")`;
            }
            return cell ?? '';
        };

        const values = entry.map(row => 
                headers.map(header => formatCell((row as Record<string, any>)[header]))
            );

        if (matchIndex !== -1) {
            const rowNum = matchIndex + 2;
            const updateRange = `${sheetName}!A${rowNum}`;

            await sheets.spreadsheets.values.update({
                spreadsheetId: sheetID,
                range: updateRange,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: values,
                },
            });
            console.log('Row updated successfully');
        } else {
            await sheets.spreadsheets.values.append({
                spreadsheetId: sheetID,
                range: `${sheetName}!A1:C`,
                valueInputOption: 'USER_ENTERED',
                insertDataOption: 'INSERT_ROWS',
                requestBody: {
                    values: values,
                },
            });
            console.log('Row inserted successfully');
        }

        console.log('Row inserted:');
    } catch (error) {
        console.error('Error inserting row:', error);
    }
}
