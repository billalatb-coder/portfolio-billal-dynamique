import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import path from 'path';

if (!getApps().length) {
  try {
    const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

    initializeApp({
      credential: cert(serviceAccount)
    });
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
  }
}

const db = getFirestore();
const auth = getAuth();

export { db, auth };
