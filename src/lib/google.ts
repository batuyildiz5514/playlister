import { google } from 'googleapis';
import { getBaseUrl } from './url';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const getGoogleOAuthClient = () => {
  const REDIRECT_URI = `${getBaseUrl()}/api/auth/callback/google`;
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );
};

export const getGoogleAuthUrl = () => {
  const client = getGoogleOAuthClient();
  const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl'
  ];

  return client.generateAuthUrl({
    access_type: 'offline', // refresh token alabilmek için
    scope: scopes,
    prompt: 'consent' // Her seferinde izin sormasını ve refresh token vermesini zorlar
  });
};
