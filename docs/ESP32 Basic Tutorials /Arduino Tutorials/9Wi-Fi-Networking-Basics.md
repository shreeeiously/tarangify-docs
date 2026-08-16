---
sidebar_position: 9
title: Wi-Fi Networking Basics
description: Learn how to connect ESP32 to Wi-Fi networks, scan available networks, create access points, and configure network settings.
---

# Wi-Fi Networking Basics

One of the most powerful features of the ESP32 is its built-in Wi-Fi capability. This allows the ESP32 to connect to wireless networks, communicate with cloud services, host web servers, and build Internet of Things (IoT) applications. Most ESP32 development boards include integrated 2.4 GHz Wi-Fi functionality. :contentReference[oaicite:0]{index=0}

In this tutorial, you will learn:

- What Wi-Fi is
- Wi-Fi modes supported by ESP32
- Scanning nearby Wi-Fi networks
- Connecting to a Wi-Fi network
- Creating a Wi-Fi hotspot
- Managing multiple networks
- Configuring a static IP address

---

# What is Wi-Fi?

Wi-Fi is a wireless networking technology that allows devices to communicate over radio waves without physical cables.

Using Wi-Fi, an ESP32 can:

- Connect to the Internet
- Exchange data with cloud platforms
- Communicate with smartphones
- Host web applications
- Control IoT devices remotely

---

# ESP32 Wi-Fi Modes

The ESP32 supports three primary Wi-Fi operating modes: :contentReference[oaicite:1]{index=1}

| Mode | Description |
|--------|--------|
| STA | Connects to an existing Wi-Fi network |
| AP | Creates its own Wi-Fi hotspot |
| AP + STA | Works as both client and hotspot |

---

# Station Mode (STA)

In Station Mode, the ESP32 behaves like a normal device connected to a Wi-Fi router.

```text
ESP32
   │
   ▼
Wi-Fi Router
   │
   ▼
Internet
```

This is the most commonly used mode in IoT projects.

---

# Access Point Mode (AP)

In Access Point Mode, the ESP32 creates its own Wi-Fi network.

```text
Phone
   │
Laptop
   │
ESP32 Hotspot
```

Other devices can connect directly to the ESP32.

---

# AP + STA Mode

In this mode, the ESP32 simultaneously:

- Connects to an existing Wi-Fi network
- Creates its own hotspot

This is useful for advanced IoT applications and device configuration portals. :contentReference[oaicite:2]{index=2}

---

# Including the WiFi Library

To use Wi-Fi functions in Arduino:

```cpp
#include <WiFi.h>
```

This library provides all networking features required for ESP32 Wi-Fi applications.

---

# Example 1: Scan Available Wi-Fi Networks

This example scans nearby Wi-Fi networks and displays their information. :contentReference[oaicite:3]{index=3}

```cpp
#include <WiFi.h>

void setup()
{
  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();

  delay(1000);

  Serial.println("Scanning Wi-Fi...");
}

void loop()
{
  int networks = WiFi.scanNetworks();

  Serial.println("Scan Complete");

  for(int i = 0; i < networks; i++)
  {
    Serial.print(i + 1);
    Serial.print(": ");

    Serial.print(
      WiFi.SSID(i));

    Serial.print("  RSSI: ");

    Serial.println(
      WiFi.RSSI(i));
  }

  delay(5000);
}
```

---

# Example Output

```text
1: Home_WiFi      RSSI: -45
2: Office_WiFi    RSSI: -60
3: ESP32_AP       RSSI: -70
```

---

# Understanding RSSI

RSSI stands for:

```text
Received Signal Strength Indicator
```

Signal quality example:

| RSSI | Signal Strength |
|--------|--------|
| -30 dBm | Excellent |
| -50 dBm | Very Good |
| -70 dBm | Good |
| -90 dBm | Weak |

---

# Example 2: Connect to a Wi-Fi Network

This example connects the ESP32 to a wireless router. :contentReference[oaicite:4]{index=4}

