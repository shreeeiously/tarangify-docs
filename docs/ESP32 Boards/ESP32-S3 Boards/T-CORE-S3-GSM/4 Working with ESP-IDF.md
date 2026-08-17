---
id: esp-idf-development-environment-setup
title: Working with ESP-IDF
sidebar_label: Working with ESP-IDF
sidebar_position: 5
description: Set up the ESP-IDF for the Tarangify T-CORE-S3-GSM development boards, and board-specific notes on onboard peripherals.
---

# Working with ESP-IDF

This page covers ESP-IDF development for the **Tarangify CoreX-S3 GSM Development Board**, based on the **ESP32-S3** and **SIMCom A7672X 4G LTE** module. It focuses on ESP-IDF setup and board-specific considerations, while the general ESP-IDF getting-started series covers the common development workflow.

---

## 1. ESP-IDF Getting Started

New to ESP-IDF development? Our full getting-started series covers everything from installing the toolchain to Wi-Fi, BLE, peripherals, and debugging:

- [Section 1: ESP-IDF Installation](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/esp-idf-installation)
- [Section 2: Run Example](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/run-example)
- [Section 3: Create Project](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/create-project)
- [Section 4: Use Component](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/component)
- [Section 5: Debug](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/debug)
- [Section 6: FreeRTOS](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/freertos)
- [Section 7: Drive Peripheral](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/peripheral)
- [Section 8: Wi-Fi Programming](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/wifi)
- [Section 9: BLE Programming](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/ble)

## 2. Setting Up the Development Environment

Follow [Section 1: ESP-IDF Installation](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/esp-idf-installation) to install ESP-IDF and configure Visual Studio Code with the ESP-IDF extension.

The ESP-IDF installation and project setup are the same as for other ESP32-S3 development boards. After the environment is configured, select the appropriate **ESP32-S3 target** when creating and building your project.

## 3. Running Official Espressif Examples

Once your development environment is ready, use [Section 2: Run Example](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/run-example) to build, flash, and monitor the official ESP-IDF examples.

The `hello_world` example is a good first test because it verifies that the ESP32-S3 can be compiled, flashed, and monitored successfully.

You can then use examples such as `blink` to verify GPIO operation before moving on to GSM-specific applications.

## 4. Working with the A7672X 4G LTE Modem

The **CoreX-S3 GSM** combines the ESP32-S3 with the **SIMCom A7672X** cellular modem.

The ESP32-S3 communicates with the modem using a serial interface and can send **AT commands** to control and monitor the cellular connection.

Typical GSM/LTE operations include:

- Checking modem status
- Checking SIM card status
- Registering with the cellular network
- Reading signal strength
- Sending and receiving SMS
- Establishing packet-data connections
- Obtaining network information
- Communicating with internet services over cellular data

A basic application typically follows this sequence:

1. Initialize the ESP32-S3 UART interface connected to the modem.
2. Power on or enable the A7672X modem.
3. Send AT commands to verify communication.
4. Check SIM card and network registration status.
5. Configure the required cellular connection.
6. Use the modem for SMS, data, or other supported cellular functions.

## 5. Using UART with ESP-IDF

ESP-IDF provides UART drivers that can be used to communicate with the A7672X modem.

A typical ESP-IDF GSM application uses one UART for modem communication while the ESP32-S3 handles the application logic.

The basic communication flow is:

```text
ESP32-S3
   │
   │ UART
   ▼
SIMCom A7672X
   │
   ├── SIM Card
   ├── 4G LTE Network
   └── Internet / SMS / Cellular Services
```

When developing the application, configure the UART according to the CoreX-S3 GSM hardware design and the modem's communication requirements.

For debugging, a separate serial interface can be used for ESP-IDF logs so that modem communication and application messages can be monitored during development.

## 6. Erasing Device Flash

If you need to completely erase the ESP32-S3 flash before reflashing firmware, use the ESP-IDF command-line tools or Espressif's Flash Download Tool.

Using ESP-IDF, the flash can be erased with:

```bash
idf.py erase-flash
```

After erasing, build and flash your application again using:

```bash
idf.py build
idf.py flash
```

To monitor the application output:

```bash
idf.py monitor
```

You can also combine flashing and monitoring:

```bash
idf.py flash monitor
```

## 7. Debugging GSM Applications

When developing applications for the CoreX-S3 GSM, debugging should cover both the ESP32-S3 firmware and the A7672X modem communication.

Useful information to monitor includes:

- ESP32-S3 boot messages
- UART communication with the modem
- AT command responses
- SIM card status
- Network registration
- Signal strength
- Cellular connection status
- Application errors

Keeping ESP-IDF logs separate from modem communication makes it easier to identify whether an issue originates from the ESP32-S3 application, UART configuration, modem configuration, SIM card, or cellular network.

## 8. Reference Links

- [ESP-IDF Installation](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/esp-idf-installation)
- [ESP-IDF Programming Guide](https://docs.espressif.com/projects/esp-idf/en/latest/)
- [Espressif Flash Download Tool](https://www.espressif.com/en/support/download/other-tools)

---

## Next Step

With the ESP-IDF environment configured and the ESP32-S3 verified, continue with the [ESP-IDF Getting Started series](/tarangify-docs/docs/ESP32%20Basic%20Tutorials%20/ESP-IDF%20Tutorials/esp-idf-installation).

For cellular applications, the next step is to work with the **SIMCom A7672X** modem through UART and AT commands, then build applications for SMS, network connectivity, and 4G LTE data communication.