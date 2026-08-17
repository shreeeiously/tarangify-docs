---
id: peripheral
title: Peripheral
sidebar_label: Peripheral
sidebar_position: 8
description: Understand ESP32-S3 peripherals, pin multiplexing (IO MUX & GPIO Matrix), and the general peripheral driver workflow in ESP-IDF.
---

# Section 7: Drive Peripheral

This section covers the peripherals commonly found on ESP32-S3 chips, how pin assignment works under the hood via IO MUX and the GPIO Matrix, the general pattern for writing a peripheral driver in ESP-IDF, and where to find the documentation you'll actually need while doing it.

:::info

Make sure you've completed [**Section 1: Set Up Environment**](./esp-idf-installation) through [**Section 6: FreeRTOS**](./freertos) before starting this section.

:::

:::note

This section uses the ESP32-S3 as the reference chip, matching Tarangify's ESP32-S3-based boards. Peripheral counts and pin-mapping flexibility vary across the ESP32 family — check your specific chip's datasheet for exact numbers.

:::

---

## 1. What Peripherals Are Available

ESP32-series chips pack in a wide range of built-in peripheral interfaces for talking to external hardware — sensors, displays, storage, and more. Exactly which peripherals are present, how many instances of each, and how flexibly they can be mapped to pins all varies by chip variant.

Here's a quick reference for the peripherals you'll run into most often:

| Peripheral    | Purpose                                                                  |
| ------------- | ------------------------------------------------------------------------- |
| **LEDC**      | Multi-channel PWM output — dimming, motor/fan speed control, etc.        |
| **I2C**       | Two-wire serial bus for sensors, EEPROMs, and similar devices             |
| **SPI**       | High-speed full-duplex bus for flash, displays, sensors, etc.             |
| **UART**      | Serial communication — debugging output and peripheral data transfer      |
| **ADC**       | Reading analog signals                                                    |
| **I2S**       | Audio/multimedia data transfer, full- or half-duplex                      |
| **LCD_CAM**   | Parallel interface for LCDs and cameras                                   |
| **RMT**       | Precise pulse generation/reception — IR remotes, addressable LEDs, etc.   |
| **TWAI (CAN)**| Automotive-style CAN bus communication                                    |
| **Touch**     | Built-in capacitive touch sensing                                         |
| **USB-OTG**   | USB 2.0 OTG communication                                                 |
| **USB/JTAG**  | Debugging and firmware download interface                                 |

---

## 2. How Pins Get Assigned: IO MUX and the GPIO Matrix

ESP32-S3 exposes 45 physical GPIO pins, and nearly all of them can serve either as plain GPIO or as the input/output for one of the chip's internal peripherals. Two mechanisms make that flexible: **IO MUX** and the **GPIO Matrix**.

### 2.1 IO MUX

IO MUX is a per-pin multiplexer built into the chip: each pin's IO_MUX register decides whether that pin is driven directly by a specific high-speed peripheral signal (SPI, JTAG, UART, and similar), or routed instead through the GPIO Matrix.

Wiring a peripheral directly via IO MUX gives you the best possible timing — higher achievable clock speeds and lower latency — but only a fixed set of pins support each peripheral this way.

**When to reach for it:** high-speed buses like SPI, where you want the fastest clock and least jitter.

### 2.2 GPIO Matrix

The GPIO Matrix sits behind IO MUX and lets you route almost any peripheral's input or output signal to almost any GPIO pin, dynamically. This is what gives ESP32 boards their flexible pin assignment — you're not locked into a fixed pinout for most peripherals.

The tradeoff is a small amount of added signal delay, and a lower practical frequency ceiling than a direct IO MUX connection (SPI over the GPIO Matrix tops out around 40 MHz versus roughly 80 MHz via IO MUX directly).

**When to reach for it:** lower-speed or more flexible peripherals — I2C, UART, PWM/LEDC outputs — where being able to pick any convenient pin matters more than squeezing out maximum clock speed.

---

## 3. The General Peripheral Driver Workflow

Regardless of which peripheral you're working with, ESP-IDF driver code tends to follow the same shape:

1. **Include the relevant driver header(s)** — e.g. `driver/gpio.h`, `driver/i2c_master.h`.
2. **Declare the dependency** in `CMakeLists.txt` (or `idf_component.yml` for managed components).
3. **Fill in a configuration struct** — e.g. `gpio_config_t`, `i2c_master_bus_config_t`.
4. **Call the initialization function(s)** — e.g. `gpio_config()`, `i2c_new_master_bus()`, `i2c_master_bus_add_device()`.
5. **Use the peripheral** — e.g. `gpio_set_level()`, `i2c_master_transmit()`, `i2c_master_transmit_receive()`.
6. **Clean up when done**, if applicable — e.g. deleting an I2C bus handle you no longer need.

The rest of this section walks through that pattern with several specific peripherals:

- Digital Output Control via GPIO
- Controlling LED Brightness with LEDC
- Driving WS2812 LEDs with RMT
- ADC Analog Signal Acquisition
- UART Serial Communication
- I2C Master Communication
- SPI Master Communication

---

## 4. Where to Find Peripheral Documentation

When you're building a driver for a specific peripheral, these are the resources worth having open:

1. **Chip datasheet** — the high-level summary of which peripherals your chip supports and their key specs. For ESP32-S3: [ESP32-S3 Datasheet](https://documentation.espressif.com/esp32-s3_datasheet_en.pdf).
2. **Technical Reference Manual** — the detailed register-level documentation for every peripheral (UART, I2C, I2S, SPI, LCD, camera, and so on). For ESP32-S3: [ESP32-S3 Technical Reference Manual](https://documentation.espressif.com/esp32-s3_technical_reference_manual_en.pdf).
3. **ESP-IDF Programming Guide** — API references, driver usage patterns, and getting-started material: [ESP32-S3 Programming Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/index.html), [ESP32-S3 Peripheral API Reference](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-reference/peripherals/index.html).
4. **Your board's schematic and pin reference** — check exactly which GPIOs on your specific Tarangify board are already wired to onboard hardware (LEDs, sensors, connectors) before assigning pins for your own peripheral use, to avoid conflicts.
5. **Peripheral example code** — ESP-IDF ships a large set of working examples for nearly every peripheral: [ESP-IDF peripheral examples](https://github.com/espressif/esp-idf/tree/master/examples/peripherals).
6. **Official FAQ** — a good first stop for common configuration gotchas: [ESP-FAQ: Peripherals](https://docs.espressif.com/projects/esp-faq/en/latest/software-framework/peripherals/index.html).

Combining the reference manual with working example code is usually the fastest path from "I need to use peripheral X" to a working driver. For anything not covered here, the [ESP32 community forum](https://esp32.com/) is a good place to search or ask.

