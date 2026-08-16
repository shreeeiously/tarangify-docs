---
id: ble
title: BLE Programming
sidebar_label: BLE Programming
sidebar_position: 10
description: Learn ESP32 Bluetooth Low Energy fundamentals and build a GATT server example controllable from a phone.
---

# Section 9: BLE Programming

This section covers Bluetooth Low Energy (BLE) fundamentals on ESP32, ESP-IDF's BLE stack architecture, and walks through a working GATT server example you can control from a phone app.

:::info

Make sure you've completed [**Section 1: Set Up Environment**](./esp-idf-installation) through [**Section 8: Wi-Fi Programming**](./wifi) before starting this section.

:::

---

## 1. Bluetooth on ESP32

Most ESP32-series chips include built-in Bluetooth, making them a natural fit for wearables, proximity sensing, and short-range device-to-device links. Bluetooth itself splits into two distinct technologies:

- **Bluetooth Classic** — built for sustained, higher-throughput links, most commonly seen in audio devices.
- **Bluetooth Low Energy (BLE)** — built for infrequent, small, low-power transmissions. This is the dominant choice for IoT devices like fitness trackers and wireless sensors.

Support varies by chip: the original ESP32 supports both Classic and BLE, while most newer chips in the family support BLE only. This tutorial focuses entirely on BLE, since it's the more broadly supported and IoT-relevant option.

---

## 2. How BLE Fits Together in ESP-IDF

BLE was introduced with Bluetooth 4.0 and isn't backward-compatible with Bluetooth Classic. It trades raw throughput for much lower power draw, which is exactly the tradeoff most battery-powered IoT devices want.

ESP-IDF's BLE support is organized in layers:

- **Controller** — the lowest layer, talking directly to the radio hardware and managing the physical link.
- **Host** — sits above the controller. ESP-IDF offers two host stack options:
  - **Bluedroid** — supports both Classic and BLE (on chips that support Classic). More full-featured, but heavier on flash and RAM.
  - **NimBLE** — BLE only, with a much smaller footprint. The better default choice when memory or firmware size is tight.
- **Profiles** — higher-level building blocks on top of the host, such as BLE Mesh or BluFi (provisioning Wi-Fi credentials over BLE).
- **Application** — your own code, built on the APIs and profiles below it.

---

## 3. The Protocols That Make Up BLE

A few core protocols work together under the hood whenever you use BLE:

- **GAP (Generic Access Profile)** — governs discovery and connections: advertising, scanning, and the roles devices can play (peripheral, central, advertiser, scanner), including support for multiple simultaneous connections and roles.
- **GATT / ATT (Generic Attribute Profile / Attribute Protocol)** — defines how data is structured and exchanged once connected. ATT provides the underlying client/server data model; GATT builds on it with the higher-level concepts you actually work with day to day — **services** (a logical grouping of related data) and **characteristics** (individual pieces of data within a service, each readable, writable, and/or subscribable).
- **L2CAP** — handles splitting data into packets and reassembling it, providing the underlying channel higher layers use.
- **SMP (Security Manager Protocol)** — handles pairing, authentication, and encryption.

For this tutorial, GATT is the one you'll interact with most directly — it's what defines the services and characteristics your BLE app exposes.

---

## 4. Example: A GATT Server You Can Control From Your Phone

This example builds on ESP-IDF's own NimBLE GATT server sample and exposes two things over BLE: a simulated, slowly-changing heart rate reading, and a writable characteristic that toggles the board's onboard LED. You'll interact with it using a generic BLE debugging app on your phone — this tutorial uses **LightBlue**, available for iOS and Android.

### 4.1 Open the Example Project

1. Open VS Code, click the ESP-IDF extension icon, and choose **Show Example Project** under **Advanced**.
2. Select your ESP-IDF version.
3. Under the **bluetooth** category, find and select the NimBLE GATT server example, then choose a folder to copy it into.

:::danger

The project path must not contain spaces, non-ASCII characters, or other special characters.

:::

### 4.2 Configure the LED for Your Board

The example ships with default LED configuration that likely won't match your board's actual wiring. Update it before flashing:

1. Open the SDK Configuration Editor.
2. Set:
   - **LED type** — `GPIO` for a standard LED, or `LED strip` for an addressable LED like WS2812.
   - **LED GPIO number** — the pin your board's LED is actually connected to.
3. Save.

:::info

Check your specific Tarangify board's documentation for its LED type and GPIO pin — this varies by model.

:::

### 4.3 Build, Flash, and Monitor

Set your target, port, and flash method (see [Section 2](./run-example#13-configure-target-port-and-flash-method)), then build, flash, and monitor.

You should see BLE initialization logs, followed by a simulated heart rate value (updating roughly once per second, cycling somewhere in the 60–80 range) printed to the serial monitor.

### 4.4 Connect Over Bluetooth

Open LightBlue on your phone.

**Connect to the board:** search for "GATT," find the device (advertised as something like "NimBLE_GATT"), expand it to view its advertising info, and tap **Connect**. Once connected, you'll see two services, each exposing one characteristic. Both use standard Bluetooth SIG UUIDs, so LightBlue automatically labels them as **Heart Rate** and **Automation IO**.

**Read the heart rate value:** open the Heart Rate Measurement characteristic. Switch its display format to HEX, set the byte limit to 1, and choose "1 byte unsigned integer" so the value reads cleanly. Save that setting, then either tap **Read** for a one-off read, or **Subscribe** to get automatic pushes whenever the value changes.

**Control the LED:** go back and open the characteristic with UUID `0x00001525-1212-EFDE-1523-785FEABCD123`. This one isn't a standard Bluetooth SIG UUID, so LightBlue shows it as a raw UUID rather than a friendly name — but it's a widely reused convention (originating with Nordic Semiconductor's example code) for a simple LED on/off characteristic. Writing `0x01` turns the LED on; writing `0x00` turns it off. Tap **Write new value**, enter `1`, and the LED should light up; write `0` to turn it back off.

---

## 5. Reference Links

* [ESP-IDF Bluetooth Low Energy API Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-guides/ble/index.html)
* [ESP-IDF BLE Getting Started Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-guides/ble/get-started/ble-introduction.html)
* [NimBLE GATT Server example (ESP-IDF)](https://github.com/espressif/esp-idf/tree/master/examples/bluetooth/ble_get_started/nimble/NimBLE_GATT_Server)
* [Bluetooth SIG Assigned Numbers](https://www.bluetooth.com/specifications/assigned-numbers/)

---

## Next Step

You can now stand up a working BLE GATT server, expose readable and writable characteristics, and interact with your board from a phone.

This wraps up the core ESP-IDF getting-started series — from here, check the extended reading section for deeper dives into specific topics.