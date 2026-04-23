import { Activity, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PressureDisplayProps {
  isPlaying: boolean;
  realSensorData?: number | null;
}

export function PressureDisplay({ isPlaying, realSensorData }: PressureDisplayProps) {
  const [pressure, setPressure] = useState(0);
  const [history, setHistory] = useState<number[]>(Array(20).fill(0));

  // 使用真实传感器数据（如果可用）
  useEffect(() => {
    if (realSensorData !== null && realSensorData !== undefined) {
      // ESP32 传感器值范围 0-1024，转换为 0-100
      const normalizedValue = Math.floor((realSensorData / 1024) * 100);
      setPressure(normalizedValue);
      setHistory(prev => [...prev.slice(1), normalizedValue]);
    }
  }, [realSensorData]);

  // 模拟数据（当没有真实传感器数据时）
  useEffect(() => {
    if (realSensorData !== null && realSensorData !== undefined) {
      return; // 如果有真实数据，不使用模拟数据
    }

    if (!isPlaying) {
      setPressure(0);
      return;
    }

    const interval = setInterval(() => {
      const newPressure = Math.floor(Math.random() * 40 + 30);
      setPressure(newPressure);
      setHistory(prev => [...prev.slice(1), newPressure]);
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, realSensorData]);

  const getPressureColor = (value: number) => {
    if (value < 30) return 'text-green-600';
    if (value < 60) return 'text-blue-600';
    return 'text-purple-600';
  };

  const getPressureLabel = (value: number) => {
    if (value < 30) return '輕度';
    if (value < 60) return '中度';
    return '強度';
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2>壓力感測顯示</h2>
        <Activity className="text-blue-500" size={24} />
      </div>

      <div className="space-y-8">
        {/* Current Pressure */}
        <div className="text-center">
          <div className={`text-6xl mb-4 transition-colors ${getPressureColor(pressure)}`}>
            {pressure}
          </div>
          <p className="text-gray-600">當前壓力值</p>
          <p className={`text-sm mt-2 ${getPressureColor(pressure)}`}>
            {getPressureLabel(pressure)}壓力
          </p>
        </div>

        {/* Pressure Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>壓力等級</span>
            <span>{pressure}%</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 transition-all duration-300"
              style={{ width: `${pressure}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>輕度</span>
            <span>中度</span>
            <span>強度</span>
          </div>
        </div>

        {/* History Chart */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp size={18} className="text-gray-600" />
            <p className="text-gray-700">壓力趨勢</p>
          </div>
          <div className="flex items-end justify-between h-32 gap-1">
            {history.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-blue-500 to-purple-600 rounded-t transition-all duration-300"
                style={{ height: `${value}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-gray-700">
            {realSensorData !== null && realSensorData !== undefined ? (
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>ESP32 感測器已連接</span>
              </span>
            ) : isPlaying ? (
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                <span>模擬感測器運作中</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span>等待開始播放或連接裝置</span>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
