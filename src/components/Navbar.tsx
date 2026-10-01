import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function Navbar() {
  const cookieStore = await cookies();
  const spotifyToken = cookieStore.get('spotify_access_token')?.value;

  if (!spotifyToken) return null;

  // Profil resmini çekmek için basit bir istek atalım
  let userAvatar = '';
  let userName = 'Profil';

  try {
    const res = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${spotifyToken}` }
    });
    if (res.ok) {
      const data = await res.json();
      userName = data.display_name || 'Profil';
      if (data.images && data.images.length > 0) {
        userAvatar = data.images[0].url;
      }
    }
  } catch (e) {}

  return (
    <nav className="w-full bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-red-500 hover:scale-105 transition-transform">
          Playlister
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors font-medium">
            Dönüştürücü
          </Link>
          <Link href="/profile" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors font-medium">
            {userAvatar ? (
              <img src={userAvatar} alt="Profil" className="w-8 h-8 rounded-full border border-gray-700" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">👤</div>
            )}
            {userName}
          </Link>
        </div>
      </div>
    </nav>
  );
}
