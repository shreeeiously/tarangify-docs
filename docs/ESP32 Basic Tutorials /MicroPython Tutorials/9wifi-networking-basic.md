---
id: wifi-networking-basic
title: Wi-Fi Networking Basics
sidebar_label: Wi-Fi Networking Basics
sidebar_position: 10
description: Scan for Wi-Fi networks, connect as a client, create a hotspot, and configure static IPs using MicroPython's network module.
---

# Section 9: Wi-Fi Networking Basics

This section covers the four fundamental Wi-Fi operations you'll use on ESP32 with MicroPython: scanning nearby networks, connecting to one as a client, creating your own hotspot, and configuring a static IP in either mode.

:::info

Make sure you've completed [**Section 1: Set Up Development Environment**](./micropython-getting-started) through [**Section 8: SPI Communication**](./spi-communication) before starting this section.

:::

Most ESP32-series chips include built-in Wi-Fi (a handful of variants skip it for cost or specialization reasons — check the specific chip's specs if you're unsure). ESP32's Wi-Fi supports three modes:

- **STA (Station)** — the board connects to an existing router/access point as a client.
- **AP (Access Point)** — the board creates its own network for other devices to join.
- **AP+STA** — both simultaneously: connected upstream while also hosting a hotspot.

All of this is driven through MicroPython's built-in `network` module.

---

## 1. Example 1: Scanning for Networks

A quick scan of nearby Wi-Fi networks — useful for confirming your board's radio works, or for letting a user pick their network from a list at setup time.

```python
import time
import network

def get_security_name(security_type):
    """Convert security type to a readable string"""
    if security_type == 0:
        return "open"
    elif security_type == 1:
        return "WEP"
    elif security_type == 2:
        return "WPA-PSK"
    elif security_type == 3:
        return "WPA2-PSK"
    elif security_type == 4:
        return "WPA/WPA2-PSK"
    else:
        return "unknown"

wlan = network.WLAN(network.STA_IF)
wlan.active(True)

print("Setup done")

while True:
    print("Scan start")
    networks = wlan.scan()
    print("Scan done")

    if len(networks) == 0:
        print("no networks found")
    else:
        print(f"{len(networks)} networks found")
        print("Nr | SSID                             | RSSI | CH | Encryption")
        for i, net in enumerate(networks):
            # each entry: (ssid, bssid, channel, RSSI, security, hidden)
            ssid = net[0].decode('utf-8') if net[0] else "Hidden"
            rssi = net[3]
            channel = net[2]
            security = net[4]
            print(f"{i+1:2d} | {ssid:32.32s} | {rssi:4d} | {channel:2d} | {get_security_name(security)}")

    print("")
    time.sleep(10)
```

**How it works:**

- `network.WLAN(network.STA_IF)` creates a WLAN interface object in Station mode.
- `wlan.active(True)` powers up the Wi-Fi radio — this needs to happen before any other Wi-Fi call.
- `wlan.scan()` is a blocking call: it performs a full scan and only returns once complete, giving back a list of tuples in `(ssid, bssid, channel, RSSI, security, hidden)` format.
  - `ssid` comes back as raw bytes, hence the `.decode('utf-8')`.
  - `RSSI` is signal strength in dBm — negative, with values closer to `0` meaning a stronger signal.
  - `security` is a numeric code, which `get_security_name()` translates into something readable.

:::tip

A soft reset generally doesn't reset the Wi-Fi radio's internal state. If you need Wi-Fi to fully reinitialize, either explicitly call `wlan.active(False)` first, or do a full hard reset.

:::

---

## 2. Example 2: Connecting as a Client (STA Mode)

```python
import time
import network

SSID = "Maker"          # your Wi-Fi network name
PASSWORD = "12345678"   # your Wi-Fi password

wlan = network.WLAN(network.STA_IF)
wlan.active(True)

print(f"Connecting to {SSID}")
wlan.connect(SSID, PASSWORD)

while not wlan.isconnected():
    time.sleep(0.5)
    print(".", end="")

print("")
print("WiFi connected.")
print("IP config:", wlan.ifconfig())
```

**How it works:**

