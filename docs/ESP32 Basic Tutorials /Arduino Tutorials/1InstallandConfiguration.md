---
sidebar_position: 1
title: Arduino IDE Setup
description: Learn how to install and configure Arduino IDE for ESP32 development.
---

# Section 1: Arduino IDE Setup

This guide explains how to install Arduino IDE and configure it for ESP32 development boards.

## Prerequisites

Before starting, ensure you have:

- A computer running Windows, Linux, or macOS
- Internet connection
- ESP32 development board
- USB data cable

## Step 1: Install Arduino IDE
1. Visit the [Arduino Official Website](https://www.arduino.cc/).
2. Download the latest version of Arduino IDE.
3. Run the installer and follow the installation wizard.
4. Launch Arduino IDE after installation.

![Arduino IDE](/img/A1.jpg)

## Step 2: Add ESP32 Board Support

Open **File → Preferences**.

![Arduino IDE](/img/A2.jpg)

In **Additional Boards Manager URLs**, add:

```text
https://espressif.github.io/arduino-esp32/package_esp32_index.json
```

Click **OK**.

## Step 3: Install ESP32 Package

1. Open **Tools → Board → Boards Manager**.
2. Search for **ESP32**.
3. Install **ESP32 by Espressif Systems**.
4. Wait for the installation to complete.

![Arduino IDE](/img/A3.jpg)

## Step 4: Connect Your Board

1. Connect the ESP32 board using a USB cable.
2. Open **Tools → Port**.
3. Select the detected COM port.

## Step 5: Select Board

Navigate to:

**Tools → Board → ESP32 Arduino**

Choose your board model.

Examples:

- ESP32 Dev Module
- ESP32-S3 Dev Module

![Arduino IDE](/img/A4.jpg)

## Step 6: Upload Your First Program

Open:

**File → Examples → Basics → Blink**

Click **Upload**.

If the upload completes successfully, your development environment is ready.

## Troubleshooting

### Board Not Detected

- Check the USB cable.
- Install required USB drivers.
- Try another USB port.

### Upload Failed

- Press and hold the BOOT button while uploading.
- Verify the selected board and COM port.
- Restart Arduino IDE.

## Next Steps

Now that Arduino IDE is configured, you can begin learning:

- Digital Input/Output
- PWM
- UART Communication
- I2C Communication
- SPI Communication
- Wi-Fi Projects
- Web Servers