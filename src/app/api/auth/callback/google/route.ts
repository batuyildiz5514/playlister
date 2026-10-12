import { NextRequest, NextResponse } from 'next/server';
import { getGoogleOAuthClient } from '@/lib/google';
import { getBaseUrl } from '@/lib/url';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/?error=google_access_denied', getBaseUrl()));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_google_code', getBaseUrl()));
  }

  try {
    const oauth2Client = getGoogleOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    
    if (tokens.access_token) {
      const isSpotifyConnected = request.cookies.has('spotify_access_token');
      const targetPath = isSpotifyConnected ? '/dashboard' : '/?google=success';
      const baseUrl = getBaseUrl();
      const response = NextResponse.redirect(new URL(targetPath, baseUrl));
      const isProd = process.env.NODE_ENV === 'production';
      
      response.cookies.set('google_access_token', tokens.access_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: isProd,
        maxAge: 3600,
      });
      
      if (tokens.refresh_token) {
        response.cookies.set('google_refresh_token', tokens.refresh_token, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          secure: isProd,
        });
      }

      return response;
    } else {
      return NextResponse.redirect(new URL('/?error=google_token_failed', getBaseUrl()));
    }
  } catch (err) {
    console.error('Google token error:', err);
    return NextResponse.redirect(new URL('/?error=google_server_error', getBaseUrl()));
  }
}
