import { Bluetooth, BluetoothConnected, Power, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useBluetooth } from '../hooks/useBluetooth';
import { useEffect, useState } from 'react';

interface BluetoothConnectionProps {
  onDataReceived?: (sensorValue: number) => void;
}

export function BluetoothConnection({ onDataReceived }: BluetoothConnectionProps) {
  const { isConnected, isConnecting, device, sensorData, error, connect, disconnect, sendCommand } = useBluetooth();
  const [ledState, setLedState] = useState(false);

  // 当收到传感器数据时，通知父组件
  useEffect(() => {
    if (sensorData && onDataReceived) {
      onDataReceived(sensorData.sensor);
    }
  }, [sensorData, onDataReceived]);

  const handleLedToggle = async () => {
    try {
      const command = ledState ? 'LED_OFF' : 'LED_ON';
      await sendCommand(command);
      setLedState(!ledState);
    } catch (err: any) {
      console.error('LED 控制失败:', err);
    }
  };

  const handleSetValue = async (value: number) => {
    try {
      await sendCommand(`SET:${value}`);
    } catch (err: any) {
      console.error('设置值失败:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {isConnected ? (
            <BluetoothConnected className="text-blue-600" size={24} />
          ) : (
            <Bluetooth className="text-gray-400" size={24} />
          )}
          <div>
            <h3>裝置連接</h3>
            <p className="text-sm text-gray-600">
              {isConnected ? `已連接: ${device?.name || 'ESP32-Product'}` : '未連接'}
            </p>
          </div>
        </div>
        {isConnected && (
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        )}
      </div>

      {/* 连接状态 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-xl flex items-start space-x-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm text-red-900 mb-1">連接錯誤</p>
            <p className="text-xs text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* 连接按钮 */}
      {!isConnected ? (
        <button
          onClick={connect}
          disabled={isConnecting}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Bluetooth size={20} />
          <span>{isConnecting ? '連接中...' : '連接 ESP32 裝置'}</span>
        </button>
      ) : (
        <div className="space-y-4">
          {/* 传感器数据显示 */}
          {sensorData && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">最新感測值</span>
                <CheckCircle className="text-green-500" size={18} />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl text-blue-600">{sensorData.sensor}</span>
                <span className="text-sm text-gray-500">/ 1024</span>
              </div>
              <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${(sensorData.sensor / 1024) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* LED 控制 */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-700 mb-3">設備控制</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleLedToggle}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                  ledState
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Zap size={18} />
                <span>LED {ledState ? 'ON' : 'OFF'}</span>
              </button>
              
              <button
                onClick={disconnect}
                className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all"
              >
                <Power size={18} />
                <span>斷開</span>
              </button>
            </div>
          </div>

          {/* 快速设置 */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-700 mb-3">快速設定</p>
            <div className="grid grid-cols-4 gap-2">
              {[128, 256, 512, 768].map((value) => (
                <button
                  key={value}
                  onClick={() => handleSetValue(value)}
                  className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-sm"
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 使用说明 */}
      {!isConnected && (
        <div className="mt-4 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-gray-700 mb-2">使用說明：</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• 請確保 ESP32 裝置已開啟並正在廣播</li>
            <li>• 點擊連接按鈕並選擇「ESP32-Product」</li>
            <li>• 連接後將自動接收感測器數據</li>
            <li>• 支援 Chrome、Edge、Opera 瀏覽器</li>
          </ul>
        </div>
      )}
    </div>
  );
}
