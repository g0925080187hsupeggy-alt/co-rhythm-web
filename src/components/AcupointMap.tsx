import { useState } from 'react';
import { Target, Info, Music } from 'lucide-react';
import { MusicSheet } from './MusicSheet';

interface AcupointData {
  id: number;
  name: string;
  position: { x: number; y: number };
  description: string;
  notes: Array<{ pitch: string; duration: number; time: number }>;
  tempo: number;
  key: string;
}

export function AcupointMap() {
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const [showMusicSheet, setShowMusicSheet] = useState<number | null>(null);

  // 穴位數據配置 - 包含音樂曲譜信息
  const acupoints: AcupointData[] = [
    {
      id: 1,
      name: '百會',
      position: { x: 50, y: 8 },
      description: '頭頂中央，清頭目、安神定志',
      notes: [
        { pitch: 'C5', duration: 2, time: 0 },
        { pitch: 'E5', duration: 2, time: 0.5 },
        { pitch: 'G4', duration: 1, time: 1.0 },
        { pitch: 'C5', duration: 2, time: 1.5 },
      ],
      tempo: 60,
      key: 'C Major'
    },
    {
      id: 2,
      name: '風池',
      position: { x: 65, y: 14 },
      description: '後頸部，祛風解表、清頭目',
      notes: [
        { pitch: 'D4', duration: 1, time: 0 },
        { pitch: 'F4', duration: 1, time: 0.5 },
        { pitch: 'A4', duration: 2, time: 1.0 },
        { pitch: 'D5', duration: 1, time: 1.5 },
      ],
      tempo: 72,
      key: 'D Minor'
    },
    {
      id: 3,
      name: '太庸',
      position: { x: 20, y: 25 },
      description: '肩膀外側，舒筋活絡',
      notes: [
        { pitch: 'E4', duration: 1, time: 0 },
        { pitch: 'G4', duration: 1, time: 0.5 },
        { pitch: 'B4', duration: 2, time: 1.0 },
        { pitch: 'E5', duration: 1, time: 1.5 },
      ],
      tempo: 80,
      key: 'E Minor'
    },
    {
      id: 4,
      name: '合谷',
      position: { x: 70, y: 32 },
      description: '虎口處，鎮痛止痛、調和氣血',
      notes: [
        { pitch: 'G4', duration: 2, time: 0 },
        { pitch: 'B4', duration: 1, time: 0.5 },
        { pitch: 'D5', duration: 1, time: 1.0 },
        { pitch: 'G4', duration: 2, time: 1.5 },
      ],
      tempo: 90,
      key: 'G Major'
    },
    {
      id: 5,
      name: '氣海',
      position: { x: 50, y: 42 },
      description: '下腹部，培補元氣、調理沖任',
      notes: [
        { pitch: 'A4', duration: 2, time: 0 },
        { pitch: 'C5', duration: 2, time: 0.5 },
        { pitch: 'E5', duration: 1, time: 1.0 },
        { pitch: 'A4', duration: 2, time: 1.5 },
      ],
      tempo: 66,
      key: 'A Minor'
    },
    {
      id: 6,
      name: '足三里',
      position: { x: 35, y: 72 },
      description: '膝下外側，健脾和胃、調補氣血',
      notes: [
        { pitch: 'F4', duration: 1, time: 0 },
        { pitch: 'A4', duration: 1, time: 0.5 },
        { pitch: 'C5', duration: 2, time: 1.0 },
        { pitch: 'F4', duration: 1, time: 1.5 },
      ],
      tempo: 75,
      key: 'F Major'
    },
    {
      id: 7,
      name: '神闕',
      position: { x: 60, y: 78 },
      description: '肚臍處，溫陽救逆、健脾和胃',
      notes: [
        { pitch: 'C4', duration: 2, time: 0 },
        { pitch: 'E4', duration: 2, time: 0.5 },
        { pitch: 'G4', duration: 1, time: 1.0 },
        { pitch: 'C4', duration: 2, time: 1.5 },
      ],
      tempo: 60,
      key: 'C Major'
    },
  ];

  const selectedAcupoint = showMusicSheet !== null 
    ? acupoints.find(p => p.id === showMusicSheet) 
    : null;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2>穴道音樂地圖</h2>
        <Target className="text-purple-500" size={24} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Body Map with Image */}
        <div className="lg:col-span-2">
          <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-blue-50 to-purple-50">
            {/* Acupoint Image */}
            <img 
              src="https://via.placeholder.com/500x500" 
              alt="穴位圖" 
              className="w-full h-auto"
            />

            {/* Interactive Points */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {acupoints.map((point) => (
                <g key={point.id}>
                  {/* Clickable area */}
                  <circle
                    cx={point.position.x}
                    cy={point.position.y}
                    r="3"
                    className={`cursor-pointer transition-all ${
                      activePoint === point.id
                        ? 'fill-purple-600 animate-pulse'
                        : 'fill-cyan-500 hover:fill-purple-500'
                    }`}
                    onClick={() => setActivePoint(point.id)}
                    onMouseEnter={() => setActivePoint(point.id)}
                    onMouseLeave={() => setActivePoint(null)}
                  />
                  
                  {/* Ripple effect on hover */}
                  {activePoint === point.id && (
                    <circle
                      cx={point.position.x}
                      cy={point.position.y}
                      r="3"
                      className="fill-purple-400 opacity-50 animate-ping"
                    />
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <Info size={18} />
            <p>穴道資訊</p>
          </div>

          {activePoint !== null ? (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    <h3 className="text-purple-900">
                      {acupoints.find(p => p.id === activePoint)?.name}
                    </h3>
                  </div>
                  <Music className="text-purple-600" size={20} />
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  {acupoints.find(p => p.id === activePoint)?.description}
                </p>
              </div>

              {/* Music Info */}
              <div className="border-t border-purple-200 pt-4">
                <p className="text-xs text-gray-600 mb-3">專屬音樂曲譜</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-white rounded-lg p-2">
                    <span className="text-xs text-gray-500">調性</span>
                    <p className="text-sm text-gray-900">
                      {acupoints.find(p => p.id === activePoint)?.key}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <span className="text-xs text-gray-500">速度</span>
                    <p className="text-sm text-gray-900">
                      {acupoints.find(p => p.id === activePoint)?.tempo} BPM
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMusicSheet(activePoint)}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  <Music size={18} />
                  <span>查���完整曲譜</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
              <Music className="mx-auto mb-3 text-gray-400" size={32} />
              <p className="text-sm">點擊穴位查看對應的音樂曲譜</p>
            </div>
          )}

          {/* Legend */}
          <div className="space-y-3 pt-4 border-t">
            <p className="text-sm text-gray-700">操作說明：</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span className="text-sm text-gray-600">可點擊穴位</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                <span className="text-sm text-gray-600">已選擇穴位</span>
              </div>
              <div className="flex items-center space-x-3">
                <Music className="text-purple-600" size={16} />
                <span className="text-sm text-gray-600">含音樂曲譜</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Music Sheet Modal */}
      {selectedAcupoint && (
        <MusicSheet
          acupoint={selectedAcupoint}
          onClose={() => setShowMusicSheet(null)}
          onPlay={() => console.log('播放音樂:', selectedAcupoint.name)}
        />
      )}
    </div>
  );
}