# ESP32 藍牙連接指南

## 硬體準備

### 需要的材料
- ESP32 開發板
- USB 數據線
- 電腦（用於燒錄代碼）
- 可選：傳感器連接到 GPIO 34 引腳

## 軟體設置

### 1. 安裝 Arduino IDE
- 下載並安裝 [Arduino IDE](https://www.arduino.cc/en/software)
- 添加 ESP32 板支持：
  - 打開 Arduino IDE
  - 文件 → 首選項
  - 在「附加開發板管理器網址」中添加：
    ```
    https://dl.espressif.com/dl/package_esp32_index.json
    ```
  - 工具 → 開發板 → 開發板管理器
  - 搜索「ESP32」並安裝

### 2. 安裝必要的庫
在 Arduino IDE 中：
- 工具 → 管理庫
- 已包含在 ESP32 核心中的庫：
  - BLEDevice
  - BLEServer
  - BLEUtils
  - BLE2902

### 3. 燒錄代碼
1. 打開提供的 `ESP32_BLE_Peripheral.ino` 文件
2. 選擇正確的開發板：工具 → 開發板 → ESP32 Dev Module
3. 選擇正確的 COM 端口：工具 → 端口
4. 點擊上傳按鈕

## Python 測試客戶端

在開發網頁應用之前，建議先使用 Python 客戶端測試 ESP32 是否正常工作。

### 快速開始

```bash
cd python_client
pip install -r requirements.txt
python interactive_client.py
```

詳細說明請參考 [`python_client/README.md`](./python_client/README.md)

### 可用的測試工具

1. **central_client.py** - 基本自動測試
2. **interactive_client.py** - 互動式命令界面
3. **monitor.py** - 持續監控並記錄數據

## 代碼說明

### 藍牙服務和特徵值

```cpp
#define SERVICE_UUID        "0000feed-0000-1000-8000-00805f9b34fb"
#define CHAR_CONTROL_UUID   "0000beef-0000-1000-8000-00805f9b34fb" // 接收控制指令
#define CHAR_SENSOR_UUID    "0000cafe-0000-1000-8000-00805f9b34fb" // 發送傳感器數據
```

### 支持的控制指令

1. **LED 控制**
   - `LED_ON` - 打開 GPIO 2 上的 LED
   - `LED_OFF` - 關閉 GPIO 2 上的 LED

2. **參數設置**
   - `SET:128` - 設置參數為 128
   - `SET:256` - 設置參數為 256
   - 等等...

3. **自動回應**
   - ESP32 會對每個接收到的指令發送 ACK 確認
   - 格式：`ACK:原始指令`

### 傳感器數據格式

ESP32 每 5 秒發送一次傳感器數據，格式為 JSON：

```json
{"sensor":512}
```

- `sensor` 值範圍：0-1024
- 讀取自 GPIO 34 引腳的模擬輸入

## 網頁應用連接

### 瀏覽器要求
- Google Chrome（推薦）
- Microsoft Edge
- Opera

**不支持：** Firefox、Safari

### 連接步驟

1. **準備 ESP32**
   - 確保 ESP32 已燒錄代碼並通電
   - 打開串口監視器查看「BLE Peripheral advertising...」

2. **在網頁應用中連接**
   - 打開 EmoEase 網頁應用
   - 方式一：在首頁點擊「連接裝置」按鈕
   - 方式二：進入「開始遊玩」頁面，使用藍牙連接組件
   - 在彈出的設備列表中選擇「ESP32-Product」
   - 點擊「配對」

3. **驗證連接**
   - 連接成功後，網頁會顯示「已連接: ESP32-Product」
   - 每 5 秒接收一次傳感器數據
   - 壓力顯示器會自動更新為真實數據

### 功能測試

1. **測試 LED 控制**
   - 在藍牙連接組件中點擊「LED ON/OFF」按鈕
   - 觀察 ESP32 板載 LED（GPIO 2）的變化

2. **測試參數設置**
   - 點擊快速設定按鈕（128、256、512、768）
   - 在串口監視器中查看接收到的設置值

3. **測試傳感器數據**
   - 觀察壓力顯示器是否顯示來自 ESP32 的數據
   - 狀態應顯示「ESP32 感測器已連接」

## 故障排除

### 找不到設備
- 確保 ESP32 已通電並運行代碼
- 檢查串口監視器是否顯示「BLE Peripheral advertising...」
- 刷新瀏覽器頁面後重試
- 確保使用支持的瀏覽器

### 連接失敗
- 重新給 ESP32 上電
- 清除瀏覽器緩存
- 檢查是否有其他設備已連接到 ESP32

### 沒有收到數據
- 檢查串口監視器是否顯示「Notify: ...」
- 確保網頁應用已訂閱通知
- 重新連接設備

### LED 控制無效
- 確認您的 ESP32 板 GPIO 2 有 LED
- 有些板子可能需要使用其他引腳
- 檢查串口監視器是否收到控制指令

## 自定義開發

### 添加新的傳感器

```cpp
void loop() {
  static unsigned long last = 0;
  if (millis() - last > 5000) {
    last = millis();
    
    // 讀取您的傳感器
    int temperature = readTemperatureSensor();
    int humidity = readHumiditySensor();
    
    // 組合 JSON
    char buf[128];
    int n = snprintf(buf, sizeof(buf), 
      "{\"sensor\":%d,\"temp\":%d,\"humidity\":%d}", 
      analogRead(34), temperature, humidity);
    
    pSensorChar->setValue((uint8_t*)buf, n);
    pSensorChar->notify();
  }
  delay(10);
}
```

### 添加新的控制指令

```cpp
void onWrite(BLECharacteristic *pChar) {
  std::string val = pChar->getValue();
  
  if (val == "MOTOR_ON") {
    // 啟動馬達
    digitalWrite(MOTOR_PIN, HIGH);
  } else if (val == "MOTOR_OFF") {
    // 停止馬達
    digitalWrite(MOTOR_PIN, LOW);
  } else if (val.rfind("SPEED:", 0) == 0) {
    // 設置速度
    int speed = std::stoi(val.substr(6));
    analogWrite(MOTOR_PIN, speed);
  }
  
  // 發送確認
  std::string ack = "ACK:";
  ack += val;
  pSensorChar->setValue((uint8_t*)ack.data(), ack.length());
  pSensorChar->notify();
}
```

## 安全提示

- 藍牙 LE 連接範圍通常在 10 米以內
- 當前實現沒有配對密碼
- 如需加密，請參考 ESP32 BLE Security 文檔
- 不要通過藍牙傳輸敏感信息

## 延伸閱讀

- [ESP32 BLE 官方文檔](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/bluetooth/esp_gatts.html)
- [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- [Arduino ESP32 BLE 庫](https://github.com/nkolban/ESP32_BLE_Arduino)
