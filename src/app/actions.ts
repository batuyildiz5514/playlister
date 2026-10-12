'use server';

import { cookies } from 'next/headers';
import { google } from 'googleapis';

export async function fetchSpotifyPlaylist(playlistUrl: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('spotify_access_token')?.value;

  if (!token) {
    throw new Error('Spotify token not found. Please log in again.');
  }

  let isAlbum = false;
  let spotifyId = playlistUrl.trim();
  
  if (spotifyId.includes('spotify.com/playlist/')) {
    const parts = spotifyId.split('spotify.com/playlist/');
    if (parts.length > 1) {
      spotifyId = parts[1].split('?')[0].split('/')[0];
    }
  } else if (spotifyId.includes('/album/')) {
    isAlbum = true;
    const parts = spotifyId.split('/album/');
    if (parts.length > 1) {
      spotifyId = parts[1].split('?')[0].split('/')[0];
    }
  } else if (spotifyId.includes('?')) {
    spotifyId = spotifyId.split('?')[0];
  }

  if (!spotifyId || spotifyId.includes('spotify.com')) {
    throw new Error('Invalid Spotify link. Please enter a valid playlist or album link.');
  }

  if (isAlbum) {
    // ALBUM OPERATIONS
    const res = await fetch(`https://api.spotify.com/v1/albums/${spotifyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error('Album not found. The link might be invalid.');
    }

    const albumData = await res.json();

    // Pagination for album tracks
    let allAlbumItems: any[] = [];
    let albumTracksUrl = `https://api.spotify.com/v1/albums/${spotifyId}/tracks?limit=50`;
    
    while (albumTracksUrl) {
      const pageRes = await fetch(albumTracksUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pageData = await pageRes.json();
      if (pageData.error) break;
      
      allAlbumItems.push(...(pageData.items || []));
      albumTracksUrl = pageData.next;
    }

    const trackList = allAlbumItems.map((track: any) => {
      return {
        id: track.id,
        name: track.name,
        artist: track.artists?.map((a: any) => a.name).join(', ')
      };
    }) || [];

    return {
      id: albumData.id,
      name: albumData.name,
      description: albumData.label ? `Released by ${albumData.label}` : 'Spotify Album',
      image: albumData.images?.[0]?.url,
      totalTracks: albumData.total_tracks || trackList.length,
      owner: albumData.artists?.[0]?.name || 'Unknown Artist',
      tracks: trackList
    };
  } else {
    // PLAYLIST OPERATIONS
    const res = await fetch(`https://api.spotify.com/v1/playlists/${spotifyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      if (res.status === 404) throw new Error('Playlist not found. It might be private or the link is invalid.');
      throw new Error('Spotify API error.');
    }

    const playlistData = await res.json();
    
    // Pagination for playlist tracks
    let allPlaylistItems: any[] = [];
    let playlistTracksUrl = `https://api.spotify.com/v1/playlists/${spotifyId}/items?limit=100`;
    
    while (playlistTracksUrl) {
      const pageRes = await fetch(playlistTracksUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pageData = await pageRes.json();
      
      if (pageData.error) {
        if (allPlaylistItems.length === 0) {
          throw new Error('Spotify API (Tracks) Error: ' + (pageData.error.message || JSON.stringify(pageData.error)));
        }
        break;
      }
      
      allPlaylistItems.push(...(pageData.items || []));
      playlistTracksUrl = pageData.next; // null ise döngü biter
    }

    const trackList = allPlaylistItems
      .map((playlistItem: any) => {
        const track = playlistItem.item || playlistItem.track;
        if (!track) return null;
        return {
          id: track.id,
          name: track.name,
          artist: track.artists?.map((a: any) => a.name).join(', ')
        };
      })
      .filter(Boolean);
    
    return {
      id: playlistData.id,
      name: playlistData.name,
      description: playlistData.description,
      image: playlistData.images?.[0]?.url,
      totalTracks: allPlaylistItems.length || trackList.length,
      owner: playlistData.owner?.display_name,
      tracks: trackList
    };
  }
}

export async function createYouTubePlaylist(title: string, description: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('google_access_token')?.value;

  if (!token) {
    throw new Error('Google token not found. Please connect your YouTube account.');
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: token });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  const res = await youtube.playlists.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: title + ' (Playlister)',
        description: description || 'Transferred from Spotify with Playlister.',
      },
      status: {
        privacyStatus: 'private', // Default to private
      },
    },
  });

  return res.data.id;
}

export async function logout(provider: 'spotify' | 'google') {
  const cookieStore = await cookies();
  cookieStore.delete(`${provider}_access_token`);
  cookieStore.delete(`${provider}_refresh_token`);
}

export async function searchAndAddYouTubeVideo(playlistId: string, trackName: string, artist: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('google_access_token')?.value;

  if (!token) return { success: false, error: 'Token missing' };

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: token });
  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  const query = `${artist} - ${trackName} official audio`;

  // 1. Search song on YouTube
  const searchRes = await youtube.search.list({
    part: ['id'],
    q: query,
    type: ['video'],
    maxResults: 1,
  });

  const videoId = searchRes.data.items?.[0]?.id?.videoId;

  if (!videoId) {
    return { success: false, error: 'Video not found.' };
  }

  // 2. Insert video into playlist
  await youtube.playlistItems.insert({
    part: ['snippet'],
    requestBody: {
      snippet: {
        playlistId: playlistId,
        resourceId: {
          kind: 'youtube#video',
          videoId: videoId,
        },
      },
    },
  });

  return { success: true, videoId };
}
