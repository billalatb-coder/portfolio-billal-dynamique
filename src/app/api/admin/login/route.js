import { NextResponse } from 'next/server';

// DEFAULT ADMIN CREDENTIALS (TO BE CHANGED IN PRODUCTION ENV)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@billal.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'cybersecurity2026';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create a simple response
      const response = NextResponse.json({ success: true }, { status: 200 });
      
      // Set an HTTP-only cookie to simulate a session
      response.cookies.set({
        name: 'admin_session',
        value: 'authenticated',
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
