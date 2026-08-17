---
id: intro
title: Overview
sidebar_label: Overview
sidebar_position: 1
---

# Tarangify CoreX-S3 GSM

The **Tarangify CoreX-S3 GSM** is a powerful IoT and embedded development board based on the **ESP32-S3-N16R8** microcontroller and the **SIMCom A7672X 4G LTE Cat-1 module**.

It combines Wi-Fi, Bluetooth Low Energy, 4G LTE cellular connectivity, GNSS positioning, audio support, battery operation, and extensive GPIO expansion in a compact development platform.

The board is designed for applications such as GPS tracking, remote monitoring, industrial automation, smart agriculture, telematics, asset tracking, and cellular IoT devices.

## Key Features

### ESP32-S3

- ESP32-S3-N16R8 dual-core Xtensa LX7 processor
- Up to 240 MHz CPU frequency
- 16 MB Flash
- 8 MB PSRAM
- 2.4 GHz Wi-Fi
- Bluetooth Low Energy 5.0
- Arduino IDE, PlatformIO, and ESP-IDF support

### 4G LTE Connectivity

The board integrates the **SIMCom A7672X** cellular module.

It supports:

- 4G LTE Cat-1
- Cellular data communication
- SMS messaging
- Voice calls
- 2G GSM fallback where supported by the network
- Nano SIM card

The A7672X provides cellular connectivity for applications where Wi-Fi is unavailable or where remote communication is required.

### GNSS Positioning

The CoreX-S3 GSM includes GNSS functionality through the cellular module.

Supported positioning systems include:

- GPS
- GLONASS
- BeiDou

A dedicated GNSS antenna connector is provided on the board.

### Audio

The board provides audio capabilities through:

- Onboard MEMS microphone
- Speaker output connector
- Voice call support
- Voice notification applications

This makes the board suitable for applications such as emergency alert systems, voice-enabled IoT devices, and cellular communication systems.

## Power Supply

The CoreX-S3 GSM supports multiple power options.

### USB Type-C

The USB Type-C connector can be used for:

- Programming
- Debugging
- Power supply

### LiPo Battery

The board supports a **3.7 V LiPo battery** through the onboard battery connector.

An onboard charging circuit is provided for battery charging.

### Battery Monitoring

Battery voltage can be monitored through **GPIO12**.

This allows the ESP32-S3 firmware to measure the battery voltage and implement battery-level monitoring.

## RGB LED

The board includes an onboard **WS2812B RGB LED** connected to:

```text
GPIO48
```

The RGB LED can be controlled using the `Adafruit_NeoPixel` library.

Example:

```cpp
#include <Adafruit_NeoPixel.h>

#define RGB_PIN 48
#define NUM_LEDS 1

Adafruit_NeoPixel rgb(
  NUM_LEDS,
  RGB_PIN,
  NEO_GRB + NEO_KHZ800
);

void setup() {
  rgb.begin();
  rgb.setBrightness(50);
  rgb.show();
}

void loop() {

  // Red
  rgb.setPixelColor(0, rgb.Color(255, 0, 0));
  rgb.show();
  delay(1000);

  // Green
  rgb.setPixelColor(0, rgb.Color(0, 255, 0));
  rgb.show();
  delay(1000);

  // Blue
  rgb.setPixelColor(0, rgb.Color(0, 0, 255));
  rgb.show();
  delay(1000);

  // Off
  rgb.clear();
  rgb.show();
  delay(1000);
}
```

## User Button

The board provides a dedicated user button connected to:

```text
GPIO41
```

The button can be used as a general-purpose user input.

Example:

```cpp
#define BUTTON_PIN 41

void setup() {

  Serial.begin(115200);

  pinMode(BUTTON_PIN, INPUT_PULLUP);

  Serial.println("CoreX-S3 GSM Button Test");
}

void loop() {

  if (digitalRead(BUTTON_PIN) == LOW) {
    Serial.println("Button Pressed");
  }

  delay(100);
}
```

## Status LEDs

The CoreX-S3 GSM includes several status indicators:

* PWR — Power status
* NET — Network status
* RING — Incoming call/ring indication
* STAT — Module status
* CHG — Battery charging status

These LEDs provide a quick indication of the board and cellular module operating states.

