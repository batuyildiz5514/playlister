'use client';
import { useState } from 'react';
import Link from 'next/link';
import { fetchSpotifyPlaylist } from '../actions';

export default function ProfilePlaylistsClient({ playlists }: { playlists: any[] }) {
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [playlistDetails, setPlaylistDetails] = useState<any>(null);

  const openPlaylist = async (playlist: any) => {
    setSelectedPlaylist(playlist);
    setLoading(true);
    setPlaylistDetails(null);
    try {
      const data = await fetchSpotifyPlaylist(playlist.external_urls?.spotify);
      setPlaylistDetails(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {playlists.map((playlist: any) => (
          <div 
            key={playlist.id} 
            className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10 group cursor-pointer"
            onClick={() => openPlaylist(playlist)}
          >
            <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
              {playlist.images?.[0] ? (
                <img src={playlist.images[0].url} alt={playlist.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-3xl">🎵</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-gray-800 text-white font-bold py-2 px-6 rounded-full text-sm transform translate-y-4 group-hover:translate-y-0 transition-all border border-gray-600">
                  İçeriği Gör
                </span>
              </div>
            </div>
            <h3 className="font-bold text-lg truncate mb-1" title={playlist.name}>{playlist.name}</h3>
            <p className="text-gray-400 text-xs mb-2">Oluşturan: {playlist.owner?.display_name}</p>
            {(playlist.tracks?.total && playlist.tracks.total > 0) ? (
              <p className="text-gray-500 text-xs mt-auto font-semibold">{playlist.tracks.total} Şarkı</p>
            ) : (
              <p className="text-gray-500 text-xs mt-auto font-semibold">&nbsp;</p>
            )}
          </div>
        ))}
      </div>

      {selectedPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setSelectedPlaylist(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-800 flex justify-between items-start">
              <div className="flex gap-4 items-center">
                {selectedPlaylist.images?.[0] && (
                  <img src={selectedPlaylist.images[0].url} className="w-16 h-16 rounded-md shadow-md" alt="" />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedPlaylist.name}</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {loading ? 'Şarkılar yükleniyor...' : (playlistDetails ? `${playlistDetails.tracks.length} Şarkı` : 'Yüklenemedi')}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedPlaylist(null)} className="text-gray-500 hover:text-white p-2">
                ✕
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : playlistDetails ? (
                <div className="space-y-3">
                  {playlistDetails.tracks.map((track: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                      <span className="text-gray-500 font-mono w-6 text-right">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-200 truncate">{track.name}</p>
                        <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-red-400 text-center">Şarkılar yüklenirken bir hata oluştu.</p>
              )}
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-900/50 rounded-b-2xl flex justify-end gap-3">
              <button 
                onClick={() => setSelectedPlaylist(null)}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Kapat
              </button>
              <Link 
                href={`/dashboard?url=${encodeURIComponent(selectedPlaylist.external_urls?.spotify || '')}`}
                className="bg-green-500 text-black font-bold py-2 px-6 rounded-lg text-sm hover:bg-green-400 hover:scale-105 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                Bu Listeyi Dönüştür
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
