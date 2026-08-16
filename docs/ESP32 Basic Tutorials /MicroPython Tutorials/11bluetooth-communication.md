---
id: bluetooth-communication
title: Bluetooth
sidebar_label: Bluetooth
sidebar_position: 12
description: Understand BLE fundamentals (GAP and GATT) and use MicroPython's aioble library to send sensor data, receive control commands, and link two ESP32 boards over BLE.
---

# Section 11: Bluetooth

ESP32's built-in Bluetooth makes it a natural fit for wearables, wireless sensing, and short-range device-to-device links. Bluetooth splits into two distinct technologies:

- **Bluetooth Classic** — built for sustained, higher-throughput links, most often seen in wireless audio.
- **Bluetooth Low Energy (BLE)** — built for small, infrequent, low-power transmissions, and the dominant choice for IoT devices like sensors and wearables.

:::info

Bluetooth support varies by chip: the original ESP32 supports both Classic and BLE, while most newer chips in the family focus on BLE only, trading off Classic support for lower cost and power draw. Check your specific chip's specs if you're unsure.

:::

This section focuses entirely on BLE, and walks through three examples: a peripheral that broadcasts sensor readings, a peripheral that receives control commands, and finally two ESP32 boards talking to each other directly over BLE with no phone involved.

:::info

Make sure you've completed [**Section 1: Set Up Development Environment**](./getting-started) through [**Section 10: Web Server**](./web-server) before starting this section.

:::

---

## 1. BLE Fundamentals

BLE communication rests on two core concepts:

- **GAP (Generic Access Profile)** — governs how devices advertise themselves, get discovered, and connect.
- **GATT (Generic Attribute Profile)** — once connected, defines how the two sides actually structure and exchange data.

Put simply: GAP is about finding and connecting; GATT is about what happens once you're connected.

### 1.1 GAP

GAP defines two roles:

- **Peripheral** — typically the device holding data (a sensor, in most of these examples). It advertises its presence and waits to be connected to. ESP32 plays this role in the first two examples.
- **Central** — typically the device that initiates connections (a phone, a computer, or in Example 3, another ESP32). It scans for peripherals and connects to the ones it wants.

The interaction flow:

- **Advertising** — a peripheral periodically broadcasts packets containing its name and service UUIDs, so nearby centrals can find it.
- **Scanning** — a central listens for those advertising packets and parses out what's nearby.
- **Connecting** — the central requests a connection to a specific peripheral; once accepted, a one-to-one link is established.

### 1.2 GATT

GATT takes over once a connection exists, following a client/server model that maps directly onto the GAP roles:

- **GATT Server** — holds and serves the data (usually the GAP Peripheral).
- **GATT Client** — reads and writes that data (usually the GAP Central).

Data is organized hierarchically:

