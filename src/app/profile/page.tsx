import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import ProfilePlaylistsClient from './ProfilePlaylistsClient';

export const dynamic = 'force-dynamic';

async function getUserPlaylists(token: string) {
  try {
    // 1. Kullanıcının ID'sini al
    const userRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const userData = await userRes.json();
    const userId = userData.id;

    // 2. Çalma listelerini al
    const res = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return [];
    const data = await res.json();
    
    // 3. Sadece sahibinin kullanıcı olduğu listeleri filtrele
    return data.items?.filter((p: any) => p.owner?.id === userId) || [];
  } catch (e) {
    return [];
  }
}

export default async function Profile() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  if (host.startsWith('localhost')) {
    redirect('http://127.0.0.1:3000/profile');
  }

  const cookieStore = await cookies();
  const spotifyToken = cookieStore.get('spotify_access_token')?.value;

  if (!spotifyToken) {
    redirect('/');
  }

  const playlists = await getUserPlaylists(spotifyToken);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <Navbar />
      <main className="p-8 mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Playlists</h1>
              <p className="text-gray-400">Playlists in your Spotify account. Inspect contents and transfer them to YouTube.</p>
            </div>
            <Link 
              href="/?manage=true" 
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-700"
            >
              Manage Accounts / Disconnect
            </Link>
          </div>

          {playlists.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 p-12 rounded-2xl text-center">
              <p className="text-xl text-gray-400">No playlists found in your Spotify account.</p>
            </div>
          ) : (
            <ProfilePlaylistsClient playlists={playlists} />
          )}
        </div>
      </main>
    </div>
  );
}
