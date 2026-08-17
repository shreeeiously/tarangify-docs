---
id: web-server
title: Web Server
sidebar_label: Web Server
sidebar_position: 11
description: Build a simple HTTP web server on ESP32 with MicroPython's socket module, and control an LED from a browser in both STA and AP mode.
---

# Section 10: Web Server

ESP32's built-in Wi-Fi means it can act as a small web server of its own — serving a browser-based interface for monitoring sensors or controlling hardware, all from the device itself. This section builds that up step by step: a static "Hello World" page, then a page with a working LED toggle, first over your home network and then over the board's own hotspot.

:::info

Make sure you've completed [**Section 1: Set Up Development Environment**](./getting-started) through [**Section 9: Wi-Fi Networking Basics**](./wifi-networking-basic) before starting this section.

:::

---

## 1. Web Servers in MicroPython

MicroPython's built-in `socket` module is the most direct way to build a web server — no extra libraries to install, and it forces you to actually see how HTTP works under the hood rather than hiding it behind a framework. (Higher-level options like Microdot exist too, but `socket` is the better starting point for understanding the fundamentals.)

Any HTTP server built this way follows the same basic sequence:

1. **Create a socket** — the underlying network communication endpoint.
2. **Bind** it to an IP address and port (port 80 is the HTTP default).
3. **Listen** for incoming connection attempts.
4. **Accept** a connection once a client (like a browser) connects.
5. **Receive** the client's HTTP request.
6. **Send** back an HTTP response (HTML, in this case).
7. **Close** the connection.

---

## 2. Example 1: A Basic "Hello World" Server (STA Mode)

The simplest possible web server: connect to your home Wi-Fi, then serve a single static page.

### 2.1 Code

```python
import time
import network
import socket

SSID = "Maker"          # your Wi-Fi name
PASSWORD = "12345678"   # your Wi-Fi password

def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print('Connecting to network...')
        wlan.connect(SSID, PASSWORD)
        while not wlan.isconnected():
            time.sleep(0.5)
            print('.', end='')
    print('\nNetwork connected')
    print('IP address:', wlan.ifconfig()[0])
    return wlan

def web_page():
    html = """<!DOCTYPE html> <html>
<head><meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1">
<title>ESP32 MicroPython Web Server</title>
</head><body>
<h1>Hello World!</h1>
<p>Hello from ESP32 MicroPython</p>
</body></html>
"""
    return html

connect_wifi()

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('', 80))
s.listen(5)

print("Web server is running...")

while True:
    try:
        conn, addr = s.accept()
        print('Got a connection from %s' % str(addr))

        request = conn.recv(1024)
        # print('Content = %s' % str(request))  # uncomment to inspect the raw request

        response = web_page()
        conn.send('HTTP/1.1 200 OK\n')
        conn.send('Content-Type: text/html\n')
        conn.send('Connection: close\n\n')
        conn.sendall(response)

        conn.close()

    except OSError as e:
        conn.close()
        print('Connection closed')
```

### 2.2 How It Works

- `socket.socket(socket.AF_INET, socket.SOCK_STREAM)` creates a TCP socket over IPv4.
- `s.bind(('', 80))` binds it to port 80 (the standard HTTP port) on every available network interface.
- `s.listen(5)` starts listening, with up to 5 pending connections queued before new ones get rejected.
- `s.accept()` blocks until a client connects, then returns a fresh socket (`conn`) dedicated to that client, plus their address.
- `conn.recv(1024)` reads up to 1024 bytes of the incoming HTTP request.
- Before sending the actual HTML, the server sends proper HTTP response headers — `HTTP/1.1 200 OK` tells the browser the request succeeded, and `Content-Type: text/html` tells it what kind of content is coming.

### 2.3 Try It

Update `SSID` and `PASSWORD`, run the script, and note the IP address printed in Thonny's Shell. Enter that IP in a browser on the same network, and you should see the "Hello World!" page.

---

## 3. Example 2: Controlling an LED From a Web Page (STA Mode)

Building on the basic server, this example parses the requested URL path to control an LED — clicking a link on the page sends a request the server interprets as an on/off command.

### 3.1 Wire It Up

