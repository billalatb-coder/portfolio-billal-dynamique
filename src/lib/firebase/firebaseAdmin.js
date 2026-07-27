import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

function getServiceAccount() {
  // Production (Vercel): read from environment variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }
  // Local development: read from file
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require('fs');
  const path = require('path');
  const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
  return JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
}

if (!getApps().length) {
  try {
    const serviceAccount = getServiceAccount();
    initializeApp({ credential: cert(serviceAccount) });
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
  }
}

const db = getFirestore();
const auth = getAuth();

export { db, auth };

