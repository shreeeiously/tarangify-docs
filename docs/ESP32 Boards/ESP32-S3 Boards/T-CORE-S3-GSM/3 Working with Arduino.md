---
id: arduino-development-environment-setup
title: Working with Arduino
sidebar_label: Working with Arduino
sidebar_position: 4
description: Set up the Arduino IDE for the Tarangify T-CORE-S3-GSM development boards, and board-specific notes on onboard peripherals.
---
# Working with Arduino

This page covers Arduino IDE setup and board-specific notes for the **Tarangify CoreX-S3 GSM** development board.

The CoreX-S3 GSM combines the **ESP32-S3-N16R8** microcontroller with the **SIMCom A7672X 4G LTE Cat-1 module**, providing Wi-Fi, Bluetooth LE, cellular connectivity, GNSS positioning, audio support, battery operation, and GPIO expansion in a compact development board.

If you're brand new to ESP32 Arduino development, our step-by-step [Section 1: Installing and Configuring Arduino IDE](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/1InstallandConfiguration) is a good complementary resource — it covers the fundamentals (digital I/O, ADC, PWM, UART, I2C, SPI, Wi-Fi, Bluetooth) independent of any specific board's onboard peripherals.

---

## 1. CoreX-S3 GSM at a Glance

| Parameter | Details |
|---|---|
| MCU | ESP32-S3-N16R8 |
| CPU | Dual-Core Xtensa LX7, up to 240MHz |
| Flash / PSRAM | 16MB / 8MB |
| Wireless | Wi-Fi 802.11 b/g/n + BLE 5.0 |
| Cellular Module | SIMCom A7672X |
| Cellular Network | 4G LTE Cat-1 |
| GNSS | GPS / GLONASS / BeiDou |
| SIM | Nano SIM (4FF) |
| USB | Type-C — programming, power and debug |
| Battery | 3.7V LiPo |
| Battery Charging | Onboard charging circuit |
| Battery Monitoring | IO12 |
| RGB LED | WS2812B on IO48 |
| User Button | IO41 |
| Audio | Onboard MEMS microphone + speaker connector |
| GPIO | 40-pin GPIO header |
| Antennas | LTE + GNSS |
| PCB size | 40mm × 64mm |
| Board Version | V1.0 |

The CoreX-S3 GSM is designed for applications including GPS tracking, remote monitoring, industrial automation, smart agriculture, telematics, asset tracking, and cellular IoT deployments.

:::warning

The CoreX-S3 GSM contains both an ESP32-S3 and a SIMCom A7672X cellular module. The cellular module requires an appropriate LTE antenna and an active Nano SIM card when testing cellular functionality.

:::

:::tip

The board can be powered through USB Type-C or a 3.7V LiPo battery. An onboard charging circuit is provided for the LiPo battery.

:::

---

## 2. Setting Up the Development Environment

### 2.1 Install and Configure the Arduino IDE

See [Section 1: Installing and Configuring Arduino IDE](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/1InstallandConfiguration) for the full walkthrough of downloading the IDE and adding ESP32 board support.

The CoreX-S3 GSM is compatible with:

- Arduino IDE
- PlatformIO
- ESP-IDF

For Arduino development, install the ESP32 board package through the Arduino Boards Manager.

### 2.2 Select the Board

1. Open Arduino IDE.
2. Click the board/port selector.
3. Choose **Select other board and port**.
4. Search for:

```text
ESP32S3 Dev Module
```

5. Select **ESP32S3 Dev Module**.
6. Select the COM port that appears when the board is connected through USB Type-C.

The CoreX-S3 GSM does not require a dedicated board definition to get started with Arduino. The generic ESP32-S3 profile can be used as the starting configuration.

### 2.3 Entering Download Mode

If the board does not automatically enter download mode during uploading:

1. Press and hold the **BOOT** button.
2. Press and release the **RESET** button.
3. Release the **BOOT** button.
4. Start the upload again.

---

## 3. Onboard Peripherals

### 3.1 RGB LED (WS2812B, IO48)

The CoreX-S3 GSM includes an onboard **WS2812B addressable RGB LED** connected to:

