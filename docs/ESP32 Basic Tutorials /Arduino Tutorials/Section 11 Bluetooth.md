---
sidebar_position: 11
title: Bluetooth Communication
description: Learn how to use Bluetooth Low Energy (BLE) on ESP32 for wireless communication with smartphones and other devices.
---

# Bluetooth Communication

The ESP32 includes built-in Bluetooth functionality, making it ideal for wireless communication projects. Bluetooth enables devices to exchange data without requiring Wi-Fi or an Internet connection. It is commonly used in wearable devices, wireless sensors, mobile applications, smart home systems, and IoT products. :contentReference[oaicite:0]{index=0}

In this tutorial, you will learn:

- What Bluetooth is
- Bluetooth Classic vs BLE
- BLE terminology
- Creating a BLE Server
- Sending data to a smartphone
- Receiving data from a smartphone
- Common BLE applications

---

# What is Bluetooth?

Bluetooth is a short-range wireless communication technology designed for exchanging data between nearby devices.

Examples include:

- Smartphones
- Smart Watches
- Fitness Bands
- Wireless Sensors
- ESP32 Development Boards
- Medical Devices

Bluetooth eliminates the need for cables while consuming very little power. :contentReference[oaicite:1]{index=1}

---

# Bluetooth Types

Bluetooth on ESP32 is generally divided into two categories:

## Bluetooth Classic

Bluetooth Classic is designed for continuous and higher-bandwidth communication.

Examples:

- Wireless Speakers
- Audio Streaming
- Wireless Keyboards
- Wireless Mice

---

## Bluetooth Low Energy (BLE)

BLE is optimized for:

- Low Power Consumption
- Sensor Data Transfer
- IoT Devices
- Wearable Electronics

BLE is the preferred choice for most modern ESP32 IoT applications. :contentReference[oaicite:2]{index=2}

---

# Why Use BLE?

BLE offers several advantages:

- Low Power Consumption
- Fast Device Discovery
- Smartphone Compatibility
- Reliable Communication
- Suitable for Battery-Powered Devices

Common BLE projects include:

- Temperature Monitoring
- Health Tracking
- Home Automation
- Smart Agriculture
- Asset Tracking

---

# BLE Architecture

BLE communication is based on two important concepts:

## GAP

GAP stands for:

```text
Generic Access Profile
```

GAP handles:

- Advertising
- Device Discovery
- Connection Management

Simply put, GAP helps devices find and connect to each other. :contentReference[oaicite:3]{index=3}

---

## GATT

GATT stands for:

```text
Generic Attribute Profile
```

GATT defines:

- Services
- Characteristics
- Data Exchange Rules

Once devices are connected, GATT manages the actual data transfer. :contentReference[oaicite:4]{index=4}

---

# Understanding Services and Characteristics

BLE organizes information into:

```text
BLE Device
 ├── Service
 │     ├── Characteristic
 │     ├── Characteristic
 │
 └── Service
       ├── Characteristic
```

### Service

A Service groups related data.

Example:

```text
Temperature Service
```

---

### Characteristic

A Characteristic contains actual data.

Example:

```text
Temperature = 28.5°C
```

Each service and characteristic is identified using a unique UUID.

---

# Installing Required Libraries

The ESP32 Arduino framework includes BLE support.

Required libraries:

```cpp
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
```

These libraries allow the ESP32 to create BLE servers and exchange data.

---

# Example 1: Create a BLE Server

This example creates a BLE device that can be discovered by a smartphone.

```cpp
#include <BLEDevice.h>
#include <BLEServer.h>

void setup()
{
  Serial.begin(115200);

  BLEDevice::init(
    "Tarangify ESP32");

  BLEServer *server =
  BLEDevice::createServer();

  Serial.println(
    "BLE Server Started");
}

void loop()
{

}
```

---

# How It Works

Initialize BLE:

```cpp
BLEDevice::init(
"Tarangify ESP32");
```

Create a BLE Server:

```cpp
BLEDevice::createServer();
```

The ESP32 is now ready for BLE communication.

---

# Example 2: Send Data Using BLE

This example publishes sensor data through a BLE Characteristic.

```cpp
#include <BLEDevice.h>
#include <BLEServer.h>

BLECharacteristic *characteristic;

void setup()
{
  BLEDevice::init(
    "Tarangify ESP32");

  BLEServer *server =
  BLEDevice::createServer();

  BLEService *service =
  server->createService(
  "12345678-1234-1234-1234-1234567890AB");

  characteristic =
  service->createCharacteristic(
  "87654321-4321-4321-4321-BA0987654321",
  BLECharacteristic::PROPERTY_READ |
  BLECharacteristic::PROPERTY_NOTIFY);

  characteristic->setValue(
  "Hello BLE");

  service->start();

  BLEAdvertising *advertising =
  BLEDevice::getAdvertising();

  advertising->start();
}

void loop()
{

}
```

---

# Testing with a Smartphone

Install a BLE scanner application such as:

- LightBlue
- nRF Connect

Steps:

1. Open the app.
2. Scan for nearby BLE devices.
3. Find:

```text
Tarangify ESP32
```

4. Connect to the device.
5. Read the characteristic value.

Output:

```text
Hello BLE
```

BLE scanner applications are commonly used for testing ESP32 BLE projects. :contentReference[oaicite:5]{index=5}

---

# Example 3: Send Sensor Data

You can send live sensor readings.

```cpp
int sensorValue =
analogRead(3);

characteristic->setValue(
String(sensorValue).c_str());

characteristic->notify();
```

This updates the connected smartphone with new values.

---

# BLE Notifications

Notifications allow the ESP32 to automatically push updates.

```cpp
characteristic->notify();
```

Benefits:

- Real-Time Updates
- Lower Communication Overhead
- Better User Experience

---

# Useful BLE Functions

## Initialize BLE

```cpp
BLEDevice::init(
"Device Name");
```

## Create Server

```cpp
BLEDevice::createServer();
```

## Create Service

```cpp
server->createService(
uuid);
```

## Create Characteristic

```cpp
service->createCharacteristic(
uuid,
properties);
```

## Set Value

```cpp
characteristic->setValue(
"value");
```

## Notify Client

```cpp
characteristic->notify();
```

---

# BLE vs Wi-Fi

| Feature | BLE | Wi-Fi |
|----------|----------|----------|
| Power Consumption | Very Low | Higher |
| Range | Short | Longer |
| Internet Access | No | Yes |
| Data Rate | Moderate | High |
| Ideal For | Sensors | Web Applications |

---

# Practical Applications

BLE is commonly used in:

- Smart Watches
- Fitness Trackers
- Health Monitoring Devices
- Temperature Sensors
- Smart Locks
- Industrial Monitoring
- Wireless Data Logging
- Home Automation

BLE has become one of the most widely used wireless technologies in IoT and wearable products because of its low power requirements. :contentReference[oaicite:6]{index=6}

---

# Project Ideas

After learning BLE, try building:

1. BLE Temperature Monitor
2. Battery Status Broadcaster
3. Wireless Sensor Node
4. Smart Plant Monitoring System
5. BLE-Controlled RGB LED
6. BLE-Based Attendance System

---

# Summary

In this tutorial, you learned:

- What Bluetooth is
- Bluetooth Classic vs BLE
- GAP and GATT concepts
- Services and Characteristics
- How to create a BLE Server
- How to send data to a smartphone
- How BLE notifications work
- Practical BLE applications

In the next tutorial, we will learn how to build complete ESP32 IoT projects by combining sensors, Wi-Fi, Bluetooth, displays, and web interfaces.
