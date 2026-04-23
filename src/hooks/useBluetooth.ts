import { useState, useCallback } from 'react';

const SERVICE_UUID = '0000feed-0000-1000-8000-00805f9b34fb';
const CHAR_CONTROL_UUID = '0000beef-0000-1000-8000-00805f9b34fb';
const CHAR_SENSOR_UUID = '0000cafe-0000-1000-8000-00805f9b34fb';

export interface SensorData {
  sensor: number;
  timestamp: number;
}

export function useBluetooth() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [server, setServer] = useState<BluetoothRemoteGATTServer | null>(null);
  const [controlCharacteristic, setControlCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);

  // 連接到 ESP32 設備
  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // 檢查瀏覽器是否支持 Web Bluetooth
      if (!navigator.bluetooth) {
        throw new Error('您的瀏覽器不支持 Web Bluetooth API。請使用 Chrome、Edge 或 Opera 瀏覽器。');
      }

      // 請求藍牙設備 (已修正語法錯誤)
      // 使用 acceptAllDevices: true 來搜尋所有附近的藍牙裝置
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [SERVICE_UUID] // 必須保留，否則連線後無法存取服務
      });

      console.log('設備已選擇:', device.name);
      setDevice(device);

      // 連接到 GATT 服務器
      const server = await device.gatt?.connect();
      if (!server) {
        throw new Error('無法連接到 GATT 服務器');
      }
      
      console.log('已連接到 GATT 服務器');
      setServer(server);

      // 獲取服務
      // 注意：如果選錯裝置(選到不是 ESP32 的裝置)，會在這裡報錯，這是正常的
      const service = await server.getPrimaryService(SERVICE_UUID);
      console.log('已獲取服務');
      
      // 獲取控制特徵值
      const controlChar = await service.getCharacteristic(CHAR_CONTROL_UUID);
      setControlCharacteristic(controlChar);

      // 獲取傳感器特徵值並訂閱通知
      const sensorChar = await service.getCharacteristic(CHAR_SENSOR_UUID);
      await sensorChar.startNotifications();
      console.log('已訂閱傳感器通知');

      // 監聽傳感器數據
      sensorChar.addEventListener('characteristicvaluechanged', (event: Event) => {
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        const value = target.value;
        if (value) {
          const text = new TextDecoder().decode(value);
          
          try {
            const data = JSON.parse(text);
            
            // 只要收到 sensor 數據就更新，不限制數值
            if (data.sensor !== undefined) { 
              setSensorData({
                sensor: data.sensor,
                timestamp: Date.now()
              });
            }
          } catch (e) {
            console.log('收到非 JSON 訊息:', text);
          }
        }
      });

      // 監聽斷開連接事件
      device.addEventListener('gattserverdisconnected', () => {
        console.log('設備已斷開連接');
        setIsConnected(false);
        setServer(null);
        setControlCharacteristic(null);
      });

      setIsConnected(true);
      console.log('連接成功！');
    } catch (err: any) {
      console.error('連接錯誤:', err);
      // 優化錯誤訊息顯示
      let errorMsg = err.message || '連接失敗';
      if (errorMsg.includes('User cancelled')) {
        errorMsg = '使用者取消了選擇';
      } else if (errorMsg.includes('No Services matching')) {
        errorMsg = '連接的裝置不支援此功能 (UUID 不匹配)';
      }
      setError(errorMsg);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // 斷開連接
  const disconnect = useCallback(async () => {
    if (server?.connected) {
      server.disconnect();
      setIsConnected(false);
      setDevice(null);
      setServer(null);
      setControlCharacteristic(null);
      console.log('已斷開連接');
    }
  }, [server]);

  // 發送控制命令
  const sendCommand = useCallback(async (command: string) => {
    if (!isConnected || !controlCharacteristic) {
      throw new Error('設備未連接');
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(command);
      await controlCharacteristic.writeValue(data);
      console.log('已發送命令:', command);
    } catch (err: any) {
      console.error('發送命令失敗:', err);
      throw new Error('發送命令失敗: ' + err.message);
    }
  }, [isConnected, controlCharacteristic]);

  return {
    isConnected,
    isConnecting,
    device,
    sensorData,
    error,
    connect,
    disconnect,
    sendCommand
  };
}