```cpp
#include <WiFi.h>

const char* ssid =
"YourWiFiName";

const char* password =
"YourPassword";

void setup()
{
  Serial.begin(115200);

  Serial.print("Connecting");

  WiFi.mode(WIFI_STA);

  WiFi.begin(
    ssid,
    password);

  while(WiFi.status()
        != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println(
    "Wi-Fi Connected");

  Serial.print("IP Address: ");
  Serial.println(
    WiFi.localIP());
}

void loop()
{

}
```

---

# Example Output

```text
Connecting.....
Wi-Fi Connected
IP Address: 192.168.1.105
```

The assigned IP address allows the ESP32 to communicate with other devices on the network.

---

# Checking Connection Status

```cpp
if(WiFi.status()
   == WL_CONNECTED)
{
  Serial.println(
    "Connected");
}
```

Common status values:

| Status | Meaning |
|----------|----------|
| WL_CONNECTED | Connected Successfully |
| WL_IDLE_STATUS | Idle |
| WL_DISCONNECTED | Not Connected |

---

# Example 3: Create an ESP32 Hotspot

The ESP32 can create its own Wi-Fi network. :contentReference[oaicite:5]{index=5}

```cpp
#include <WiFi.h>

const char* apName =
"Tarangify_ESP32";

const char* apPassword =
"12345678";

void setup()
{
  Serial.begin(115200);

  WiFi.softAP(
    apName,
    apPassword);

  Serial.println(
    "Access Point Started");

  Serial.print("IP: ");
  Serial.println(
    WiFi.softAPIP());
}

void loop()
{

}
```

---

# Example Output

```text
Access Point Started
IP: 192.168.4.1
```

You can now connect a smartphone or laptop directly to the ESP32 hotspot.

---

# Example 4: Managing Multiple Networks

The ESP32 can automatically connect to the strongest available network using WiFiMulti. :contentReference[oaicite:6]{index=6}

```cpp
#include <WiFi.h>
#include <WiFiMulti.h>

WiFiMulti wifiMulti;

void setup()
{
  Serial.begin(115200);

  wifiMulti.addAP(
    "WiFi_1",
    "Password1");

  wifiMulti.addAP(
    "WiFi_2",
    "Password2");
}

void loop()
{
  if(wifiMulti.run()
     == WL_CONNECTED)
  {
    Serial.println(
      "Connected");
  }

  delay(1000);
}
```

---

# Example 5: Configure a Static IP Address

By default, routers assign IP addresses automatically using DHCP.

You can manually assign an IP address:

```cpp
IPAddress local_IP(
192,168,1,200);

IPAddress gateway(
192,168,1,1);

IPAddress subnet(
255,255,255,0);

WiFi.config(
local_IP,
gateway,
subnet);
```

This is useful for:

- Web Servers
- Home Automation
- Industrial Monitoring
- Fixed Network Devices

---

# Useful Wi-Fi Functions

## Connect to Network

```cpp
WiFi.begin(
ssid,
password);
```

## Disconnect

```cpp
WiFi.disconnect();
```

## Get IP Address

```cpp
WiFi.localIP();
```

## Get Signal Strength

```cpp
WiFi.RSSI();
```

## Get Network Name

```cpp
WiFi.SSID();
```

## Scan Networks

```cpp
WiFi.scanNetworks();
```

---

# Common Wi-Fi Applications

ESP32 Wi-Fi is widely used in:

- Smart Home Systems
- IoT Devices
- Weather Stations
- Remote Monitoring
- Cloud Connectivity
- Mobile Applications
- Data Logging Systems
- Wireless Sensor Networks

---

# Practical Learning Path

After learning Wi-Fi basics, try:

1. Scan nearby Wi-Fi networks
2. Connect to your router
3. Display the IP address
4. Create an ESP32 hotspot
5. Build a web server
6. Control LEDs from a browser

These are often recommended as beginner ESP32 networking projects. :contentReference[oaicite:7]{index=7}

---

# Summary

In this tutorial, you learned:

- What Wi-Fi is
- ESP32 Wi-Fi operating modes
- How to scan nearby networks
- How to connect to a Wi-Fi router
- How to create an ESP32 hotspot
- How to manage multiple networks
- How to configure a static IP address

In the next tutorial, we will learn how to create a Web Server on the ESP32 and control hardware using a web browser.