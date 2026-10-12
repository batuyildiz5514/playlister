import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/url';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrl();
  const redirectUri = `${baseUrl}/api/auth/callback/spotify`;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/?error=spotify_access_denied', baseUrl));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_code', baseUrl));
  }

  const authOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
    },
    body: new URLSearchParams({
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  };

  try {
    const fetchResponse = await fetch('https://accounts.spotify.com/api/token', authOptions);
    const data = await fetchResponse.json();

    if (data.access_token) {
      const isGoogleConnected = request.cookies.has('google_access_token');
      const targetPath = isGoogleConnected ? '/dashboard' : '/?spotify=success';
      const response = NextResponse.redirect(new URL(targetPath, baseUrl));
      const isProd = process.env.NODE_ENV === 'production';
      
      response.cookies.set('spotify_access_token', data.access_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: isProd,
        maxAge: data.expires_in || 3600,
      });
      
      if (data.refresh_token) {
        response.cookies.set('spotify_refresh_token', data.refresh_token, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          secure: isProd,
        });
      }

      return response;
    } else {
      return NextResponse.redirect(new URL('/?error=spotify_token_failed', baseUrl));
    }
  } catch (err) {
    console.error('Spotify token error:', err);
    return NextResponse.redirect(new URL('/?error=spotify_server_error', baseUrl));
  }
}