```text
IO48
```

The LED can be controlled using libraries such as **Adafruit NeoPixel** or **FastLED**.

A single-pixel NeoPixel example:

```cpp
#include <Adafruit_NeoPixel.h>

#define LED_PIN   48
#define NUM_LEDS  1

Adafruit_NeoPixel pixel(
  NUM_LEDS,
  LED_PIN,
  NEO_GRB + NEO_KHZ800
);

void setup() {
  pixel.begin();
  pixel.setBrightness(50);
  pixel.show();
}

void loop() {

  // Red
  pixel.setPixelColor(0, pixel.Color(255, 0, 0));
  pixel.show();
  delay(500);

  // Green
  pixel.setPixelColor(0, pixel.Color(0, 255, 0));
  pixel.show();
  delay(500);

  // Blue
  pixel.setPixelColor(0, pixel.Color(0, 0, 255));
  pixel.show();
  delay(500);

  // Off
  pixel.clear();
  pixel.show();
  delay(500);
}
```

---

### 3.2 User Button (IO41)

The general-purpose user button is connected to:

```text
IO41
```

It can be used for functions such as:

- Mode selection
- Manual triggers
- User input
- Alarm activation
- Application control

Example:

```cpp
#define USER_BTN_PIN 41

void setup() {

  Serial.begin(115200);

  pinMode(USER_BTN_PIN, INPUT_PULLUP);

  Serial.println("CoreX-S3 GSM User Button Test");
}

void loop() {

  if (digitalRead(USER_BTN_PIN) == LOW) {

    Serial.println("User button pressed");

    delay(200);
  }
}
```

---

### 3.3 4G LTE / A7672X

The CoreX-S3 GSM integrates the **SIMCom A7672X 4G LTE Cat-1 module**.

The module provides:

- 4G LTE connectivity
- Cellular data
- SMS
- Voice calls
- Network communication
- GNSS functionality

The ESP32-S3 communicates with the A7672X using UART and AT commands.

Example AT commands include:

```text
AT
AT+CPIN?
AT+CSQ
AT+CREG?
AT+COPS?
```

These commands can be used to check:

- Modem response
- SIM status
- Signal strength
- Network registration
- Network operator

See the dedicated **4G LTE**, **SMS**, and **Voice Call** tutorials for complete examples.

---

### 3.4 Nano SIM Slot

The board includes an integrated:

```text
Nano SIM (4FF)
```

slot for the A7672X cellular module.

The Nano SIM is required for cellular services such as:

- 4G LTE data
- SMS
- Voice calls
- Cellular network registration

Before testing cellular functionality, insert an activated SIM card and connect the appropriate LTE antenna.

---

### 3.5 GNSS

The A7672X provides integrated GNSS functionality.

Supported satellite navigation systems include:

- GPS
- GLONASS
- BeiDou

The board provides a dedicated GNSS antenna connector.

GNSS can be controlled using AT commands through the A7672X.

For example:

```text
AT+CGNSSPWR=1
AT+CGNSSINFO
```

The GNSS system can provide information such as:

- Latitude
- Longitude
- Altitude
- Speed
- Satellite information
- Date and time

See the dedicated **GNSS Tutorial** for the complete example.

---

### 3.6 Audio

The CoreX-S3 GSM provides audio functionality through:

- Onboard MEMS microphone
- Speaker output connector

The audio interface can be used for:

- Voice calls
- Voice alerts
- Emergency communication
- Audio applications

The A7672X manages cellular voice communication while the ESP32-S3 can be used to control the application logic.

---

### 3.7 Battery Monitoring

The CoreX-S3 GSM supports a **3.7V LiPo battery** and includes an onboard charging circuit.

Battery voltage monitoring is available through:

```text
IO12
```

The ADC can be used to read the battery-monitoring signal and calculate the battery voltage according to the board's resistor-divider circuit.

---

### 3.8 Status LEDs

The CoreX-S3 GSM includes several status indicators:

| LED  | Function                      |
| ---- | ------------------------------ |
| PWR  | Power status                  |
| NET  | Cellular network status       |
| RING | Incoming call/ring indication |
| STAT | Module status                 |
| CHG  | Battery charging status       |

