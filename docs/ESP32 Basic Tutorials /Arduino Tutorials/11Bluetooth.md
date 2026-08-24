---
sidebar_position: 11
title: Bluetooth Communication
description: Learn how to use Bluetooth Low Energy (BLE) on ESP32 for wireless communication with smartphones and other devices.
---

# Section 11: Bluetooth Communication

The ESP32 includes built-in Bluetooth functionality, making it ideal for wireless communication projects. Bluetooth enables devices to exchange data without requiring Wi-Fi or an Internet connection. It is commonly used in wearable devices, wireless sensors, mobile applications, smart home systems, and IoT products. 

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

Bluetooth eliminates the need for cables while consuming very little power. 
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

BLE is the preferred choice for most modern ESP32 IoT applications. 
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
GAP is responsible for managing device connections and broadcasting, and it defines the roles devices play in Bluetooth communication.

GAP defines two primary roles:
- **Peripheral device** : Typically a device that holds data, such as a sensor. It announces its presence through Advertising and waits to be connected. In the examples, the ESP32 will primarily play this role.
- **Central device** : Usually a more powerful device, such as a smartphone or computer. It discovers peripheral devices through Scanning and initiates connections.

![Arduino IDE](/img/11A1.svg)


GAP facilitates interaction between devices through the following processes:

- **Advertising** : Peripheral devices periodically send advertising packets containing information such as the device name and service UUIDs, allowing central devices to discover them.
- **Scanning** : Central devices listen on advertising channels, receive, and parse advertising packets from peripheral devices.
- **Connecting** : The central device sends a connection request to its chosen peripheral device. Once the peripheral accepts, a one-to-one connection is established between the two.

Simply put, GAP helps devices find and connect to each other. 

---

## GATT

GATT stands for:

```text
Generic Attribute Profile
```
GATT (Generic Attribute Profile) becomes effective after devices establish a connection. It defines the framework and format for data exchange. GATT is based on a Client-Server architecture. These two roles typically directly correspond to the GAP roles:

- **GATT Server** : This is the device that holds the data (usually corresponding to the Peripheral in GAP). It stores and provides the data.
- **GATT Client** : This is the device that accesses the data (usually corresponding to the Central in GAP). It sends read/write requests to the server.

The data in GATT is organized in a standardized hierarchical structure:
![Arduino IDE](/img/11A2.svg)


- **Service** : A Service is a logical collection of multiple related "Characteristics", representing a specific function of the device. Each service is identified by a unique UUID. For example, a "Battery Service" might contain a "Battery Level" characteristic.

- **Characteristic** : A Characteristic is the fundamental unit for data exchange, encapsulating a specific data value. A complete characteristic contains:

  - **Value** : The actual stored data.
  - **Properties** : Define the operations a client can perform on the "Value". Common ones include:
    - *Read* : Allows the client to read the value.
    - *Write* : Allows the client to write a value.
    - *Notify* : Allows the server to actively send the new value to the client whenever it changes.
    - *Indicate* : Similar to Notify, but requires the client to acknowledge receipt.
  - **Declaration** : Contains the characteristic's properties, UUID, and its position within the service.

      
- **Descriptor** : A descriptor is optional and provides additional metadata for a characteristic. For instance, it can be used to provide a human-readable description (e.g., "Temperature Measurement"), specify the unit of the value (e.g., "Celsius"), or define a valid range of values.

- **UUID (Universally Unique Identifier)** :A UUID is a 128-bit number used to uniquely identify a service, characteristic, or descriptor. For convenience, the Bluetooth Special Interest Group (SIG) has predefined a set of official short UUIDs (usually 16-bit) for common functions, such as 0x180F for the Battery Service. When developing custom applications, a randomly generated full 128-bit UUID should be used to ensure global uniqueness. All assigned standard UUIDs can be queried on the [SIG official website](https://bitbucket.org/bluetooth-SIG/public/src/main/assigned_numbers/uuids/).

Once devices are connected, GATT manages the actual data transfer.

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

This example configures the ESP32 as a peripheral device to read the analog value from a potentiometer and publish it through a BLE Characteristic. A smartphone app (such as LightBlue) can be used as a central device to connect to the ESP32 and read the value of this characteristic.

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

BLE scanner applications are commonly used for testing ESP32 BLE projects.

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

BLE has become one of the most widely used wireless technologies in IoT and wearable products because of its low power requirements. 

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
