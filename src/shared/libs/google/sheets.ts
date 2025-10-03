// import { $Enums, Prisma } from '@prisma/client';

// import { appendJSONData } from '../../utils/documents/json/json.helpers.js';
// import { authorize } from './login.js'; // Adjust the import path as necessary
// import dotenv from 'dotenv';
// import { getJobPost } from '../../../database/queries/job.queries.js';
// import { google } from 'googleapis';
// import paths from '../../constants/paths.js';
// import prisma from '../../../database/prisma_client.js';

// dotenv.config();


// export const insertRowToSheet = async (id: number) => {
//   const auth = await authorize();
//   const sheets = google.sheets({ version: 'v4', auth: auth as any });
//   const sheetID = process.env.SHEET_ID;
//   const sheetName = process.env.SHEET_NAME;
//   const jobPostingContent = await getJobPost(id);
//   if (!jobPostingContent || !jobPostingContent.companyName) {
//     console.error(`Job posting content or company name not found for ${id}`);
//     return;
//   }

//   const jobData = {
//     companyName: jobPostingContent.rawCompanyName,
//     position: jobPostingContent.position,
//   };
//   await appendJSONData(paths.paths.jobList, jobData); // Append job data to the existing JSON file

//   const entry = [
//     {
//       Company: jobPostingContent.rawCompanyName,
//       'Date Applied': new Date().toLocaleDateString(),
//       Position: {
//         text: jobPostingContent.position,
//         url: jobPostingContent.url,
//       },
//     },
//   ];

//   const request = {
//     spreadsheetId: sheetID,
//     range: `${sheetName}!1:1`,
//   };

//   const getSheet = {
//     spreadsheetId: sheetID,
//     range: `${sheetName}!A2:C`,
//   };
//   try {
//     const currentData = await sheets.spreadsheets.values.get(getSheet);
//     const currentRows = currentData.data.values || [];

//     const headersResponse = await sheets.spreadsheets.values.get(request);
//     const headers = headersResponse.data.values?.[0] || [];

//     const matchIndex = currentRows.findIndex((row) => {
//       const companyIndex = headers.indexOf('Company');
//       const positionIndex = headers.indexOf('Position');
//       return (
//         row[companyIndex] === entry[0].Company &&
//         row[positionIndex] === entry[0].Position.text
//       );
//     });

//     const formatCell = (cell: { text: any; url: any }) => {
//       if (typeof cell === 'object' && cell.text && cell.url) {
//         return `=HYPERLINK("${cell.url}", "${cell.text}")`;
//       }
//       return cell ?? '';
//     };

//     const values = entry.map((row) =>
//       headers.map((header) => formatCell((row as Record<string, any>)[header]))
//     );

//     if (matchIndex !== -1) {
//       const rowNum = matchIndex + 2;
//       const updateRange = `${sheetName}!A${rowNum}`;

//       await sheets.spreadsheets.values.update({
//         spreadsheetId: sheetID,
//         range: updateRange,
//         valueInputOption: 'USER_ENTERED',
//         requestBody: {
//           values: values,
//         },
//       });
//     } else {
//       await sheets.spreadsheets.values.append({
//         spreadsheetId: sheetID,
//         range: `${sheetName}!A1:C`,
//         valueInputOption: 'USER_ENTERED',
//         insertDataOption: 'INSERT_ROWS',
//         requestBody: {
//           values: values,
//         },
//       });
//     }

//   } catch (error) {
//     console.error('Error inserting row:', error);
//   }
// };

// export const syncDBtoSheets = async () => {
//   const auth = await authorize();
//   const sheets = google.sheets({ version: 'v4', auth: auth as any });

//   const sheetID = process.env.SHEET_ID;
//   const sheetName = process.env.SHEET_NAME;

//   try {
//     const headerResponse = await sheets.spreadsheets.values.get({
//       spreadsheetId: sheetID,
//       range: `${sheetName}!1:1`,
//     });
//     const headers = headerResponse.data.values?.[0] || [];

//     const rowsResponse = await sheets.spreadsheets.values.get({
//       spreadsheetId: sheetID,
//       range: `${sheetName}!A2:Z`, 
//     });
//     const rows = rowsResponse.data.values || [];

//     const jobs = rows.map((row) => {
//       const job: Record<string, string> = {};
//       headers.forEach((header, i) => {
//         job[header] = row[i] || '';
//       });

//       const extractUrl = (val: string) => {
//         const match = val.match(/=HYPERLINK\("([^"]+)",\s*"([^"]+)"\)/);
//         if (match) {
//           return { url: match[1], text: match[2] };
//         }
//         return { url: '', text: val };
//       };

//       const positionCell = job['Position'] || '';
//       const { url, text } = extractUrl(positionCell);

//       return {
//         company: job['Company'] || '',
//         position: text,
//         dateApplied: job['Date Applied'] || '',
//         url,
//         status: job['Status'] || '',
//         statusUpdateDate: job['Status Update Date'] || '',
//       };
//     });
//     for (const job of jobs) {
//       let temp = job.status.trim().toLowerCase();
//       let status: $Enums.application_status;
//       switch (temp) {
//         case 'rejected':
//           status = $Enums.application_status.Rejected;
//           break;
//         case 'offer received':
//           status = $Enums.application_status.Offered;
//           break;
//         default:
//           status = $Enums.application_status.Open;
//       }
//       await prisma.job_postings.updateMany({
//         where: {
//             rawcompanyname: job.company,
//             position: job.position,
//         },
//         data: {
//           applied_on: parseSheetDate(job.dateApplied),
//           url: job.url || undefined,
//           status: status|| undefined,
//           initial_application_update_date: parseSheetDate(job.statusUpdateDate),
//         }
//       });
//     }
//     return jobs;
//   } catch (err) {
//     console.error('Error fetching jobs:', err);
//     return [];
//   }
// };

// function parseSheetDate(value: string): Date | null {
//   if (!value) return null;

//   const parsed = new Date(value);
//   if (!isNaN(parsed.getTime())) {
//     return parsed;
//   }

//   if (!isNaN(Number(value))) {
//     const excelEpoch = new Date(1899, 11, 30);
//     return new Date(excelEpoch.getTime() + Number(value) * 86400000);
//   }

//   console.warn(`Could not parse date: "${value}"`);
//   return null;
// }

