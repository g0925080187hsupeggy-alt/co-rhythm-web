import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useState } from 'react';

interface MusicPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTrack: string;
}

export function MusicPlayer({ isPlaying, setIsPlaying, currentTrack }: MusicPlayerProps) {
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(45);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="mb-6">音樂播放器</h2>
      
      <div className="space-y-6">
        {/* Album Art */}
        <div className="relative aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white space-y-2">
              <div className="text-6xl">🎵</div>
              <p className="text-xl">{currentTrack}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{Math.floor(progress * 2.4 / 60)}:{String(Math.floor(progress * 2.4 % 60)).padStart(2, '0')}</span>
            <span>4:00</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
            <SkipBack size={24} className="text-gray-700" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full transition-all shadow-lg hover:shadow-xl"
          >
            {isPlaying ? (
              <Pause size={32} className="text-white" fill="white" />
            ) : (
              <Play size={32} className="text-white" fill="white" />
            )}
          </button>
          <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
            <SkipForward size={24} className="text-gray-700" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-4">
          <Volume2 size={20} className="text-gray-600" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume}%, #e5e7eb ${volume}%, #e5e7eb 100%)`
            }}
          />
          <span className="text-sm text-gray-600 w-10 text-right">{volume}%</span>
        </div>
      </div>
    </div>
  );
}
