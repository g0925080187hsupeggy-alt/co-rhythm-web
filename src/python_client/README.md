# Python BLE 測試客戶端

這些 Python 腳本可用於測試和調試 ESP32 BLE 設備，在開發網頁應用之前驗證硬體是否正常工作。

## 📋 系統要求

- Python 3.7 或更高版本
- 支持藍牙的電腦（大多數筆記本都有內建藍牙）
- Windows 10+、macOS、或 Linux

## 🚀 安裝

### 1. 安裝 Python 依賴

```bash
pip install -r requirements.txt
```

或直接安裝：

```bash
pip install bleak
```

### 2. 確認藍牙可用

**Windows:**
- 確保藍牙已開啟
- 設定 → 裝置 → 藍牙

**macOS:**
- 系統偏好設定 → 藍牙 → 開啟

**Linux:**
```bash
sudo systemctl start bluetooth
sudo systemctl enable bluetooth
```

## 📝 使用方法

### 基本測試客戶端 (central_client.py)

自動執行一系列測試命令的簡單客戶端。

```bash
python central_client.py
```

**功能:**
- 自動掃描並連接 ESP32
- 發送測試命令（LED_ON、LED_OFF、SET:128）
- 接收並顯示感測器數據
- 運行 10 秒後自動斷開

**輸出範例:**
```
Scanning for devices advertising our service...
Found target: ESP32-Product [XX:XX:XX:XX:XX:XX]
Connected
Started notify on sensor characteristic
Writing control: b'LED_ON'
Notification from 00002902-...: ACK:LED_ON
Writing control: b'LED_OFF'
Notification from 00002902-...: ACK:LED_OFF
Writing control: b'SET:128'
Notification from 00002902-...: ACK:SET:128
Notification from 00002902-...: {"sensor":523}
Done
```

### 互動式測試客戶端 (interactive_client.py)

提供互動式命令界面的進階客戶端。

```bash
python interactive_client.py
```

**功能:**
- 互動式命令輸入
- 實時感測器數據顯示
- 數據統計分析
- 友好的用戶界面

**可用命令:**

| 命令 | 說明 | 範例 |
|------|------|------|
| `led on` | 開啟 LED | `led on` |
| `led off` | 關閉 LED | `led off` |
| `set <值>` | 設置參數 | `set 256` |
| `stats` | 顯示統計 | `stats` |
| `help` | 顯示幫助 | `help` |
| `quit` | 退出程式 | `quit` |

**使用範例:**
```
💻 輸入命令: led on
✓ 已發送: LED_ON

[12:34:56] 收到數據: ACK:LED_ON
  → 確認: LED_ON

💻 輸入命令: stats

📊 感測器數據統計:
  樣本數: 5
  平均值: 512.4/1024 (50.0%)
  最小值: 480/1024
  最大值: 550/1024

💻 輸入命令: quit
```

## 🔧 故障排除

### 找不到設備

**問題:** `No peripheral found advertising the service`

**解決方案:**
1. 確認 ESP32 已通電並運行 BLE 代碼
2. 檢查 ESP32 串口監視器顯示 "BLE Peripheral advertising..."
3. 確保電腦藍牙已開啟
4. 減少 ESP32 與電腦的距離（< 5 米）
5. 重新給 ESP32 上電

### 連接失敗

**問題:** `Failed to connect`

**解決方案:**
1. 確認沒有其他程式連接到 ESP32
2. 重啟藍牙服務：
   ```bash
   # Linux
   sudo systemctl restart bluetooth
   
   # macOS
   # 關閉再開啟藍牙
   ```
3. 重新運行腳本

### 權限錯誤 (Linux)

**問題:** `Permission denied` 或藍牙權限錯誤

**解決方案:**
```bash
# 添加用戶到藍牙組
sudo usermod -a -G bluetooth $USER

# 或使用 sudo 運行
sudo python3 interactive_client.py
```

### Windows 特定問題

**問題:** `Bleak not finding devices`

**解決方案:**
1. 更新 Windows 到最新版本
2. 更新藍牙驅動程式
3. 在設定中移除 ESP32 配對（如果已配對）
4. 重啟電腦

## 📊 進階使用

### 自定義掃描時間

編輯腳本中的 `timeout` 參數：

```python
devices = await BleakScanner.discover(timeout=10.0)  # 10 秒
```

### 添加自定義命令

在 `interactive_client.py` 中添加：

```python
elif command == "custom":
    await client.send_command("CUSTOM_COMMAND")
```

### 記錄數據到文件

```python
# 在 notification_handler 中添加
with open('sensor_data.csv', 'a') as f:
    f.write(f"{datetime.now()},{sensor_value}\n")
```

## 🐛 調試技巧

### 啟用詳細日誌

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### 列出所有藍牙設備

```python
devices = await BleakScanner.discover(timeout=5.0)
for d in devices:
    print(f"{d.name} - {d.address}")
    print(f"  Services: {d.metadata.get('uuids', [])}")
```

### 檢查服務和特徵值

```python
services = await client.get_services()
for service in services:
    print(f"Service: {service.uuid}")
    for char in service.characteristics:
        print(f"  Characteristic: {char.uuid}")
        print(f"    Properties: {char.properties}")
```

## 📚 程式碼說明

### BleakScanner.discover()
掃描附近的藍牙設備。返回設備列表。

### BleakClient()
建立與藍牙設備的連接。使用 `async with` 自動管理連接。

### start_notify()
訂閱特徵值的通知。當 ESP32 發送數據時，自動調用回調函數。

### write_gatt_char()
向特徵值寫入數據。`response=True` 表示等待寫入確認。

## 🔗 相關資源

- [Bleak 文檔](https://bleak.readthedocs.io/)
- [BLE GATT 規範](https://www.bluetooth.com/specifications/gatt/)
- [ESP32 BLE 範例](https://github.com/espressif/arduino-esp32/tree/master/libraries/BLE)

## 💡 提示

1. **測試順序:**
   - 先用 Arduino 串口監視器確認 ESP32 正常
   - 再用 Python 客戶端測試藍牙通信
   - 最後使用網頁應用

2. **數據格式:**
   - ESP32 發送 JSON: `{"sensor":512}`
   - 確認消息: `ACK:命令`

3. **最佳實踐:**
   - 測試時保持 ESP32 接近電腦
   - 關閉不必要的藍牙設備減少干擾
   - 使用互動式客戶端進行深入測試

## 📄 授權

本程式碼僅供測試和教育用途。