Same LED wiring as [Section 3](./digital-io#21-wire-it-up) — GPIO7 through a 330Ω resistor to the LED, GND on the other leg.

### 3.2 Code

```python
import time
import network
import socket
from machine import Pin

led = Pin(7, Pin.OUT)
led.value(0)  # start off

SSID = "Maker"
PASSWORD = "12345678"

def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print('Connecting to network...')
        wlan.connect(SSID, PASSWORD)
        while not wlan.isconnected():
            time.sleep(0.5)
            print('.', end='')
    print('\nNetwork connected')
    print('IP address:', wlan.ifconfig()[0])
    return wlan

def web_page():
    if led.value() == 1:
        gpio_state = "ON"
        button_html = '<a href="/ledoff">Turn off the LED</a>'
    else:
        gpio_state = "OFF"
        button_html = '<a href="/ledon">Turn on the LED</a>'

    html = """<!DOCTYPE html><html>
<head><meta name="viewport" content="width=device-width, initial-scale=1">
<title>ESP32S3 Test</title>
</head>
<body><h1>ESP32 Web Server</h1>
<p>GPIO state: <strong>""" + gpio_state + """</strong></p>
""" + button_html + """
</body></html>"""
    return html

connect_wifi()

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('', 80))
s.listen(5)

print("Web server is running...")

while True:
    try:
        conn, addr = s.accept()
        print('Got a connection from %s' % str(addr))

        request = conn.recv(1024)
        request = str(request)
        # print(request)  # uncomment to inspect the raw request

        if 'GET /ledon' in request:
            print('LED ON')
            led.value(1)
        elif 'GET /ledoff' in request:
            print('LED OFF')
            led.value(0)

        response = web_page()
        conn.send('HTTP/1.1 200 OK\n')
        conn.send('Content-Type: text/html\n')
        conn.send('Connection: close\n\n')
        conn.sendall(response)

        conn.close()

    except OSError as e:
        conn.close()
        print('Connection closed')
```

### 3.3 How It Works

**Parsing the request:**

- `conn.recv()` returns raw bytes, so `request = str(request)` converts it to a string for easy text matching.
- Clicking either link on the page sends a browser `GET` request to that specific path (`/ledon` or `/ledoff`). Checking `'GET /ledon' in request` is a simple (if a little blunt) way to detect which path was requested and act on it.

**Dynamic HTML:**

- `web_page()` checks the LED's *current* actual state (`led.value()`) each time it's called, and builds the page's text and link accordingly — so the page always reflects reality rather than some stale assumption. If the LED is on, it offers a "turn off" link, and vice versa.

### 3.4 Try It

Load the ESP32's IP address in a browser. You'll see the current LED state and a link to flip it — clicking it toggles the LED and reloads the page showing the new state.

---

## 4. Example 3: Controlling an LED From a Web Page (AP Mode)

Same idea as Example 2, but the board hosts its own hotspot instead of joining an existing network — useful anywhere you don't want to depend on a router being present (a portable project, a demo booth, and so on).

### 4.1 Wire It Up

Same LED circuit as Example 2.

### 4.2 Code

```python
import time
import network
import socket
from machine import Pin

led = Pin(7, Pin.OUT)
led.value(0)

SSID = "ESP32-S3-TEST"   # hotspot name
PASSWORD = "12345678"    # hotspot password (8+ characters)

def start_ap():
    ap = network.WLAN(network.AP_IF)
    ap.active(True)
    ap.config(essid=SSID, password=PASSWORD, authmode=network.AUTH_WPA_WPA2_PSK)
    while not ap.active():
        pass
    print('AP started')
    print('IP address:', ap.ifconfig()[0])

def web_page():
    if led.value() == 1:
        gpio_state = "ON"
        button_html = '<a href="/ledoff">Turn off the LED</a>'
    else:
        gpio_state = "OFF"
        button_html = '<a href="/ledon">Turn on the LED</a>'

    html = """<!DOCTYPE html><html>
<head><meta name="viewport" content="width=device-width, initial-scale=1">
<title>ESP32S3 Test</title>
</head>
<body><h1>ESP32 Web Server</h1>
<p>GPIO state: <strong>""" + gpio_state + """</strong></p>
""" + button_html + """
</body></html>"""
    return html

start_ap()

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('', 80))
s.listen(5)

print("Web server is running...")

while True:
    try:
        conn, addr = s.accept()
        print('Got a connection from %s' % str(addr))

        request = conn.recv(1024)
        request = str(request)

        if 'GET /ledon' in request:
            print('LED ON')
            led.value(1)
        elif 'GET /ledoff' in request:
            print('LED OFF')
            led.value(0)

        response = web_page()
        conn.send('HTTP/1.1 200 OK\n')
        conn.send('Content-Type: text/html\n')
        conn.send('Connection: close\n\n')
        conn.sendall(response)

        conn.close()

    except OSError as e:
        conn.close()
        print('Connection closed')
```

### 4.3 How It Works

Everything's the same as Example 2 except the network setup: `network.WLAN(network.AP_IF)` creates the interface in Access Point mode, and `ap.config(essid=..., password=..., authmode=...)` sets up the hotspot's name, password, and WPA2 security. In AP mode, ESP32's default self-assigned IP address is almost always `192.168.4.1`.

### 4.4 Try It

Run the script, then connect a phone or laptop to the ESP32's own Wi-Fi network (matching the `SSID`/`PASSWORD` you set). Once connected, browse to `192.168.4.1` — you'll see the same LED control page as before, now served entirely from the board itself with no router involved.

---

## 5. Reference Links

* [MicroPython ESP32 Quick Reference — Networking](https://docs.micropython.org/en/latest/esp32/quickref.html#networking)
* [MicroPython `socket` module reference](https://docs.micropython.org/en/latest/library/socket.html)
* [MicroPython `network` module reference](https://docs.micropython.org/en/latest/library/network.html)

