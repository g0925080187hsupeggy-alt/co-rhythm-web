# EmoEase 開發指南

完整的開發、測試和部署指南。

## 📁 項目結構

```
/
├── App.tsx                     # 主應用程式
├── components/                 # React 組件
│   ├── Navbar.tsx             # 導航欄
│   ├── Hero.tsx               # 首頁 Hero 區塊
│   ├── MusicPlayer.tsx        # 音樂播放器
│   ├── PressureDisplay.tsx    # 壓力感測顯示
│   ├── AcupointMap.tsx        # 穴道地圖
│   ├── BluetoothConnection.tsx # 藍牙連接組件
│   ├── ImageManager.tsx       # 圖片管理器
│   └── ...
├── hooks/
│   └── useBluetooth.ts        # 藍牙連接 Hook
├── config/
│   └── images.ts              # 圖片配置
├── python_client/             # Python 測試工具
│   ├── central_client.py      # 基本測試
│   ├── interactive_client.py  # 互動式測試
│   ├── monitor.py            # 數據監控
│   └── README.md
└── ESP32_README.md           # ESP32 硬體指南
```

## 🔄 開發流程

### 階段 1: ESP32 硬體開發

1. **準備硬體**
   ```
   - ESP32 開發板
   - 可選：傳感器（GPIO 34）
   - USB 線
   ```

2. **燒錄代碼**
   ```bash
   # 使用 Arduino IDE
   1. 打開 ESP32_BLE_Peripheral.ino
   2. 選擇板子和端口
   3. 上傳代碼
   ```

3. **驗證運行**
   ```bash
   # 打開串口監視器，應該看到：
   BLE Peripheral advertising...
   ```

### 階段 2: Python 測試

在開發網頁前，用 Python 測試藍牙連接：

1. **安裝依賴**
   ```bash
   cd python_client
   pip install -r requirements.txt
   ```

2. **基本測試**
   ```bash
   python central_client.py
   ```
   應該看到：
   - 找到設備
   - 連接成功
   - 發送命令
   - 接收數據

3. **互動式測試**
   ```bash
   python interactive_client.py
   ```
   測試所有命令：
   - `led on` / `led off`
   - `set 256`
   - `stats`

4. **數據監控**
   ```bash
   python monitor.py
   ```
   監控並保存感測器數據

### 階段 3: 網頁應用開發

1. **啟動開發服務器**
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

2. **測試藍牙連接**
   - 使用 Chrome/Edge/Opera 瀏覽器
   - 首頁點擊「連接裝置」
   - 選擇 ESP32-Product
   - 驗證數據接收

3. **功能測試清單**
   - [ ] 設備掃描和連接
   - [ ] LED 控制（ON/OFF）
   - [ ] 參數設置
   - [ ] 感測器數據接收
   - [ ] 壓力顯示更新
   - [ ] 斷開連接

## 🔧 調試技巧

### ESP32 調試

**串口監視器輸出:**
```
BLE Peripheral advertising...
Central connected
Received control: LED_ON
Notify: {"sensor":512}
Central disconnected
```

**常見問題:**
- 沒有 "advertising" 消息 → 檢查代碼燒錄
- 連接後立即斷開 → 檢查電源供應
- 數據不發送 → 檢查 GPIO 34

### Python 客戶端調試

**啟用詳細日誌:**
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

**檢查藍牙狀態:**
```bash
# Linux
systemctl status bluetooth

# macOS
# 系統偏好設定 → 藍牙

# Windows
# 設定 → 藍牙和其他裝置
```

### 網頁應用調試

**瀏覽器控制台:**
```javascript
// 在 useBluetooth.ts 中已有 console.log
// 檢查控制台輸出：
// - 設備已選擇
// - 已連接到 GATT 服務器
// - 已訂閱傳感器通知
// - 收到數據: {"sensor":512}
```

**常見問題:**
- "不支持 Web Bluetooth" → 使用 Chrome/Edge
- "用戶取消連接" → 用戶點了取消
- "設備未找到" → ESP32 未運行或距離太遠

## 🧪 測試用例

### 1. 端到端測試

```bash
# 終端 1: 監控 ESP32
# Arduino IDE 串口監視器

# 終端 2: Python 測試
cd python_client
python interactive_client.py

# 終端 3: 網頁應用
npm run dev
# 瀏覽器打開 localhost
```

