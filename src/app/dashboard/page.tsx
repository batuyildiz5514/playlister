import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ConverterClient from './ConverterClient';
import Navbar from '../../components/Navbar';

export const dynamic = 'force-dynamic';

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ url?: string }> }) {
  const cookieStore = await cookies();
  const spotifyToken = cookieStore.get('spotify_access_token')?.value;
  const googleToken = cookieStore.get('google_access_token')?.value;

  if (!spotifyToken || !googleToken) {
    redirect('/');
  }

  const resolvedParams = await searchParams;
  const initialUrl = resolvedParams?.url || '';

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <Navbar />
      <main className="p-8 mt-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
             <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-red-500 inline-block mb-4">
                Playlister
             </h1>
             <p className="text-gray-400 text-lg">Transfer Spotify playlists or albums to YouTube in seconds.</p>
          </div>
          
          <ConverterClient initialUrl={initialUrl} />
        </div>
      </main>
    </div>
  );
}