- **Service** — a logical grouping of related characteristics representing one function of the device, identified by its own UUID. ("Battery Service" containing a "Battery Level" characteristic" is the textbook example.)
- **Characteristic** — the actual unit of data exchange. Each one has a **value** (the data itself) and **properties** defining what a client can do with it:
  - `Read` — client can read the value.
  - `Write` — client can write to the value.
  - `Notify` — server can proactively push updates to the client when the value changes.
  - `Indicate` — like Notify, but requires the client to acknowledge receipt.
- **Descriptor** (optional) — extra metadata about a characteristic, like a human-readable label or unit.
- **UUID** — a 128-bit identifier uniquely naming a service, characteristic, or descriptor. The Bluetooth SIG maintains a set of short, standardized 16-bit UUIDs for common built-in functions (like `0x180F` for Battery Service); for your own custom characteristics, generate a fresh random 128-bit UUID to guarantee it won't collide with anything else.

---

## 2. Setup: Installing `aioble`

MicroPython's low-level `bluetooth` module is fairly bare-bones. [`aioble`](https://github.com/micropython/micropython-lib/tree/master/micropython/bluetooth/aioble) wraps it with a much friendlier, `asyncio`-based API, and is what all three examples below build on.

1. **Connect to Wi-Fi first** — installing a library over `mip` needs an internet connection:

```python
import network
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
```

```python
wlan.connect("Maker", "12345678")  # your SSID/password
```

```python
wlan.isconnected()
wlan.ifconfig()
```

2. **Install with `mip`**, from the REPL:

```python
import mip
mip.install("aioble")
```

`mip` installs into the board's `/lib` directory, which Thonny's file view hides by default — enable **Show hidden files** from the file view's right-click menu if you want to see it.

Once installed, `import aioble` works from any script.

---

## 3. Example 1: Broadcasting Sensor Data (Peripheral)

This configures the ESP32 as a BLE peripheral publishing a potentiometer's live reading through a GATT characteristic. Any BLE debugging app — this tutorial uses **LightBlue** (iOS/Android) — can connect as a central and read or subscribe to that value.

### 3.1 Wire It Up

Same potentiometer wiring as [Section 4](./analog-input#3-wire-up-a-potentiometer).

### 3.2 Code

:::tip

Generate your own random UUIDs for real projects (an [online UUID generator](https://www.uuidgenerator.net/) works fine) rather than reusing the ones below, to avoid collisions with other BLE devices.

:::

```python
import aioble
import bluetooth
import machine
import uasyncio as asyncio

_SERVICE_UUID = bluetooth.UUID("4fafc201-1fb5-459e-8fcc-c5c9c331914b")
_POT_CHAR_UUID = bluetooth.UUID("1b9a473a-4493-4536-8b2b-9d4133488256")

_ADV_INTERVAL_US = 250_000
_DEVICE_NAME = "ESP32_Potentiometer"

_ble = bluetooth.BLE()
_ble.active(True)
_ble.config(gap_name=_DEVICE_NAME)

# read=True lets clients read the value; notify=True lets the server push updates
pot_service = aioble.Service(_SERVICE_UUID)
pot_characteristic = aioble.Characteristic(
    pot_service, _POT_CHAR_UUID, read=True, notify=True
)
aioble.register_services(pot_service)

pot = machine.ADC(machine.Pin(7))

async def sensor_task():
    print("Sensor task started")
    last_val = -1
    while True:
        val = pot.read()

        # only push an update on a meaningful change - basic noise rejection
        if abs(val - last_val) > 10:
            last_val = val
            print(f"Potentiometer value: {val}")

            # BLE values are byte strings; pack the 12-bit reading into 2 bytes, little-endian
            encoded_val = val.to_bytes(2, "little")

            # updates the local value and notifies any subscribed client
            pot_characteristic.write(encoded_val, send_update=True)

        await asyncio.sleep_ms(100)

async def peripheral_task():
    print("Advertising task started")
    while True:
        async with await aioble.advertise(
            _ADV_INTERVAL_US,
            name=_DEVICE_NAME,
            services=[_SERVICE_UUID],
        ) as connection:
            print("Connection from", connection.device)
            await connection.disconnected()
            print("Disconnected")

async def main():
    t1 = asyncio.create_task(sensor_task())
    t2 = asyncio.create_task(peripheral_task())
    await asyncio.gather(t1, t2)

asyncio.run(main())
```

### 3.3 How It Works

This example runs BLE advertising/connection handling and sensor polling as two concurrent `asyncio` tasks, so neither one blocks the other.

- **Service and characteristic setup:** `aioble.Service(...)` and `aioble.Characteristic(..., read=True, notify=True)` declare what this peripheral exposes; `aioble.register_services(...)` registers it with the BLE stack.
- **`sensor_task`:** loops forever, reading the potentiometer and, on a meaningful change, calling `pot_characteristic.write(encoded_val, send_update=True)`. The `send_update=True` flag tells `aioble` to automatically notify any subscribed client — if nothing's subscribed, it just updates the stored value silently. `await asyncio.sleep_ms(100)` yields control back to the scheduler so the advertising/connection task (and the BLE stack itself) can keep running.
- **`peripheral_task`:** `aioble.advertise(...)` starts broadcasting the device name and service UUID so it's discoverable. The `async with ... as connection:` block holds the task there for the duration of a connection; `await connection.disconnected()` suspends until the client disconnects, at which point the loop restarts advertising automatically.

### 3.4 Try It

:::tip

This example needs a BLE debugging app on your phone — [LightBlue](https://apps.apple.com/cn/app/lightblue/id557428110) (iOS/Android) works well.

:::

In LightBlue: search for "ESP32," find **ESP32_Potentiometer**, and connect. Open the characteristic that shows read/subscribe support, switch its display format to HEX, set the byte limit to 2, and choose "2 Byte Unsigned Integer." Tap **Read** for a one-off value, or **Subscribe** to see it update live as you turn the potentiometer.

---

## 4. Example 2: Receiving Control Commands (Peripheral)

This time the ESP32 exposes a *writable* characteristic — a phone can write `0` or `1` to it to toggle an LED.

### 4.1 Wire It Up

Same LED wiring as [Section 3](./digital-io#21-wire-it-up).

### 4.2 Code

```python
import aioble
import bluetooth
import machine
import uasyncio as asyncio

_SERVICE_UUID = bluetooth.UUID("48407a44-6e13-4d28-a559-210de862bc29")
_LED_CHAR_UUID = bluetooth.UUID("539ca2ac-09e5-49be-90da-3b157549eac3")

_ADV_INTERVAL_US = 250_000
_DEVICE_NAME = "ESP32_LED_Control"

_ble = bluetooth.BLE()
_ble.active(True)
_ble.config(gap_name=_DEVICE_NAME)

# capture=True lets the application handle write events itself
led_service = aioble.Service(_SERVICE_UUID)
led_characteristic = aioble.Characteristic(
    led_service, _LED_CHAR_UUID, read=True, write=True, capture=True
)
aioble.register_services(led_service)

led = machine.Pin(7, machine.Pin.OUT)
led.value(0)

async def led_task():
    print("LED task started")
    while True:
        # blocks until a client writes to the characteristic
        connection, value = await led_characteristic.written()
        print(f"Received: {value} from {connection.device}")

        if value:
            command = value[0]
            if command == 1:
                print("Turning LED ON")
                led.value(1)
            elif command == 0:
                print("Turning LED OFF")
                led.value(0)
            else:
                print(f"Unknown command: {command}")

            # keep the stored value in sync with actual hardware state
            led_characteristic.write(value)

async def peripheral_task():
    print("Advertising task started")
    while True:
        async with await aioble.advertise(
            _ADV_INTERVAL_US,
            name=_DEVICE_NAME,
            services=[_SERVICE_UUID],
        ) as connection:
            print("Connection from", connection.device)
            await connection.disconnected()
            print("Disconnected")

async def main():
    t1 = asyncio.create_task(led_task())
    t2 = asyncio.create_task(peripheral_task())
    await asyncio.gather(t1, t2)

asyncio.run(main())
```

### 4.3 How It Works

- **`capture=True`** is the key setting here: it tells `aioble` to hand write requests to your application code instead of just silently acknowledging them at the BLE stack level, so `led_task` actually gets a chance to react.
- **`await led_characteristic.written()`** blocks until a client writes to the characteristic, then returns a `(connection, value)` tuple — `value` being the raw bytes the client sent.
- The task pulls out the first byte as a command and drives the LED accordingly, then calls `led_characteristic.write(value)` again to keep the stored value in sync with the actual hardware state — so a client reading the characteristic afterward sees a value that matches reality.

### 4.4 Try It

In LightBlue: find **ESP32_LED_Control**, connect, and open the characteristic showing read/write support. Set the byte limit to 1, choose "1 Byte Unsigned Integer." Reading should show `0` (LED off). Tap **Write new value**, enter `1`, and the LED should turn on.

---

## 5. Example 3: BLE Between Two ESP32 Boards

The most involved example: one board reads a potentiometer and acts as a **central**, connecting out to a second board that acts as a **peripheral** and drives an LED's brightness via PWM — no phone in the loop at all.

### 5.1 Wire It Up

- **Board A (peripheral, LED side):** LED wiring as in [Section 3](./digital-io#21-wire-it-up).
- **Board B (central, potentiometer side):** potentiometer wiring as in [Section 4](./analog-input#3-wire-up-a-potentiometer).

### 5.2 Board A: Peripheral (LED Side)

Nearly identical to Example 2, but driving PWM brightness instead of a simple on/off:

```python
import aioble
import bluetooth
import machine
import uasyncio as asyncio
import struct

_SERVICE_UUID = bluetooth.UUID("458063a1-02bf-4664-857e-16c1030be066")
_BRIGHTNESS_CHAR_UUID = bluetooth.UUID("a5209632-66a9-411d-9353-9be5507790fa")

_ADV_INTERVAL_US = 250_000
_DEVICE_NAME = "ESP32_LED"

_ble = bluetooth.BLE()
_ble.active(True)
_ble.config(gap_name=_DEVICE_NAME)

led_service = aioble.Service(_SERVICE_UUID)
led_characteristic = aioble.Characteristic(
    led_service, _BRIGHTNESS_CHAR_UUID, read=True, write=True, capture=True
)
aioble.register_services(led_service)

led = machine.PWM(machine.Pin(7))
led.freq(1000)
led.duty_u16(0)

async def led_task():
    print("LED task started")
    while True:
        connection, value = await led_characteristic.written()
        if value:
            try:
                # received value is 0-65535, packed as 2 bytes little-endian
                duty_u16 = struct.unpack("<H", value)[0]
                print(f"Received duty: {duty_u16}")
                led.duty_u16(duty_u16)
                led_characteristic.write(value)
            except:
                pass

async def peripheral_task():
    print("Advertising task started")
    while True:
        async with await aioble.advertise(
            _ADV_INTERVAL_US,
            name=_DEVICE_NAME,
            services=[_SERVICE_UUID],
        ) as connection:
            print("Connection from", connection.device)
            await connection.disconnected()
            print("Disconnected")

async def main():
    t1 = asyncio.create_task(led_task())
    t2 = asyncio.create_task(peripheral_task())
    await asyncio.gather(t1, t2)

asyncio.run(main())
```

The only real difference from Example 2: `machine.PWM` in place of a plain digital `Pin`, and `struct.unpack("<H", value)` to decode the incoming 2-byte little-endian value straight into a 0–65535 duty cycle.

### 5.3 Board B: Central (Potentiometer Side)

This is where the interesting new pattern shows up — `aioble` acting as a **client** rather than a server: scanning, connecting, discovering, then writing.

```python
import aioble
import bluetooth
import machine
import uasyncio as asyncio
import struct

_SERVICE_UUID = bluetooth.UUID("458063a1-02bf-4664-857e-16c1030be066")
_BRIGHTNESS_CHAR_UUID = bluetooth.UUID("a5209632-66a9-411d-9353-9be5507790fa")

pot = machine.ADC(machine.Pin(7))

async def find_device():
    print(f"Scanning for UUID: {_SERVICE_UUID} ...")
    async with aioble.scan(5000, interval_us=30000, window_us=30000, active=True) as scanner:
        async for result in scanner:
            if _SERVICE_UUID in result.services():
                device_name = result.name() or "Unknown"
                print(f"Found Target Device: {device_name}")
                return result.device
    return None

async def central_task():
    print("Central task started")
    while True:
        device = await find_device()
        if not device:
            print("Device not found, retrying...")
            await asyncio.sleep_ms(1000)
            continue

        try:
            print(f"Connecting to device...")
            connection = await device.connect(timeout_ms=5000)
        except asyncio.TimeoutError:
            print("Connection timeout")
            continue

        async with connection:
            print("Connected")
            try:
                print("Discovering services...")
                service = await connection.service(_SERVICE_UUID)
                if not service:
                    print("Service not found")
                    continue

                print("Discovering characteristics...")
                char = await service.characteristic(_BRIGHTNESS_CHAR_UUID)
                if not char:
                    print("Characteristic not found")
                    continue

                print("Ready to send data")
                last_val = -1

                while True:
                    val = pot.read_u16()

                    if abs(val - last_val) > 1000:
                        last_val = val
                        print(f"Sending duty: {val}")
                        await char.write(struct.pack("<H", val), response=False)

                    await asyncio.sleep_ms(100)

            except Exception as e:
                print(f"Error: {e}")

            print("Disconnected")
            # loop restarts and rescans automatically

asyncio.run(central_task())
```

### 5.4 How It Works

**Board A (Peripheral)** works the same way as Example 2, just with `struct.unpack("<H", value)` translating the incoming 2-byte payload directly into a PWM duty cycle value.

**Board B (Central)** demonstrates the client-side BLE workflow:

- **Scanning** — `aioble.scan(...)` returns an async iterator of nearby advertisements; the code checks `result.services()` against the target UUID to filter for the specific peripheral it wants, ignoring everything else nearby.
- **Connecting** — `device.connect(...)` initiates the connection; `async with connection:` ensures it gets cleanly closed whether the loop ends normally or an exception interrupts it.
- **Discovery** — a client can't just start reading and writing blind. `connection.service(_SERVICE_UUID)` fetches the remote service object, and `service.characteristic(_BRIGHTNESS_CHAR_UUID)` fetches the specific characteristic within it — only after that discovery step can the client actually interact with it.
- **Writing** — `struct.pack("<H", val)` encodes the potentiometer's 0–65535 reading into the same 2-byte little-endian format Board A expects. `response=False` sends a "write without response" — skipping the wait for an acknowledgment packet, which meaningfully improves throughput for a fast-changing sensor stream like this one, at the cost of no delivery confirmation.

### 5.5 Try It

Flash the peripheral code to Board A and the central code to Board B. Board A starts advertising; Board B scans, finds it, and connects automatically. Turning the potentiometer on Board B should smoothly change the LED brightness on Board A. If Board A loses power, Board B detects the disconnect and resumes scanning — reconnecting automatically once Board A comes back.

---

## 6. Reference Links

* [MicroPython `aioble` library (GitHub)](https://github.com/micropython/micropython-lib/tree/master/micropython/bluetooth/aioble)
* [MicroPython `bluetooth` module reference](https://docs.micropython.org/en/latest/library/bluetooth.html)
* [MicroPython `asyncio` reference](https://docs.micropython.org/en/latest/library/asyncio.html)
* [Python `struct` byte order reference](https://docs.python.org/3/library/struct.html#byte-order-size-and-alignment)

---

## Next Step

You can now build both BLE peripherals and centrals — broadcasting sensor data, receiving commands, and linking two boards directly.

Continue to:

[**Section 12: Comprehensive Projects →**](./12fun-project)