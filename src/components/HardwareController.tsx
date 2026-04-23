import { useEffect, useRef, useState } from 'react';
import { useBluetooth } from '../hooks/useBluetooth';

interface HardwareControllerProps {
  onDataReceived?: (value: number) => void;
}

export function HardwareController({ onDataReceived }: HardwareControllerProps) {
  const { connect, isConnected, sensorData, error } = useBluetooth();
  const [log, setLog] = useState<string>('等待連接...');
  
  // 引用您的 mp3 檔案
  const audioRef = useRef(new Audio('/sounds/note.mp3')); 
  // 用來記錄「停止播放」的計時器
  const stopTimerRef = useRef<number | null>(null);

  // 音階頻率 (讓同一個檔案發出不同高低的聲音)
  const scaleRates = [1.0, 1.122, 1.26, 1.335, 1.498, 1.682, 1.888];
  const noteNames = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];

  useEffect(() => {
    if (sensorData) {
      // 1. 計算要播哪個音 (1~7)
      const noteIndex = (sensorData.sensor - 1) % 7; 
      const rate = scaleRates[noteIndex] || 1.0;
      const noteName = noteNames[noteIndex] || 'Do';

      setLog(`🎵 播放單音: ${noteName}`);
      
      // 2. 清除之前的計時器 (如果有人連按，要重新計時)
      if (stopTimerRef.current) {
        clearTimeout(stopTimerRef.current);
      }

      // 3. 設定音高並播放
      const audio = audioRef.current;
      audio.playbackRate = rate;
      if (window.navigator.userAgent.indexOf("Chrome") > -1) {
          audio.preservesPitch = false; // 讓聲音變尖
      }
      
      audio.currentTime = 0; // 每次都從頭播
      audio.play().catch(e => console.error("播放失敗:", e));

      // 4. 【關鍵】設定 1 秒後強制停止 (把長歌變短音)
      // 您可以修改 1000 這個數字： 500 = 0.5秒(更短促), 2000 = 2秒(長一點)
      stopTimerRef.current = window.setTimeout(() => {
        audio.pause(); 
        audio.currentTime = 0; // 回到開頭
      }, 500); // 這裡設定 500 毫秒 (0.5秒) 自動卡歌

      // 5. 更新儀表板
      if (onDataReceived) {
        onDataReceived(sensorData.sensor);
      }
    }
  }, [sensorData, onDataReceived]);

  return (
    <div className="p-6 border rounded-2xl shadow-lg bg-white w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">🎹 互動單音控制器</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
          isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {isConnected ? '已連接' : '未連接'}
        </span>
      </div>

      <div className="space-y-4">
        <button
          onClick={connect}
          disabled={isConnected}
          className={`w-full py-3 px-4 rounded-xl text-white font-bold transition-all shadow-md ${
            isConnected 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 cursor-default' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          {isConnected ? '裝置就緒 (請觸摸傳感器)' : '🔗 連接 ESP32'}
        </button>

        <div className="text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
           💡 提示：此模式會將音樂裁切為短音，模擬樂器效果。
           <br/>
           目前設定長度：<strong>0.8 秒</strong>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}
        
        {isConnected && (
          <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs text-center">
             <p className="text-lg animate-pulse">{log}</p>
          </div>
        )}
      </div>
    </div>
  );
}