These LEDs provide visual feedback about the board and cellular module state.

---

### 3.9 Wi-Fi

Wi-Fi is provided by the ESP32-S3 itself.

The module supports:

```text
2.4 GHz
802.11 b/g/n
```

No additional hardware or external wiring is required to use Wi-Fi.

See [Section 9: Wi-Fi Basics](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/9Wi-Fi-Networking-Basics) and [Section 10: Web Server](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/10Web-Server) for detailed examples.

---

### 3.10 Bluetooth

The ESP32-S3 provides Bluetooth Low Energy:

```text
BLE 5.0
```

BLE can be used for:

- Wireless configuration
- Sensor communication
- Device control
- Short-range IoT applications

See [Section 11: Bluetooth](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/11Bluetooth) for Bluetooth examples.

---

## 4. GPIO Expansion

The CoreX-S3 GSM provides a:

```text
20 × 2 = 40-pin GPIO header
```

The expansion header provides access to multiple ESP32-S3 interfaces including:

- GPIO
- ADC
- UART
- SPI
- I2C
- PWM

This allows external hardware such as sensors, displays, motors, servos, and other peripherals to be connected.

---

## 5. USB Type-C

The USB Type-C connector provides:

- ESP32-S3 programming
- Serial communication
- Debugging
- Board power

Connect the board to your computer using a suitable USB Type-C data cable.

---

## 6. Antenna Connections

The CoreX-S3 GSM provides two dedicated antenna connections.

### LTE Antenna

Used by the A7672X for cellular communication.

### GNSS Antenna

Used for GPS/GNSS positioning.

---

## 7. Arduino Example Tests

The CoreX-S3 GSM documentation includes dedicated examples for testing the major board features:

| Example      | Function                   |
| ------------- | --------------------------- |
| RGB LED      | Test onboard WS2812B       |
| RGB Strip    | Control external RGB strip |
| Button       | Test user button           |
| Button Strip | Test multiple buttons      |
| SD Card      | Test external SPI SD card  |
| Battery      | Monitor battery voltage    |
| OLED Display | Test external OLED         |
| Sensor       | Test external sensor       |
| Servo Motor  | Test servo control         |
| Nano SIM     | Detect and verify SIM      |
| 4G LTE       | Test cellular connectivity |
| GNSS         | Test GPS/GNSS positioning  |
| SMS          | Send SMS                   |
| Voice Call   | Make a cellular voice call |

Each example is designed to verify a specific hardware function independently before combining multiple peripherals into a larger project.

---

## 8. Important GPIO Notes

The following pins require special attention:

| GPIO | Function                       |
| ---- | -------------------------------- |
| IO48 | Onboard WS2812B RGB LED        |
| IO41 | User button                    |
| IO12 | Battery monitoring             |
| IO10 | Internally connected to A7672X |
| IO11 | Internally connected to A7672X |
| IO13 | Internally connected to A7672X |

---

## 9. Reference Links

- [Section 1: Installing and Configuring Arduino IDE](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/1InstallandConfiguration)
- [Section 2: Arduino Basics](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/2Arduino-Basics)
- [Section 9: Wi-Fi Basics](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/9Wi-Fi-Networking-Basics)
- [Section 10: Web Server](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/10Web-Server)
- [Section 11: Bluetooth](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/11Bluetooth)
- [Adafruit NeoPixel Library](https://learn.adafruit.com/adafruit-neopixel-uberguide)
- [ESP32 Arduino Core](https://github.com/espressif/arduino-esp32)

---

## Next Step

After setting up Arduino IDE, start with the individual hardware tests:

1. RGB LED
2. RGB Strip
3. Button
4. Button Strip
5. Nano SIM Card
6. Battery
7. OLED Display
8. Sensor
9. Servo Motor
10. 4G LTE
11. GNSS
12. SMS
13. Voice Call

Once the individual peripherals have been verified, you can combine the ESP32-S3, 4G LTE, GNSS, and external peripherals to build complete cellular IoT applications.