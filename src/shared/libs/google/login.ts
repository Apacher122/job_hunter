import fs from 'fs';
import { google } from 'googleapis';
import paths from '../../constants/paths.js'; 

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets',];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = paths.paths.googleToken; // Path to token.json
const CREDENTIALS_PATH = paths.paths.googleCredentials; // Path to credentials.json

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.promises.readFile(TOKEN_PATH, 'utf-8');
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client: { credentials: { refresh_token: any; }; }) {
  console.log("Saving credentials to token.json...");
  const content = await fs.promises.readFile(CREDENTIALS_PATH, 'utf-8');
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  console.log("Writing credentials to token.json...");
  await fs.promises.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
export const authorize = async() => {
  console.log("Loading Google credentials...");
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  });

  const client = await auth.getClient();
  // let client = await loadSavedCredentialsIfExist();
  // if (client) {
  //   console.log("Saved credentials found, using existing authorization...");
  //   return client;
  // }
  // console.log("No saved credentials found, requesting new authorization...");
  // client = await authenticate({
  //   scopes: SCOPES,
  //   keyfilePath: CREDENTIALS_PATH,
  // });
  // if (client.credentials) {
  //   console.log ("Saving new credentials to token.json...");
  //   await saveCredentials(client);
  // }
  // console.log("Google credentials loaded successfully.");
  return client;
}
