import { NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '@/lib/google';

export async function GET() {
  const authUrl = getGoogleAuthUrl();
  return NextResponse.redirect(authUrl);
}
