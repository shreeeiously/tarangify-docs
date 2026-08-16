---
id: esp-idf-development-environment-setup
title: Working with ESP-IDF
sidebar_label: Working with ESP-IDF
sidebar_position: 5
description: Set up ESP-IDF for the Tarangify T-CORE-S3-BAT development board, run the official getting-started tutorial series, and erase device flash.
---

# Working with ESP-IDF

This page covers ESP-IDF setup for the **Tarangify T-CORE-S3-BAT** development board (see [ESP-IDF Installation](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/esp-idf-installation) for its full spec sheet), and points to the general ESP-IDF getting-started series for everything that isn't board-specific.

---

## 1. ESP-IDF Getting Started

New to ESP-IDF development? Our full getting-started series covers everything from installing the toolchain to Wi-Fi and BLE:

- [Section 1: ESP-IDF Installation](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/esp-idf-installation)
- [Section 2: Run Example](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/run-example)
- [Section 3: Create Project](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/create-project)
- [Section 4: Use Component](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/component)
- [Section 5: Debug](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/debug)
- [Section 6: FreeRTOS](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/freertos)
- [Section 7: Drive Peripheral](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/peripheral)
- [Section 8: Wi-Fi Programming](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/wifi)
- [Section 9: BLE Programming](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/ble)

:::note

That series uses a generic ESP32-S3 board as its reference example, with hardware code based on a generic pinout. Before running example code, check T-CORE-S3-BAT's actual pin assignments — especially GPIO10–13 (microSD), GPIO48 (WS2812B RGB LED), and GPIO41 (user button) — since those are already claimed by onboard hardware and shouldn't be reused for other peripherals in your own wiring.

:::

## 2. Setting Up the Development Environment

Follow [Section 1: Set Up Environment](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/esp-idf-installation) to install ESP-IDF and configure Visual Studio Code with the ESP-IDF extension. Nothing about that setup process is board-specific — it applies the same way to T-CORE-S3-24V as to any other ESP32-S3 board.

## 3. Running Official Espressif Examples

Once your environment is set up, [Section 2: Run Example](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/run-example) walks through building, flashing, and monitoring both the `hello_world` and `blink` example projects — a good way to confirm your toolchain and board are working correctly before moving on to custom code.

## 4. Erasing Device Flash

If you need to fully erase T-CORE-S3-24V's flash — for example, to clear a stuck `main.py`/firmware image before reflashing, or to resolve a corrupted flash state — Espressif's Flash Download Tool handles this over the board's Type-C connection.

1. Download and extract the [ESP Flash Download Tool](https://www.espressif.com/en/support/download/other-tools).
2. Open the tool, select **ESP32-S3** as the chip and **UART** as the interface.
3. Select the correct COM port for your board (connected over Type-C USB), then click **START** — leave the bin-file fields empty, since you're only erasing, not flashing.
4. Once connected, click **Erase** and wait for it to complete.

:::tip

If the tool can't detect the board, hold **Boot**, tap **Reset**, then release **Boot** to force T-CORE-S3-24V into download mode before retrying.

:::

---

## 5. Reference Links

* [Espressif Flash Download Tool](https://www.espressif.com/en/support/download/other-tools)
* [ESP-IDF Programming Guide](https://docs.espressif.com/projects/esp-idf/en/latest/)

---

## Next Step

With your environment set up and your board verified working, continue into the [ESP-IDF Getting Started series](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/esp-idf-installation) starting from Section 1, or jump straight to whichever section covers what you're building.