## GPIO Expansion

The board provides a **40-pin GPIO header**.

The available interfaces include:

* GPIO
* ADC
* UART
* SPI
* I2C
* PWM

The GPIO header allows external sensors, displays, motors, servos, and other peripherals to be connected.

:::warning 
Important GPIO Note:

GPIO10, GPIO11, and GPIO13 are internally connected to the A7672X module.

:::

## USB Type-C

The USB Type-C connector provides a convenient interface for:

* Programming the ESP32-S3
* Serial debugging
* Powering the board
* Development and testing

## SIM Card

The CoreX-S3 GSM uses a:

```text
Nano SIM (4FF)
```

The SIM card holder is located on the rear side of the PCB.

A compatible SIM card with an active cellular data plan is required for 4G LTE communication.

## Antenna Connectors

The board provides two antenna connections:

### LTE Antenna

Used by the SIMCom A7672X module for cellular communication.

### GNSS Antenna

Used for GPS/GNSS positioning.

For reliable cellular and GNSS operation, external antennas should be connected.

## Technical Specifications

| Parameter        | Specification          |
| ---------------- | ---------------------- |
| Product Name     | Tarangify CoreX-S3 GSM |
| MCU              | ESP32-S3-N16R8         |
| CPU              | Dual-Core Xtensa LX7   |
| CPU Frequency    | Up to 240 MHz          |
| Flash            | 16 MB                  |
| PSRAM            | 8 MB                   |
| Wi-Fi            | 2.4 GHz 802.11 b/g/n   |
| Bluetooth        | BLE 5.0                |
| Cellular Module  | SIMCom A7672X          |
| Cellular Network | 4G LTE Cat-1           |
| GNSS             | GPS / GLONASS / BeiDou |
| SIM              | Nano SIM               |
| USB              | USB Type-C             |
| Battery          | 3.7 V LiPo             |
| RGB LED          | WS2812B                |
| RGB LED Pin      | GPIO48                 |
| User Button      | GPIO41                 |
| Battery Monitor  | GPIO12                 |
| GPIO Header      | 40-pin                 |
| Board Size       | 40 mm × 64 mm          |
| Board Version    | V1.0                   |

## Applications

The Tarangify CoreX-S3 GSM can be used for:

* GPS tracking systems
* Vehicle tracking
* Fleet management
* Asset tracking
* Remote monitoring
* Industrial IoT
* Smart agriculture
* Smart energy monitoring
* Cellular sensor nodes
* IoT data loggers
* Emergency SOS systems
* Voice notification systems
* Smart city applications

## Getting Started

Before using the board:

1. Install the ESP32 board package in Arduino IDE.
2. Connect the board using a USB Type-C cable.
3. Select the appropriate ESP32-S3 board.
4. Connect the required LTE and GNSS antennas.
5. Insert a compatible Nano SIM card if using cellular functionality.
6. Upload a test program.
7. Open the Serial Monitor at `115200` baud.

## Example Tests

The following examples are provided to verify the major hardware features of the CoreX-S3 GSM:

1. RGB LED Test
2. RGB Strip Test
3. Button Test
4. Button Strip Test
5. SD Card Test
6. Battery Test
7. OLED Display Test
8. Sensor Test
9. Servo Motor Test
10. 4G LTE Test
11. GNSS/GPS Test
12. SMS Test
13. Voice Call Test

## Important Notes

:::warning 
Antenna:

Always connect the appropriate LTE antenna before using the cellular module. A GNSS antenna should also be connected when testing GNSS functionality.
:::

:::warning 
SIM Card:

A Nano SIM card with an active cellular plan is required for LTE, SMS, and voice functionality.
:::

:::warning 
GPIO:

GPIO10, GPIO11, and GPIO13 are internally connected to the A7672X module. Check the schematic before using these pins for external peripherals.
:::

## What's Next?

Start testing the board using the individual hardware examples:

* **RGB LED**
* **RGB Strip**
* **Button**
* **Button Strip**
* **SD Card**
* **Battery**
* **OLED Display**
* **Sensor**
* **Servo Motor**

After completing the hardware tests, continue with the **A7672X 4G LTE**, **GNSS**, **SMS**, and **Voice Call** tutorials.