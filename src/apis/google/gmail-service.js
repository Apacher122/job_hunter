import { google } from 'googleapis';
import { authorize } from './login-service.js';

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  const res = await gmail.users.labels.list({
    userId: 'me',
  });
  const labels = res.data.labels;
  if (!labels || labels.length === 0) {
    console.log('No labels found.');
    return;
  }
  console.log('Labels:');
  labels.forEach((label) => {
    console.log(`- ${label.name}`);
  });
}


async function searchJobApplicationEmails(auth) {
  const gmail = google.gmail({ version: 'v1', auth });

  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'subject:application OR "job application submitted" newer_than:1y',
    maxResults: 20,
  });

  if (!res.data.messages || res.data.messages.length === 0) {
    console.log('No job application emails found.');
    return;
  }

  for (const msg of res.data.messages) {
    const fullMessage = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id,
      format: 'metadata',
      metadataHeaders: ['Date', 'Subject'],
    });

    const headers = fullMessage.data.payload.headers;
    const dateHeader = headers.find(h => h.name === 'Date')?.value;
    const subjectHeader = headers.find(h => h.name === 'Subject')?.value;

    console.log(`Date: ${dateHeader}`);
    console.log(`Subject: ${subjectHeader}`);
    console.log('---');
  }
}


authorize().then(searchJobApplicationEmails).catch(console.error);