### 2. 壓力測試

**快速連接/斷開:**
```python
# 創建測試腳本
for i in range(10):
    connect()
    await asyncio.sleep(2)
    disconnect()
```

**大量數據:**
```cpp
// ESP32 代碼中減少延遲
if (millis() - last > 100) {  // 每 0.1 秒
    // 發送數據
}
```

### 3. 邊緣案例

- ESP32 斷電後重連
- 同時連接多個客戶端（不支持）
- 超出藍牙範圍
- 數據格式錯誤

## 📊 性能優化

### ESP32 端

```cpp
// 優化通知頻率
#define NOTIFY_INTERVAL 1000  // 調整間隔

// 批量發送數據
char buf[256];
snprintf(buf, sizeof(buf), 
  "{\"sensor\":%d,\"temp\":%d,\"humidity\":%d}",
  sensor1, sensor2, sensor3);
```

### 網頁端

```typescript
// 節流數據更新
const throttledUpdate = useMemo(
  () => throttle(updateDisplay, 100),
  []
);
```

### Python 端

```python
# 異步處理數據
async def process_data(data):
    # 不阻塞主循環
    await asyncio.sleep(0)
```

## 🔒 安全考慮

### 當前實現（開發用）
- ❌ 無配對密碼
- ❌ 無加密
- ❌ 無認證

### 生產環境建議
```cpp
// ESP32 添加配對
BLESecurity *pSecurity = new BLESecurity();
pSecurity->setAuthenticationMode(ESP_LE_AUTH_REQ_SC_MITM_BOND);
```

```typescript
// 網頁添加認證檢查
if (device.name !== "ESP32-Product-XXXX") {
  throw new Error("設備驗證失敗");
}
```

## 📦 部署

### 網頁應用部署

**Vercel / Netlify:**
```bash
npm run build
# 上傳 dist/ 目錄
```

**注意事項:**
- 必須使用 HTTPS
- Web Bluetooth 只在安全上下文中工作
- localhost 開發時可以使用 HTTP

### ESP32 量產

1. **固件版本控制**
   ```cpp
   #define FIRMWARE_VERSION "1.0.0"
   // 在廣播中包含版本
   ```

2. **OTA 更新**
   ```cpp
   #include <ArduinoOTA.h>
   // 添加無線更新功能
   ```

3. **配置管理**
   - 使用 EEPROM 保存配置
   - 提供重置按鈕

## 🐛 已知問題

### 1. Firefox 不支持 Web Bluetooth
**狀態:** 瀏覽器限制  
**解決:** 使用 Chrome/Edge

### 2. iOS Safari 不支持
**狀態:** 瀏覽器限制  
**解決:** 使用 iOS Chrome（仍受限）

### 3. 連接穩定性
**狀態:** 開發中  
**解決:** 添加自動重連機制

## 📚 學習資源

### 藍牙 LE
- [Bluetooth GATT 規範](https://www.bluetooth.com/specifications/gatt/)
- [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)

### ESP32
- [ESP32 BLE Arduino](https://github.com/nkolban/ESP32_BLE_Arduino)
- [ESP-IDF 文檔](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)

### React/TypeScript
- [React 文檔](https://react.dev/)
- [TypeScript 手冊](https://www.typescriptlang.org/docs/)

## 🤝 貢獻指南

1. Fork 項目
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 📝 更新日誌

### v1.0.0 (2024)
- ✅ ESP32 BLE 連接
- ✅ 實時感測器數據
- ✅ LED 控制
- ✅ Python 測試工具
- ✅ 圖片管理系統

### 計劃功能
- ⏳ 自動重連
- ⏳ 數據加密
- ⏳ 多設備支持
- ⏳ 歷史數據記錄

## 💡 最佳實踐

1. **開發順序**
   - 先測硬體（ESP32）
   - 再測軟體（Python）
   - 最後整合（網頁）

2. **調試策略**
   - 使用串口監視器
   - 查看瀏覽器控制台
   - Python 腳本驗證

3. **代碼組織**
   - 組件化設計
   - Hook 復用邏輯
   - 配置集中管理

4. **用戶體驗**
   - 清晰的錯誤消息
   - 連接狀態提示
   - 友好的引導流程
