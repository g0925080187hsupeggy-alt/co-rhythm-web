# monitor.py
# 持續監控 ESP32 感測器數據並生成圖表
import asyncio
import json
from bleak import BleakScanner, BleakClient
from datetime import datetime
import time

SERVICE_UUID = "0000feed-0000-1000-8000-00805f9b34fb"
CHAR_CONTROL_UUID = "0000beef-0000-1000-8000-00805f9b34fb"
CHAR_SENSOR_UUID = "0000cafe-0000-1000-8000-00805f9b34fb"

class DataMonitor:
    def __init__(self):
        self.data_log = []
        self.start_time = time.time()
        
    def notification_handler(self, sender, data):
        """處理感測器數據"""
        try:
            text = data.decode('utf-8')
            
            # 解析 JSON
            try:
                data_json = json.loads(text)
                if 'sensor' in data_json:
                    sensor_value = data_json['sensor']
                    timestamp = time.time() - self.start_time
                    
                    self.data_log.append({
                        'time': timestamp,
                        'value': sensor_value,
                        'datetime': datetime.now().isoformat()
                    })
                    
                    # 即時顯示
                    bar_length = int((sensor_value / 1024) * 50)
                    bar = '█' * bar_length + '░' * (50 - bar_length)
                    print(f"\r[{timestamp:6.1f}s] {sensor_value:4d}/1024 |{bar}| {sensor_value/1024*100:5.1f}%", end='')
            except json.JSONDecodeError:
                pass
                
        except Exception as e:
            print(f"\n錯誤: {e}")
    
    def save_to_csv(self, filename='sensor_data.csv'):
        """保存數據到 CSV 文件"""
        with open(filename, 'w') as f:
            f.write("timestamp,value,datetime\n")
            for entry in self.data_log:
                f.write(f"{entry['time']:.2f},{entry['value']},{entry['datetime']}\n")
        print(f"\n✓ 數據已保存到 {filename}")
    
    def print_summary(self):
        """打印統計摘要"""
        if not self.data_log:
            print("\n暫無數據")
            return
        
        values = [entry['value'] for entry in self.data_log]
        avg = sum(values) / len(values)
        min_val = min(values)
        max_val = max(values)
        
        print("\n" + "=" * 60)
        print("📊 監控摘要")
        print("=" * 60)
        print(f"監控時長: {self.data_log[-1]['time']:.1f} 秒")
        print(f"數據點數: {len(self.data_log)}")
        print(f"平均值: {avg:.1f}/1024 ({avg/1024*100:.1f}%)")
        print(f"最小值: {min_val}/1024")
        print(f"最大值: {max_val}/1024")
        print(f"變化範圍: {max_val - min_val}")
        print("=" * 60)

async def main():
    monitor = DataMonitor()
    
    print("=" * 60)
    print("  ESP32 感測器數據監控器")
    print("=" * 60)
    print("\n🔍 掃描設備...")
    
    devices = await BleakScanner.discover(timeout=5.0)
    target = None
    
    for d in devices:
        if SERVICE_UUID.lower() in [s.lower() for s in d.metadata.get("uuids", [])]:
            target = d
            break
        if d.name == "ESP32-Product":
            target = d
            break
    
    if not target:
        print("❌ 未找到 ESP32 設備")
        return
    
    print(f"✓ 找到設備: {target.name}")
    print("📱 連接中...\n")
    
    try:
        async with BleakClient(target.address) as client:
            if not client.is_connected:
                print("❌ 連接失敗")
                return
            
            print("✓ 已連接!")
            print("📊 開始監控感測器數據...")
            print("   按 Ctrl+C 停止監控\n")
            
            await client.start_notify(CHAR_SENSOR_UUID, monitor.notification_handler)
            
            # 持續監控直到用戶中斷
            try:
                while True:
                    await asyncio.sleep(1)
            except KeyboardInterrupt:
                print("\n\n⚠️  停止監控...")
            
            await client.stop_notify(CHAR_SENSOR_UUID)
            
    except Exception as e:
        print(f"\n❌ 錯誤: {e}")
    
    # 顯示摘要並保存數據
    monitor.print_summary()
    
    if monitor.data_log:
        save = input("\n是否保存數據到 CSV? (y/n): ")
        if save.lower() == 'y':
            filename = input("文件名 (默認: sensor_data.csv): ").strip()
            if not filename:
                filename = 'sensor_data.csv'
            monitor.save_to_csv(filename)
            print("\n💡 提示: 可以使用 Excel 或 Python pandas 分析此數據")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n再見!")
