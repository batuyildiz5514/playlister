import { cookies } from 'next/headers';
import Link from 'next/link';
import { logout } from './actions';
import Navbar from '../components/Navbar';

export const dynamic = 'force-dynamic';

async function getSpotifyProfile(token: string) {
  try {
    const res = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      name: data.display_name,
      avatar: data.images?.[0]?.url
    };
  } catch (e) { return null; }
}

async function getYouTubeProfile(token: string) {
  try {
    const res = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      return {
        name: data.items[0].snippet.title,
        avatar: data.items[0].snippet.thumbnails?.default?.url
      };
    }
    return null;
  } catch (e) { return null; }
}

export default async function Home() {
  const cookieStore = await cookies();
  const spotifyToken = cookieStore.get('spotify_access_token')?.value;
  const googleToken = cookieStore.get('google_access_token')?.value;

  const spotifyProfile = spotifyToken ? await getSpotifyProfile(spotifyToken) : null;
  const ytProfile = googleToken ? await getYouTubeProfile(googleToken) : null;

  const isSpotifyConnected = !!spotifyToken;
  const isGoogleConnected = !!googleToken;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      {isSpotifyConnected && <Navbar />}
      
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-3xl w-full text-center">
          {!isSpotifyConnected && (
             <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-red-500 mb-6 drop-shadow-lg">
               Playlister
             </h1>
          )}
          
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">
            Hoş Geldiniz
          </h2>
          <p className="text-gray-400 mb-12 text-lg">
            Spotify listelerinizi tek tıkla YouTube'a taşıyın. İşleme başlamak için hesaplarınızı bağlayın.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Spotify Kartı */}
            <div className={`p-8 rounded-3xl border-2 transition-all duration-300 shadow-xl flex flex-col items-center justify-center gap-4 ${
              isSpotifyConnected 
                ? 'bg-gray-900 border-green-500 shadow-green-500/20' 
                : 'bg-gray-900/50 border-gray-800 hover:border-green-500/50 hover:bg-gray-900'
            }`}>
              {isSpotifyConnected && spotifyProfile?.avatar ? (
                <img src={spotifyProfile.avatar} alt="Spotify Avatar" className="w-16 h-16 rounded-full border-2 border-green-500 shadow-lg object-cover" />
              ) : (
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${isSpotifyConnected ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                  S
                </div>
              )}
              <h3 className="text-2xl font-bold">Spotify</h3>
              
              {isSpotifyConnected ? (
                <div className="flex flex-col items-center gap-3 w-full mt-2">
                  <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-green-400 text-sm font-semibold truncate max-w-[150px]">
                      {spotifyProfile?.name || 'Bağlandı'}
                    </span>
                  </div>
                  <form action={async () => { 'use server'; await logout('spotify'); }}>
                    <button type="submit" className="text-gray-400 hover:text-red-400 text-sm font-medium transition-colors underline underline-offset-4">
                      Bağlantıyı Kes
                    </button>
                  </form>
                </div>
              ) : (
                <Link href="/api/auth/spotify" className="mt-2 w-full">
                  <button className="w-full py-3 px-6 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-transform hover:scale-105 active:scale-95">
                    Spotify'ı Bağla
                  </button>
                </Link>
              )}
            </div>

            {/* YouTube Kartı */}
            <div className={`p-8 rounded-3xl border-2 transition-all duration-300 shadow-xl flex flex-col items-center justify-center gap-4 ${
              isGoogleConnected 
                ? 'bg-gray-900 border-red-500 shadow-red-500/20' 
                : 'bg-gray-900/50 border-gray-800 hover:border-red-500/50 hover:bg-gray-900'
            }`}>
              {isGoogleConnected && ytProfile?.avatar ? (
                <img src={ytProfile.avatar} alt="YouTube Avatar" className="w-16 h-16 rounded-full border-2 border-red-500 shadow-lg object-cover" />
              ) : (
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${isGoogleConnected ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
                  Y
                </div>
              )}
              <h3 className="text-2xl font-bold">YouTube</h3>
              
              {isGoogleConnected ? (
                <div className="flex flex-col items-center gap-3 w-full mt-2">
                  <div className="flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                    <span className="text-red-400 text-sm font-semibold truncate max-w-[150px]">
                      {ytProfile?.name || 'Bağlandı'}
                    </span>
                  </div>
                  <form action={async () => { 'use server'; await logout('google'); }}>
                    <button type="submit" className="text-gray-400 hover:text-red-400 text-sm font-medium transition-colors underline underline-offset-4">
                      Bağlantıyı Kes
                    </button>
                  </form>
                </div>
              ) : (
                <Link href="/api/auth/google" className="mt-2 w-full">
                  <button className="w-full py-3 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-transform hover:scale-105 active:scale-95">
                    YouTube'u Bağla
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Devam Et Butonu */}
          <div className="h-24">
            {isSpotifyConnected && isGoogleConnected ? (
              <div className="transform transition-all duration-500 hover:-translate-y-1">
                <Link href="/dashboard">
                  <button className="px-10 py-4 bg-gradient-to-r from-green-500 to-red-500 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-green-500/20 transition-all hover:scale-105 hover:from-green-400 hover:to-red-400">
                    Dönüştürücüye Git 🚀
                  </button>
                </Link>
              </div>
            ) : (
              <div className="opacity-50">
                <p className="text-gray-500">Devam etmek için her iki platformu da bağlamalısınız.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
