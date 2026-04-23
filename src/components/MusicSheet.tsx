import { Music, Play, Download, X, Pause, Volume2, Info } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Note {
  pitch: string;
  duration: number;
  time: number;
}

interface MusicSheetProps {
  acupoint: {
    id: number;
    name: string;
    description: string;
    notes: Note[];
    tempo: number;
    key: string;
  };
  onClose: () => void;
  onPlay?: () => void;
}

export function MusicSheet({ acupoint, onClose, onPlay }: MusicSheetProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
  const [volume, setVolume] = useState(70);
  const audioContextRef = useRef<AudioContext | null>(null);

  // 音符頻率對照表 (Hz)
  const noteFrequencies: Record<string, number> = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
    'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46,
    'G5': 783.99, 'A5': 880.00, 'B5': 987.77
  };

  const playNote = (frequency: number, duration: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(volume / 100 * 0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  };

  const handlePlay = async () => {
    setIsPlaying(true);
    onPlay?.();
    
    const beatDuration = 60 / acupoint.tempo;
    
    for (let i = 0; i < acupoint.notes.length; i++) {
      setCurrentNoteIndex(i);
      const note = acupoint.notes[i];
      const frequency = noteFrequencies[note.pitch];
      const duration = beatDuration * note.duration;
      
      if (frequency) {
        playNote(frequency, duration);
      }
      
      await new Promise(resolve => setTimeout(resolve, duration * 1000));
    }
    
    setCurrentNoteIndex(-1);
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentNoteIndex(-1);
  };

  const handleDownload = () => {
    const content = `
EmoEase 穴位音樂曲譜
====================

穴位名稱: ${acupoint.name}
療效: ${acupoint.description}
調性: ${acupoint.key}
速度: ${acupoint.tempo} BPM

音符序列:
${acupoint.notes.map((note, i) => `${i + 1}. ${note.pitch} (${note.duration}拍)`).join('\n')}

建議使用方法:
1. 配合穴位按摩聆聽
2. 每次療程 3-5 分鐘
3. 保持放鬆的心態
4. 可重複播放多次

---
由 EmoEase 系統生成
    `.trim();
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${acupoint.name}_音樂曲譜.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Music className="text-white" size={24} />
              </div>
              <div>
                <h2>{acupoint.name} 穴位音樂</h2>
                <p className="text-sm text-gray-600">{acupoint.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Music Info */}
        <div className="px-6 py-4 bg-blue-50 border-b">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-sm text-gray-600">調性：</span>
              <span className="text-gray-900">{acupoint.key}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">速度：</span>
              <span className="text-gray-900">{acupoint.tempo} BPM</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">音符數：</span>
              <span className="text-gray-900">{acupoint.notes.length}</span>
            </div>
          </div>
        </div>

        {/* Music Sheet Display */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="relative bg-white p-8 rounded-xl border-2 border-gray-200">
            <div className="space-y-8">
              {/* 五線譜區域 */}
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900 flex items-center space-x-2">
                    <span>📊</span>
                    <span>五線譜</span>
                  </h3>
                  <div className="text-sm text-gray-600">
                    {acupoint.key} | {acupoint.tempo} BPM
                  </div>
                </div>
                
                <div className="relative bg-gray-50 p-8 rounded-xl border border-gray-300">
                  {/* 五線 */}
                  <div className="relative h-40">
                    {[0, 1, 2, 3, 4].map((line) => (
                      <div
                        key={line}
                        className="absolute w-full border-t-2 border-gray-600"
                        style={{ top: `${line * 20 + 10}%` }}
                      ></div>
                    ))}
                    
                    {/* 高音譜號 */}
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <div className="text-6xl text-gray-800" style={{ fontFamily: 'serif' }}>
                        𝄞
                      </div>
                    </div>

                    {/* 音符 */}
                    <div className="absolute inset-0 pl-24 pr-8">
                      {acupoint.notes.map((note, index) => {
                        const notePositions: Record<string, number> = {
                          'C4': 90, 'D4': 85, 'E4': 75, 'F4': 70, 'G4': 60,
                          'A4': 50, 'B4': 40, 'C5': 30, 'D5': 25, 'E5': 15,
                          'F5': 10, 'G5': 5
                        };
                        const position = notePositions[note.pitch] || 50;
                        const isPlaying = currentNoteIndex === index;
                        
                        return (
                          <div
                            key={index}
                            className="absolute transition-all duration-200"
                            style={{
                              left: `${index * 80 + 20}px`,
                              top: `${position}%`,
                              transform: 'translateY(-50%)'
                            }}
                          >
                            {/* 音符頭 */}
                            <div className="relative">
                              <div className={`w-8 h-6 rounded-full transition-all ${
                                isPlaying 
                                  ? 'bg-blue-600 scale-125 shadow-lg shadow-blue-400' 
                                  : note.duration >= 2 
                                  ? 'border-3 border-gray-800 bg-white' 
                                  : 'bg-gray-800'
                              } transform -rotate-12`}></div>
                              
                              {/* 符桿 */}
                              {note.duration < 2 && (
                                <div className={`absolute right-0 top-0 w-1 h-10 -mt-10 ${
                                  isPlaying ? 'bg-blue-600' : 'bg-gray-800'
                                }`}></div>
                              )}
                              
                              {/* 音符名稱標籤 */}
                              <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap ${
                                isPlaying 
                                  ? 'bg-blue-600 text-white font-bold' 
                                  : 'bg-gray-200 text-gray-700'
                              }`}>
                                {note.pitch}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 音符位置詳解 */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900 flex items-center space-x-2">
                    <span>🎹</span>
                    <span>音符位置詳解</span>
                  </h3>
                  <div className="text-xs text-gray-500">共 {acupoint.notes.length} 個音符</div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {acupoint.notes.map((note, index) => {
                    const isPlaying = currentNoteIndex === index;
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          isPlaying 
                            ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`text-2xl mb-2 ${isPlaying ? 'text-blue-600 font-bold' : 'text-gray-700'}`}>
                            {note.pitch}
                          </div>
                          <div className="text-xs text-gray-500 mb-2">第 {index + 1} 音</div>
                          <div className="flex justify-center space-x-1">
                            {Array.from({ length: note.duration }).map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-3 h-3 rounded-full ${
                                  isPlaying ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                                }`}
                              ></div>
                            ))}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {note.duration} 拍
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 節奏型態視覺化 */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900 flex items-center space-x-2">
                    <span>🎵</span>
                    <span>節奏型態視覺化</span>
                  </h3>
                  <div className="text-xs text-gray-500">
                    總時長: {acupoint.notes.reduce((sum, n) => sum + n.duration, 0)} 拍
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                  <div className="flex items-end space-x-2 h-32">
                    {acupoint.notes.map((note, index) => {
                      const isPlaying = currentNoteIndex === index;
                      const noteFreq = noteFrequencies[note.pitch] || 440;
                      const height = (noteFreq / 1000) * 100;
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className={`w-full rounded-t-lg transition-all duration-300 ${
                              isPlaying 
                                ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-lg' 
                                : 'bg-gradient-to-t from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500'
                            }`}
                            style={{ 
                              height: `${height}%`,
                              transform: isPlaying ? 'scaleY(1.1)' : 'scaleY(1)'
                            }}
                          ></div>
                          <div className="mt-2 text-xs text-center">
                            <div className={`${isPlaying ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
                              {note.pitch}
                            </div>
                            <div className="text-gray-400 text-[10px]">
                              {noteFreq.toFixed(0)}Hz
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-gray-500">
                    <span>低頻</span>
                    <span>高頻</span>
                  </div>
                </div>
              </div>

              {/* 療效說明 */}
              <div className="border-t pt-6">
                <div className="flex items-center mb-4">
                  <h3 className="text-gray-900 flex items-center space-x-2">
                    <span>💊</span>
                    <span>療效說明與使用指南</span>
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 穴位功效 */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <h4 className="text-purple-900">穴位主治</h4>
                    </div>
                    <p className="text-gray-700 mb-3">{acupoint.description}</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start space-x-2">
                        <span className="text-purple-500">✓</span>
                        <span>促進穴位周圍氣血循環</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-purple-500">✓</span>
                        <span>通過音頻共振加強刺激效果</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-purple-500">✓</span>
                        <span>舒緩相關經絡的緊張狀態</span>
                      </div>
                    </div>
                  </div>

                  {/* 使用方法 */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h4 className="text-blue-900">使用方法</h4>
                    </div>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-600 font-bold">1.</span>
                        <span>找到{acupoint.name}穴位準確位置</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-600 font-bold">2.</span>
                        <span>播放音樂並調整音量至舒適</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-600 font-bold">3.</span>
                        <span>用指腹輕柔按壓穴位</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-600 font-bold">4.</span>
                        <span>配合音樂節奏調節按壓力度</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-600 font-bold">5.</span>
                        <span>每次療程建議 3-5 分鐘</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 注意事項 */}
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium text-yellow-900 mb-1">注意事項</p>
                      <p>請在安靜放鬆的環境中使用，避免過度用力按壓。如有不適請立即停止。孕婦、心臟病患者使用前請諮詢醫師。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-gray-50">
          {/* Volume Control */}
          <div className="mb-4 flex items-center space-x-4">
            <Volume2 className="text-gray-600" size={20} />
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume}%, #e5e7eb ${volume}%, #e5e7eb 100%)`
                }}
              />
            </div>
            <span className="text-sm text-gray-600 w-12 text-right">{volume}%</span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 flex items-center space-x-2">
              <span>💡</span>
              <span>配合穴位按摩聆聽效果更佳</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-blue-400 transition-all"
              >
                <Download size={18} />
                <span>📥 下載曲譜</span>
              </button>
              {!isPlaying ? (
                <button
                  onClick={handlePlay}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Play size={20} fill="white" />
                  <span>▶️ 播放音樂</span>
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all shadow-lg"
                >
                  <Pause size={20} />
                  <span>⏸ 停止播放</span>
                </button>
              )}
            </div>
          </div>

          {/* Playing Status */}
          {isPlaying && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-900">
                正在播放第 {currentNoteIndex + 1}/{acupoint.notes.length} 音符
              </span>
              <div className="flex-1 bg-blue-200 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${((currentNoteIndex + 1) / acupoint.notes.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
