import { db } from '@/lib/firebase/firebaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Save to Firestore
    await db.collection('portfolio').doc('profile').set({
      name: data.name,
      title: data.title
    }, { merge: true });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Firestore save error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
