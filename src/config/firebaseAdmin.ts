import * as admin from 'firebase-admin';

const serviceAccount = require("./firebase-service-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
