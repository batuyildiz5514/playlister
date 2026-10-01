import { google } from 'googleapis';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://127.0.0.1:3000/api/auth/callback/google';

export const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

export const getGoogleAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline', // refresh token alabilmek için
    scope: scopes,
    prompt: 'consent' // Her seferinde izin sormasını ve refresh token vermesini zorlar
  });
};
