---
id: arduino-development-environment-setup
title: Working with Arduino
sidebar_label: Working with Arduino
sidebar_position: 4
description: Set up the Arduino IDE for the Tarangify T-CORE-S3-24V (and T-CORE-S3-BAT) development boards, and board-specific notes on onboard peripherals.
---

# Working with Arduino

This page covers Arduino IDE setup and board-specific notes for the **Tarangify T-CORE-S3-24V** development board.

If you're brand new to ESP32 Arduino development, our step-by-step [Section 1: Installing and Configuring Arduino IDE](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/1InstallandConfiguration) is a good complementary resource — it covers the fundamentals (digital I/O, ADC, PWM, UART, I2C, SPI, Wi-Fi, Bluetooth) independent of any specific board's onboard peripherals.

---

## 1. T-CORE-S3-24V at a Glance

| Parameter | Details |
|---|---|
| MCU | ESP32-S3-WROOM-1 (N16R8) |
| Flash / PSRAM | 16MB / 8MB |
| Wireless | Wi-Fi 802.11 b/g/n + BLE 5.0 |
| Input voltage | DC 5V–28V via VIN terminal (works directly on 12V/24V supply), plus 5V via USB |
| Reverse polarity protection | Built-in |
| USB | Type-C — programming and debug |
| microSD card | SPI mode: CD = IO10, CMD = IO11, CLK = IO12, DAT = IO13 |
| RGB LED | WS2812B, single addressable LED on IO48 |
| Buttons | Reset, Boot, and a general-purpose user button on IO41 |
| Regulated outputs | 3.3V and 5V on pinheader |
| GPIO | 40+ pins on dual 2.54mm pinheaders |
| PCB size | 40mm × 64mm |

:::warning

**Power limits:** VIN accepts 5V–28V DC, but don't exceed 28V — that's beyond the onboard regulator's rating. Don't feed raw 230V AC into VIN; use an appropriate SMPS to step down first. Keep continuous draw from the 3.3V rail under 500mA.

:::

:::tip

USB and VIN can be connected at the same time — the board handles dual power input safely.

:::

---

## 2. Setting Up the Development Environment

### 2.1 Install and Configure the Arduino IDE

See [Section 1: Installing and Configuring Arduino IDE](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/1InstallandConfiguration) for the full walkthrough of downloading the IDE and adding ESP32 board support. Both the Arduino IDE (with the ESP32-S3 board package) and ESP-IDF are fully supported on this board.

### 2.2 Select the Board

1. Click the board/port selector in the Arduino IDE toolbar, choose **Select other board and port**.
2. Search for and select **ESP32S3 Dev Module** — T-CORE-S3-24V doesn't currently have a dedicated entry in the boards list, so this generic profile is the correct starting point.
3. Select the COM port that appears once the board is connected over Type-C USB.

![T-CORE-S3-24V Board](/img/24A1.jpg)

### 2.3 Entering Download Mode (if needed)

If the board doesn't flash automatically, hold **Boot**, tap **Reset**, then release **Boot** to force it into download mode before uploading.

---

## 3. Onboard Peripherals

### 3.1 RGB LED (WS2812B, IO48)

The onboard addressable RGB LED is driven from **IO48**. Use either the **FastLED** or **Adafruit NeoPixel** library — both are available through the Arduino Library Manager. A single-pixel NeoPixel example is the right starting point:

```cpp
#include <Adafruit_NeoPixel.h>

#define LED_PIN   48
#define NUM_LEDS  1

Adafruit_NeoPixel pixel(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  pixel.begin();
}

void loop() {
  pixel.setPixelColor(0, pixel.Color(255, 0, 0));  // red
  pixel.show();
  delay(500);

  pixel.setPixelColor(0, pixel.Color(0, 255, 0));  // green
  pixel.show();
  delay(500);

  pixel.setPixelColor(0, pixel.Color(0, 0, 255));  // blue
  pixel.show();
  delay(500);
}
```

### 3.2 microSD Card (SPI)

The onboard microSD slot uses SPI mode with a fixed pin mapping:

| Signal | GPIO |
|---|---|
| CD (card detect) | IO10 |
| CMD | IO11 |
| CLK | IO12 |
| DAT | IO13 |

Use the standard `SD.h` library (bundled with the ESP32 Arduino core) with an `SPI` object configured on those pins:

```cpp
#include <SPI.h>
#include <SD.h>

#define SD_CS   10   // CD/CS
#define SD_MOSI 11   // CMD
#define SD_SCK  12   // CLK
#define SD_MISO 13   // DAT

void setup() {
  Serial.begin(115200);

  SPI.begin(SD_SCK, SD_MISO, SD_MOSI, SD_CS);

  if (!SD.begin(SD_CS)) {
    Serial.println("SD card mount failed");
    return;
  }

  uint8_t cardType = SD.cardType();
  if (cardType == CARD_NONE) {
    Serial.println("No SD card detected");
    return;
  }

  uint64_t cardSizeMB = SD.cardSize() / (1024 * 1024);
  Serial.printf("SD card size: %lluMB\n", cardSizeMB);
}

void loop() {
}
```

:::note

Format the card as FAT32 before use. If mounting fails, double-check the card is properly seated and that no other peripheral on the board is sharing those same GPIOs in your sketch.

:::

### 3.3 User Button (IO41)

IO41 is a general-purpose user button with no fixed function — wire your firmware to use it however your project needs (mode toggling, a manual trigger, waking from deep sleep, and so on):

```cpp
#define USER_BTN_PIN 41

void setup() {
  Serial.begin(115200);
  pinMode(USER_BTN_PIN, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(USER_BTN_PIN) == LOW) {
    Serial.println("User button pressed");
    delay(200);  // basic debounce
  }
}
```

### 3.4 Wi-Fi and Bluetooth

Wi-Fi (802.11 b/g/n) and Bluetooth 5.0 (BLE) are built into the ESP32-S3-WROOM-1 module itself, so they work the same way as on any ESP32-S3 board — no board-specific wiring or pin assignment needed. See [Section 9: Wi-Fi Basics](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/9Wi-Fi-Networking-Basics), [Section 10: Web Server](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/10Web-Server), and [Section 11: Bluetooth](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/11Bluetooth) in the general tutorial series for detailed walkthroughs and example code.

---

## 4. Reference Links

* [Section 1: Installing and Configuring Arduino IDE](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/1InstallandConfiguration)
* [Section 9: Wi-Fi Basics](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/9Wi-Fi-Networking-Basics)
* [Section 10: Web Server](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/10Web-Server)
* [Section 11: Bluetooth](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/11Bluetooth)
* [Adafruit NeoPixel library documentation](https://learn.adafruit.com/adafruit-neopixel-uberguide)
* [ESP32 Arduino SD library reference](https://github.com/espressif/arduino-esp32/tree/master/libraries/SD)

---

## Next Step

With the RGB LED, SD card, and user button covered, continue into the general [Getting Started Tutorial series](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/Arduino%20Tutorials/2Arduino-Basics) for GPIO, ADC, PWM, communication protocols, and networking fundamentals that apply the same way on this board.