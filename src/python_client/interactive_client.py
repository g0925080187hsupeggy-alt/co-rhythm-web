# interactive_client.py
# 互動式 ESP32 BLE 測試客戶端
import asyncio
import json
from bleak import BleakScanner, BleakClient
from datetime import datetime

SERVICE_UUID = "0000feed-0000-1000-8000-00805f9b34fb"
CHAR_CONTROL_UUID = "0000beef-0000-1000-8000-00805f9b34fb"
CHAR_SENSOR_UUID = "0000cafe-0000-1000-8000-00805f9b34fb"

class ESP32Client:
    def __init__(self):
        self.client = None
        self.connected = False
        self.sensor_values = []
        
    def notification_handler(self, sender, data):
        """處理來自 ESP32 的通知"""
        try:
            text = data.decode('utf-8')
            print(f"\n[{datetime.now().strftime('%H:%M:%S')}] 收到數據: {text}")
            
            # 嘗試解析 JSON
            try:
                data_json = json.loads(text)
                if 'sensor' in data_json:
                    sensor_value = data_json['sensor']
                    self.sensor_values.append(sensor_value)
                    print(f"  → 感測器值: {sensor_value}/1024 ({sensor_value/1024*100:.1f}%)")
            except json.JSONDecodeError:
                # 可能是 ACK 消息
                if text.startswith("ACK:"):
                    print(f"  → 確認: {text[4:]}")
        except Exception as e:
            print(f"解析數據時出錯: {e}")
    
    async def scan_and_connect(self):
        """掃描並連接到 ESP32 設備"""
        print("🔍 掃描 BLE 設備中...")
        devices = await BleakScanner.discover(timeout=5.0)
        
        target = None
        print("\n找到的設備:")
        for i, d in enumerate(devices):
            print(f"  {i+1}. {d.name or '未命名'} [{d.address}]")
            # 檢查服務 UUID
            if SERVICE_UUID.lower() in [s.lower() for s in d.metadata.get("uuids", [])]:
                target = d
                print(f"     ✓ 匹配服務 UUID")
            # 也檢查設備名稱
            if d.name == "ESP32-Product":
                target = d
                print(f"     ✓ 匹配設備名稱")
        
        if not target:
            print("\n❌ 未找到 ESP32-Product 設備")
            return False
        
        print(f"\n✓ 找到目標設備: {target.name} [{target.address}]")
        print("📱 正在連接...")
        
        try:
            self.client = BleakClient(target.address)
            await self.client.connect()
            
            if not self.client.is_connected:
                print("❌ 連接失敗")
                return False
            
            print("✓ 已連接!")
            self.connected = True
            
            # 訂閱感測器通知
            await self.client.start_notify(CHAR_SENSOR_UUID, self.notification_handler)
            print("✓ 已訂閱感測器通知")
            
            return True
        except Exception as e:
            print(f"❌ 連接錯誤: {e}")
            return False
    
    async def send_command(self, command):
        """發送命令到 ESP32"""
        if not self.connected or not self.client:
            print("❌ 未連接到設備")
            return False
        
        try:
            await self.client.write_gatt_char(
                CHAR_CONTROL_UUID, 
                command.encode('utf-8'), 
                response=True
            )
            print(f"✓ 已發送: {command}")
            return True
        except Exception as e:
            print(f"❌ 發送失敗: {e}")
            return False
    
    async def disconnect(self):
        """斷開連接"""
        if self.client and self.connected:
            try:
                await self.client.stop_notify(CHAR_SENSOR_UUID)
                await self.client.disconnect()
                print("✓ 已斷開連接")
            except:
                pass
        self.connected = False
    
    def show_statistics(self):
        """顯示統計信息"""
        if len(self.sensor_values) == 0:
            print("暫無感測器數據")
            return
        
        avg = sum(self.sensor_values) / len(self.sensor_values)
        min_val = min(self.sensor_values)
        max_val = max(self.sensor_values)
        
        print(f"\n📊 感測器數據統計:")
        print(f"  樣本數: {len(self.sensor_values)}")
        print(f"  平均值: {avg:.1f}/1024 ({avg/1024*100:.1f}%)")
        print(f"  最小值: {min_val}/1024")
        print(f"  最大值: {max_val}/1024")

async def main():
    client = ESP32Client()
    
    print("=" * 60)
    print("  ESP32 BLE 互動式測試客戶端")
    print("=" * 60)
    
    # 連接到設備
    if not await client.scan_and_connect():
        return
    
    print("\n" + "=" * 60)
    print("可用命令:")
    print("  led on     - 開啟 LED")
    print("  led off    - 關閉 LED")
    print("  set <值>   - 設置參數 (例如: set 256)")
    print("  stats      - 顯示感測器數據統計")
    print("  quit       - 斷開連接並退出")
    print("=" * 60)
    
    try:
        while client.connected:
            # 非阻塞輸入
            command = await asyncio.get_event_loop().run_in_executor(
                None, 
                input, 
                "\n💻 輸入命令: "
            )
            
            command = command.strip().lower()
            
            if command == "quit":
                break
            elif command == "led on":
                await client.send_command("LED_ON")
            elif command == "led off":
                await client.send_command("LED_OFF")
            elif command.startswith("set "):
                try:
                    value = command.split()[1]
                    await client.send_command(f"SET:{value}")
                except:
                    print("❌ 用法: set <值>")
            elif command == "stats":
                client.show_statistics()
            elif command == "help":
                print("\n可用命令:")
                print("  led on/off - LED 控制")
                print("  set <值>   - 設置參數")
                print("  stats      - 統計信息")
                print("  quit       - 退出")
            else:
                print(f"❌ 未知命令: {command} (輸入 help 查看幫助)")
            
            # 短暫延遲
            await asyncio.sleep(0.1)
    
    except KeyboardInterrupt:
        print("\n\n⚠️  收到中斷信號")
    finally:
        client.show_statistics()
        await client.disconnect()
        print("\n再見! 👋")

if __name__ == "__main__":
    asyncio.run(main())
