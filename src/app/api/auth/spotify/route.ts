import { NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'http://127.0.0.1:3000/api/auth/callback/spotify';

export async function GET() {
  if (!SPOTIFY_CLIENT_ID) {
    return NextResponse.json({ error: 'Missing Spotify Client ID' }, { status: 500 });
  }

  const scope = 'playlist-read-private playlist-read-collaborative user-read-private user-read-email';
  
  const searchParams = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
    show_dialog: 'true',
  });

  const authUrl = `https://accounts.spotify.com/authorize?${searchParams.toString()}`;
  return NextResponse.redirect(authUrl);
}