- `wlan.connect(ssid, password)` kicks off the connection asynchronously — it returns immediately while the actual handshake happens in the background.
- `wlan.isconnected()` reports the current connection state; the `while` loop simply polls it until it flips to `True`.
- `wlan.ifconfig()` returns a 4-tuple: `(ip, subnet_mask, gateway, dns_server)`. Index `0` is the assigned IP address.

Update `SSID` and `PASSWORD` to match your actual network, run it, and you should see connection progress dots followed by the assigned IP address once connected.

---

## 3. Example 3: Creating a Hotspot (AP Mode)

```python
import network

SSID = "ESP32-S3-TEST"   # hotspot name
PASSWORD = "12345678"    # hotspot password (8+ characters)

ap = network.WLAN(network.AP_IF)
ap.active(True)

print("Configuring access point...")
ap.config(essid=SSID, password=PASSWORD, authmode=network.AUTH_WPA_WPA2_PSK)

ip = ap.ifconfig()[0]
print(f"AP IP address: {ip}")
print("AP started")
```

**How it works:** `network.WLAN(network.AP_IF)` creates the interface in Access Point mode instead of Station mode. `ap.config(essid=..., password=...)` sets the hotspot's broadcast name and password — note the password must be at least 8 characters, a WPA2 requirement.

Run this and the board broadcasts its own network, printing the AP's IP address (the address other devices will reach it at once connected).

---

## 4. Example 4: Setting a Static IP

Sometimes you want a fixed, predictable IP address rather than one assigned dynamically by DHCP — useful for reliably reaching a device at the same address every time.

### 4.1 Static IP in STA Mode

Building on Example 2:

```python
import time
import network

SSID = "Maker"
PASSWORD = "12345678"

# adjust these to match your actual network
STATIC_IP = "192.168.137.100"
SUBNET = "255.255.255.0"
GATEWAY = "192.168.137.1"
DNS = "192.168.137.1"

wlan = network.WLAN(network.STA_IF)
wlan.active(True)

# set the static IP before connecting
wlan.ifconfig((STATIC_IP, SUBNET, GATEWAY, DNS))

print(f"Connecting to {SSID}")
wlan.connect(SSID, PASSWORD)

while not wlan.isconnected():
    time.sleep(0.5)
    print(".", end="")

print("")
print("WiFi connected.")
print(f"IP address: {wlan.ifconfig()[0]}")
```

`wlan.ifconfig((STATIC_IP, SUBNET, GATEWAY, DNS))` takes a 4-tuple of strings to fix the interface's addressing instead of relying on DHCP.

:::warning

Make sure the static IP, gateway, and subnet you choose actually match your local network, and that the IP isn't already claimed by another device — a conflict here will cause connectivity issues that can be confusing to debug.

:::

:::tip

Set the static IP *before* calling `connect()`, so the device establishes its connection using that configuration from the start rather than picking up a DHCP lease first.

:::

### 4.2 Static IP in AP Mode

Building on Example 3, this sets a custom address range for the hotspot itself:

```python
import network

SSID = "ESP32-S3-TEST"
PASSWORD = "12345678"

STATIC_IP = "192.168.5.1"
SUBNET = "255.255.255.0"
GATEWAY = "192.168.5.1"
DNS = "192.168.5.1"

ap = network.WLAN(network.AP_IF)
ap.active(True)

print("Configuring access point...")

# set the static IP after activating, before configuring the SSID/password
ap.ifconfig((STATIC_IP, SUBNET, GATEWAY, DNS))
ap.config(essid=SSID, password=PASSWORD)

print(f"AP IP address: {ap.ifconfig()[0]}")
print("AP started")
```

`ap.ifconfig(...)` works the same way here, just applied to the AP interface — useful when you want devices connecting to your hotspot to land on a predictable subnet.

---

## 5. Reference Links

* [MicroPython ESP32 Quick Reference — Networking](https://docs.micropython.org/en/latest/esp32/quickref.html#networking)
* [MicroPython `network` module reference](https://docs.micropython.org/en/latest/library/network.html)
* [MicroPython `network.WLAN` class reference](https://docs.micropython.org/en/latest/library/network.WLAN.html)
