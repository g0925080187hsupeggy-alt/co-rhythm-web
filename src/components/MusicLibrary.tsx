import { Play, Download, Heart, Music } from 'lucide-react';

interface MusicLibraryProps {
  setCurrentTrack: (track: string) => void;
  setCurrentPage: (page: string) => void;
}

export function MusicLibrary({ setCurrentTrack, setCurrentPage }: MusicLibraryProps) {
  const musicTracks = [
    { id: 1, name: '寧靜鋼琴', category: '鍵盤系列', duration: '4:32', type: 'online' },
    { id: 2, name: '舒緩弦樂', category: '弦樂系列', duration: '5:18', type: 'online' },
    { id: 3, name: '禪意笛聲', category: '管樂系列', duration: '6:45', type: 'download' },
    { id: 4, name: '節奏鼓點', category: '打擊系列', duration: '3:52', type: 'online' },
    { id: 5, name: '冥想豎琴', category: '弦樂系列', duration: '7:20', type: 'download' },
    { id: 6, name: '輕柔薩克斯', category: '管樂系列', duration: '4:15', type: 'online' },
    { id: 7, name: '古典鋼琴', category: '鍵盤系列', duration: '5:03', type: 'download' },
    { id: 8, name: '靈動木琴', category: '打擊系列', duration: '3:28', type: 'online' },
  ];

  const handlePlay = (track: string) => {
    setCurrentTrack(track);
    setCurrentPage('play');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-4">音樂庫</h1>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
            全部
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors border border-gray-300">
            線上音樂
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors border border-gray-300">
            下載音樂
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {musicTracks.map((track) => (
          <div
            key={track.id}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Music size={64} className="text-white/30" />
              </div>
              <div className="absolute top-4 right-4">
                {track.type === 'download' && (
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs">
                    已下載
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="mb-2">{track.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{track.category}</p>
              <p className="text-sm text-gray-500 mb-4">{track.duration}</p>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handlePlay(track.name)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  <Play size={16} fill="white" />
                  <span>播放</span>
                </button>
                
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Heart size={18} className="text-gray-600" />
                  </button>
                  {track.type === 'online' && (
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Download size={18} className="text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Music size={24} />
            </div>
            <h2 className="text-white">線上音樂</h2>
          </div>
          <p className="text-blue-100 mb-4">
            即時串流播放，隨時享受最新的療癒音樂，無需佔用儲存空間
          </p>
          <p className="text-sm text-blue-100">當前曲目：50+ 首</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Download size={24} />
            </div>
            <h2 className="text-white">下載音樂</h2>
          </div>
          <p className="text-purple-100 mb-4">
            下載您喜愛的音樂，離線也能隨時播放，不受網路限制
          </p>
          <p className="text-sm text-purple-100">已下載：12 首</p>
        </div>
      </div>
    </div>
  );
}
