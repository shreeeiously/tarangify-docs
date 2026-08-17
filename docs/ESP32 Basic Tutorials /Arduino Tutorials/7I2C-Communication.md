---
sidebar_position: 7
title: I2C Communication
description: Learn how to use I2C communication on ESP32 to connect sensors, displays, and other peripherals.
---

# Section 7: I2C Communication

I2C (Inter-Integrated Circuit), sometimes written as I²C or IIC, is a popular communication protocol used to connect multiple devices using only two signal wires. It is commonly used for sensors, OLED displays, RTC modules, EEPROMs, and many other peripherals. :contentReference[oaicite:0]{index=0}

In this tutorial, you will learn:

- What I2C is
- How I2C communication works
- SDA and SCL lines
- Device addressing
- I2C Scanner
- Connecting an OLED display
- Communication between ESP32 boards

---

# What is I2C?

I2C is a synchronous serial communication protocol that allows multiple devices to communicate over the same bus using only two wires. :contentReference[oaicite:1]{index=1}

The two signals are:

| Signal | Description |
|----------|----------|
| SDA | Serial Data Line |
| SCL | Serial Clock Line |

In addition to SDA and SCL, all devices must share a common GND connection. :contentReference[oaicite:2]{index=2}

---

# Why Use I2C?

I2C is popular because it:

- Uses only two communication wires
- Supports multiple devices on one bus
- Allows easy expansion
- Requires minimal GPIO pins
- Is supported by thousands of sensors and modules

Common I2C devices include:

- OLED Displays
- Temperature Sensors
- Humidity Sensors
- RTC Modules
- EEPROM Memory
- Accelerometers
- Environmental Sensors

---

# I2C Bus Structure

```text
          ESP32
       ┌─────────┐
 SDA ──┤         ├──────── Sensor
 SCL ──┤         ├──────── OLED
 GND ──┤         ├──────── RTC
       └─────────┘
```

All devices share the same SDA and SCL lines. Each device has a unique address. :contentReference[oaicite:3]{index=3}

---

# I2C Device Address

Every I2C device has an address.

Examples:

```text
OLED Display      → 0x3C
RTC DS3231        → 0x68
BME280 Sensor     → 0x76
```

When the ESP32 communicates, it sends the device address first.

Only the device with the matching address responds. :contentReference[oaicite:4]{index=4}

---

# Pull-Up Resistors

I2C uses an open-drain architecture.

Because of this, SDA and SCL require pull-up resistors connected to 3.3V. Many modules already include these resistors onboard. :contentReference[oaicite:5]{index=5}

Typical values:

```text
4.7kΩ
10kΩ
```

---

# I2C on ESP32

The ESP32 uses the Arduino Wire library for I2C communication.

```cpp
#include <Wire.h>
```

Initialize I2C:

```cpp
Wire.begin();
```

Or specify custom pins:

```cpp
Wire.begin(8, 9);
```

Where:

```text
8 = SDA
9 = SCL
```

ESP32 allows I2C to be assigned to many GPIO pins, providing greater flexibility than traditional Arduino boards. :contentReference[oaicite:6]{index=6}

---

# Example 1: I2C Scanner

Before using an I2C device, it is useful to identify its address.

The I2C Scanner checks all possible addresses and reports any detected devices. :contentReference[oaicite:7]{index=7}

```cpp
#include <Wire.h>

void setup()
{
  Serial.begin(115200);
  Wire.begin();
}

void loop()
{
  Serial.println("Scanning...");

  for(byte address = 1;
      address < 127;
      address++)
  {
    Wire.beginTransmission(address);

    if(Wire.endTransmission() == 0)
    {
      Serial.print("Device Found: 0x");
      Serial.println(address, HEX);
    }
  }

  delay(5000);
}
```

---

# Example Output

```text
Scanning...

Device Found: 0x3C
```

This indicates an OLED display is connected at address 0x3C.

---

# Example 2: OLED Display Connection

## Connections

| OLED | ESP32 |
|--------|--------|
| VCC | 3.3V |
| GND | GND |
| SDA | GPIO 8 |
| SCL | GPIO 9 |

---

## Code

```cpp
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

Adafruit_SSD1306 display(
SCREEN_WIDTH,
SCREEN_HEIGHT,
&Wire,
-1);

void setup()
{
  Wire.begin(8, 9);

  display.begin(
  SSD1306_SWITCHCAPVCC,
  0x3C);

  display.clearDisplay();

  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(0,20);

  display.println("Tarangify");

  display.display();
}

void loop()
{

}
```

---

# How It Works

Initialize I2C:

```cpp
Wire.begin(8, 9);
```

Initialize OLED:

```cpp
display.begin(
SSD1306_SWITCHCAPVCC,
0x3C);
```

Display text:

```cpp
display.println("Tarangify");
```

The OLED will show:

```text
Tarangify
```

---

# Reading Data from an I2C Device

Request data from a sensor:

```cpp
Wire.requestFrom(address, bytes);
```

Example:

```cpp
Wire.requestFrom(0x68, 1);
```

Read received data:

```cpp
byte value = Wire.read();
```

These functions form the foundation of I2C communication. :contentReference[oaicite:8]{index=8}

---

# Communication Between Two ESP32 Boards

Two ESP32 boards can communicate using I2C.

Example wiring:

```text
ESP32 A SDA → ESP32 B SDA
ESP32 A SCL → ESP32 B SCL
ESP32 A GND → ESP32 B GND
```

Pull-up resistors should be connected to SDA and SCL for reliable operation. :contentReference[oaicite:9]{index=9}

---

# Common Wire Library Functions

## Initialize I2C

```cpp
Wire.begin();
```

## Start Transmission

```cpp
Wire.beginTransmission(address);
```

## Send Data

```cpp
Wire.write(data);
```

## End Transmission

```cpp
Wire.endTransmission();
```

## Request Data

```cpp
Wire.requestFrom(address, bytes);
```

## Read Data

```cpp
Wire.read();
```

---

# I2C vs UART vs SPI

| Feature | I2C | UART | SPI |
|----------|----------|----------|----------|
| Wires | 2 | 2 | 4+ |
| Speed | Medium | Medium | High |
| Addressing | Yes | No | No |
| Multiple Devices | Yes | Limited | Yes |
| Complexity | Easy | Easy | Medium |

---

# Practical Applications

I2C is widely used in:

- OLED Displays
- RTC Modules
- SHT3x Sensors
- BME280 Sensors
- MPU6050 Modules
- EEPROM Memory
- LCD I2C Modules
- Environmental Monitoring Systems

---

# Summary

In this tutorial, you learned:

- What I2C is
- How SDA and SCL work
- Why pull-up resistors are required
- How device addressing works
- How to scan for I2C devices
- How to connect an OLED display
- Basic Wire library functions

In the next tutorial, we will learn about SPI Communication and how it provides higher-speed data transfer for displays, SD cards, and other peripherals.