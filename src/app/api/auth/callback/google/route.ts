import { NextRequest, NextResponse } from 'next/server';
import { oauth2Client } from '@/lib/google';

export async function GET(request: NextRequest) {
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
      const isSpotifyConnected = request.cookies.has('spotify_access_token');
      const targetPath = isSpotifyConnected ? '/dashboard' : '/?google=success';
      const response = NextResponse.redirect(new URL(targetPath, 'http://127.0.0.1:3000'));
      
      response.cookies.set('google_access_token', tokens.access_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 3600,
      });
      
      if (tokens.refresh_token) {
        response.cookies.set('google_refresh_token', tokens.refresh_token, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
        });
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
