import { NextResponse } from 'next/server';
import { oauth2Client } from '@/lib/google';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/?error=google_access_denied', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_google_code', request.url));
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    if (tokens.access_token) {
      const response = NextResponse.redirect(new URL('/?google=success', request.url));
      
      response.headers.append('Set-Cookie', `google_access_token=${tokens.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`);
      
      if (tokens.refresh_token) {
        response.headers.append('Set-Cookie', `google_refresh_token=${tokens.refresh_token}; Path=/; HttpOnly; SameSite=Lax`);
      }

      return response;
    } else {
      return NextResponse.redirect(new URL('/?error=google_token_failed', request.url));
    }
  } catch (err) {
    console.error('Google token error:', err);
    return NextResponse.redirect(new URL('/?error=google_server_error', request.url));
  }
}
