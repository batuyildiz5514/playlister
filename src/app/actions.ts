'use server';

import { cookies } from 'next/headers';
import { google } from 'googleapis';

export async function fetchSpotifyPlaylist(playlistUrl: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('spotify_access_token')?.value;

  if (!token) {
    throw new Error('Spotify token bulunamadı. Lütfen tekrar giriş yapın.');
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
    throw new Error('Geçersiz Spotify linki. Lütfen bir çalma listesi veya albüm linki girin.');
  }

  if (isAlbum) {
    // ALBÜM İŞLEMLERİ
    const res = await fetch(`https://api.spotify.com/v1/albums/${spotifyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error('Albüm bulunamadı. Link hatalı olabilir.');
    }

    const albumData = await res.json();

    // Albüm şarkıları için sayfalama (pagination)
    let allAlbumItems: any[] = [];
    let albumTracksUrl = `https://api.spotify.com/v1/albums/${spotifyId}/tracks?limit=50`;
    
    while (albumTracksUrl) {
      const pageRes = await fetch(albumTracksUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pageData = await pageRes.json();
      if (pageData.error) break;
      
      allAlbumItems.push(...(pageData.items || []));
      albumTracksUrl = pageData.next; // null ise döngü biter
    }

    // Albümlerde track yapısı direkt gelir (item.track şeklinde sarmalanmaz)
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
      description: albumData.label ? `${albumData.label} etiketiyle yayınlandı` : 'Spotify Albümü',
      image: albumData.images?.[0]?.url,
      totalTracks: albumData.total_tracks || trackList.length,
      owner: albumData.artists?.[0]?.name || 'Bilinmeyen Sanatçı',
      tracks: trackList
    };
  } else {
    // ÇALMA LİSTESİ İŞLEMLERİ
    const res = await fetch(`https://api.spotify.com/v1/playlists/${spotifyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      if (res.status === 404) throw new Error('Çalma listesi bulunamadı. Gizli olabilir veya link hatalı.');
      throw new Error('Spotify API hatası.');
    }

    const playlistData = await res.json();
    
    // Playlist şarkıları için sayfalama (pagination)
    let allPlaylistItems: any[] = [];
    let playlistTracksUrl = `https://api.spotify.com/v1/playlists/${spotifyId}/items?limit=100`;
    
    while (playlistTracksUrl) {
      const pageRes = await fetch(playlistTracksUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pageData = await pageRes.json();
      
      if (pageData.error) {
        if (allPlaylistItems.length === 0) {
          throw new Error('Spotify API (Tracks) Hatası: ' + (pageData.error.message || JSON.stringify(pageData.error)));
        }
        break; // Hata verirse (örneğin rate limit) olanı kullan
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
    throw new Error('Google token bulunamadı. Lütfen YouTube hesabınızı bağlayın.');
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: token });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  const res = await youtube.playlists.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: title + ' (Playlister)',
        description: description || 'Playlister ile Spotify\'dan aktarıldı.',
      },
      status: {
        privacyStatus: 'private', // Varsayılan olarak gizli oluşturuyoruz
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

  // 1. Şarkıyı YouTube'da ara
  const searchRes = await youtube.search.list({
    part: ['id'],
    q: query,
    type: ['video'],
    maxResults: 1,
  });

  const videoId = searchRes.data.items?.[0]?.id?.videoId;

  if (!videoId) {
    return { success: false, error: 'Video bulunamadı.' };
  }

  // 2. Bulunan videoyu çalma listesine ekle
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
