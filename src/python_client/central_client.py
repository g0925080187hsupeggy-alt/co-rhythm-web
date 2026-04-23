# central_client.py
import asyncio
from bleak import BleakScanner, BleakClient

SERVICE_UUID = "0000feed-0000-1000-8000-00805f9b34fb"
CHAR_CONTROL_UUID = "0000beef-0000-1000-8000-00805f9b34fb"
CHAR_SENSOR_UUID = "0000cafe-0000-1000-8000-00805f9b34fb"

def notification_handler(sender, data):
    # data is bytearray
    try:
        text = data.decode('utf-8')
    except:
        text = str(data)
    print(f"Notification from {sender}: {text}")

async def run():
    print("Scanning for devices advertising our service...")
    devices = await BleakScanner.discover(timeout=5.0)
    target = None
    for d in devices:
        # 也可以用 d.name == "ESP32-Product"
        if SERVICE_UUID.lower() in [s.lower() for s in d.metadata.get("uuids", [])]:
            target = d
            break
    if not target:
        print("No peripheral found advertising the service. Listing nearby devices:")
        for d in devices:
            print(d)
        return

    print(f"Found target: {target.name} [{target.address}]")
    async with BleakClient(target.address) as client:
        if not client.is_connected:
            print("Failed to connect")
            return
        print("Connected")

        # subscribe to sensor notifications
        await client.start_notify(CHAR_SENSOR_UUID, notification_handler)
        print("Started notify on sensor characteristic")

        # send some control commands
        cmds = [b"LED_ON", b"LED_OFF", b"SET:128"]
        for c in cmds:
            print(f"Writing control: {c}")
            await client.write_gatt_char(CHAR_CONTROL_UUID, c, response=True)
            await asyncio.sleep(2)

        print("Waiting for notifications (10s)...")
        await asyncio.sleep(10)

        await client.stop_notify(CHAR_SENSOR_UUID)
    print("Done")

if __name__ == "__main__":
    asyncio.run(run())
