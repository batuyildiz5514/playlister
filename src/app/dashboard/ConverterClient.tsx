'use client';

import { useState, useEffect } from 'react';
import { fetchSpotifyPlaylist, createYouTubePlaylist, searchAndAddYouTubeVideo } from '../actions';

export default function ConverterClient({ initialUrl = '' }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [playlist, setPlaylist] = useState<any>(null);
  
  // Dönüştürme durumu
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [failedTracks, setFailedTracks] = useState<string[]>([]);
  const [successYtLink, setSuccessYtLink] = useState('');

  useEffect(() => {
    if (initialUrl) {
      // url state is already set to initialUrl, we just need to trigger the search
      // To avoid e.preventDefault issues, we can extract the core search logic
      performSearch(initialUrl);
    }
  }, [initialUrl]);

  const performSearch = async (searchUrl: string) => {
    setLoading(true);
    setError('');
    setPlaylist(null);
    setConverting(false);
    setProgress(0);
    setFailedTracks([]);
    setSuccessYtLink('');

    try {
      const data = await fetchSpotifyPlaylist(searchUrl);
      setPlaylist(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    e?.preventDefault?.();
    if (!url) return;
    performSearch(url);
  };

  const startConversion = async () => {
    if (!playlist || !playlist.tracks || playlist.tracks.length === 0) {
      setError('No tracks found to convert.');
      return;
    }

    setConverting(true);
    setStatusText('Creating YouTube playlist...');
    
    try {
      const ytPlaylistId = await createYouTubePlaylist(playlist.name, playlist.description);
      
      if (!ytPlaylistId) throw new Error('Failed to create YouTube playlist.');
      
      setSuccessYtLink(`https://www.youtube.com/playlist?list=${ytPlaylistId}`);
      
      let failed: string[] = [];
      const chunkSize = 5; // 5 tracks processed concurrently
      let completedCount = 0;
      
      for (let i = 0; i < playlist.tracks.length; i += chunkSize) {
        const chunk = playlist.tracks.slice(i, i + chunkSize);
        
        setStatusText(`⚡ Transferring in parallel... (${completedCount}/${playlist.tracks.length})`);
        
        // Process tracks concurrently
        const results = await Promise.all(chunk.map(async (track: any) => {
          try {
            const result = await searchAndAddYouTubeVideo(ytPlaylistId, track.name, track.artist);
            return result.success ? null : `${track.artist} - ${track.name}`;
          } catch (e) {
            return `${track.artist} - ${track.name}`;
          }
        }));
        
        results.forEach(res => {
          if (res) failed.push(res);
        });
        
        completedCount += chunk.length;
        setProgress(Math.round((completedCount / playlist.tracks.length) * 100));
      }
      
      setStatusText('Transfer Completed! 🎉');
      setFailedTracks(failed);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during conversion.');
      setStatusText('Transfer Cancelled.');
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Paste Spotify Playlist or Album Link (e.g. https://open.spotify.com/album/...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e as any)}
          disabled={loading || converting}
          className="flex-1 bg-gray-900 border border-gray-700 text-white p-4 rounded-xl focus:outline-none focus:border-green-500 transition-colors text-lg"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading || converting}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-400 text-black font-bold py-4 px-8 rounded-xl transition-all text-lg"
        >
          {loading ? 'Searching...' : 'Find Playlist'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      {playlist && (
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl flex flex-col items-center">
          <div className="flex flex-col md:flex-row gap-8 items-center w-full mb-8">
            {playlist.image ? (
              <img src={playlist.image} alt={playlist.name} className="w-48 h-48 object-cover rounded-xl shadow-2xl" />
            ) : (
              <div className="w-48 h-48 bg-gray-800 rounded-xl flex items-center justify-center shadow-2xl">
                <span className="text-6xl">🎵</span>
              </div>
            )}
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">{playlist.name}</h2>
              <p className="text-gray-400 mb-2">Created by: {playlist.owner}</p>
              <p className="text-blue-400 font-semibold text-lg mb-6">{playlist.tracks.length} Tracks to Transfer</p>
              
              {!converting && progress === 0 && !successYtLink && (
                <button 
                  onClick={startConversion}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-red-500/30 text-lg flex items-center justify-center gap-2 mx-auto md:mx-0"
                >
                  <span>▶️</span> Start Transfer to YouTube
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar & Status */}
          {(converting || progress > 0) && (
            <div className="w-full bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 font-medium">{statusText}</span>
                <span className="text-blue-400 font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-4 mb-6 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-red-500 h-4 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {successYtLink && progress === 100 && (
                <div className="text-center mt-4">
                  <a href={successYtLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors">
                    Open on YouTube 🎧
                  </a>
                </div>
              )}

              {failedTracks.length > 0 && progress === 100 && (
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-xl">
                  <h4 className="text-yellow-400 font-bold mb-2">⚠️ Unresolved Tracks ({failedTracks.length}):</h4>
                  <ul className="text-gray-400 text-sm list-disc pl-5 max-h-32 overflow-y-auto">
                    {failedTracks.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
