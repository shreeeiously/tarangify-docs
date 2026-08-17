---
id: esp-idf-installation
title: Set Up Environment
sidebar_label: Set Up Environment
sidebar_position: 2
description: Set up ESP-IDF and Visual Studio Code for ESP32 development.
---

# Section 1: Set Up Environment

Welcome to the **Tarangify ESP-IDF Getting Started Tutorial**!

This section introduces the basic concepts of **ESP-IDF** and guides you through setting up the ESP32 development environment using **Visual Studio Code**.

After completing this section, you will be able to install ESP-IDF, configure Visual Studio Code, install the required extensions, and verify that your development environment is ready for ESP32 and ESP32-S3 development.

:::info

A video version of this tutorial may also be available through the **Tarangify** learning resources. Check the Tarangify documentation and community resources for the latest tutorials and demonstrations.

:::

## Important Note: Hardware and Software Versions

### Hardware

The core concepts covered in this tutorial apply to **ESP32-series development boards**.

The examples are primarily intended for **ESP32-S3-based boards**, including Tarangify development boards such as the **T-CORE-S3-24V** and **T-CORE-S3-BAT**.

If you are using a different ESP32 development board, you may need to modify the GPIO assignments, peripherals, or hardware configuration according to your board's specifications.

:::tip

For the best learning experience, we recommend using an **ESP32-S3 development board** when following the examples in this tutorial.

:::

### Software

This tutorial is based on **ESP-IDF v6.x**.

ESP-IDF is continuously updated, and API or project-configuration differences may occur between different versions. For the most consistent results, use the ESP-IDF version specified by each tutorial.

For more information about ESP-IDF versions and compatibility, refer to the official Espressif documentation.

---

## 1. What Is ESP-IDF?

**ESP-IDF (Espressif IoT Development Framework)** is Espressif's official development framework for ESP32-series microcontrollers.

ESP-IDF provides the software libraries, APIs, build tools, compiler, flashing utilities, debugging tools, and configuration system required to develop applications for ESP32 devices.

It supports a wide range of Espressif chips, including:

- ESP32
- ESP32-S2
- ESP32-S3
- ESP32-C3
- ESP32-C5
- ESP32-C6
- ESP32-H2
- ESP32-P4

ESP-IDF applications are primarily developed using **C and C++**.

The framework provides low-level access to the hardware while also providing higher-level components for networking, Bluetooth, storage, peripherals, security, and other IoT functionality.

:::info

ESP-IDF is different from the Arduino framework.

Arduino provides a simplified programming environment that is excellent for learning and rapid prototyping. ESP-IDF provides more direct access to the ESP32 hardware and is commonly used when developing more complex or production-oriented applications.

:::

---

## 2. Why Choose ESP-IDF?

ESP32 development can be performed using several frameworks, including Arduino, MicroPython, and ESP-IDF.

ESP-IDF is particularly useful when you need greater control over the hardware and software.

### Key Advantages

#### Official Espressif Framework

ESP-IDF is developed and maintained by **Espressif**, the manufacturer of ESP32-series chips.

It provides first-class support for new ESP32 devices and features.

#### Built-in FreeRTOS

ESP-IDF integrates **FreeRTOS**, allowing applications to run multiple tasks concurrently.

For example, an application can have separate tasks for:

- Wi-Fi communication
- Sensor data acquisition
- Display updates
- Motor control
- Data logging

#### Low-Level Hardware Control

ESP-IDF provides APIs for directly controlling ESP32 hardware resources such as:

- GPIO
- ADC
- PWM
- UART
- SPI
- I2C
- Timers
- Interrupts
- Wi-Fi
- Bluetooth

#### Component-Based Architecture

ESP-IDF applications are organized using a component-based architecture.

Components allow functionality to be separated into reusable modules, making larger projects easier to maintain.

#### Production-Oriented Features

ESP-IDF includes features useful for commercial and connected products, including:

- OTA firmware updates
- Secure Boot
- Flash Encryption
- Partition Management
- Networking
- Power Management

---

## 3. Setting Up the ESP-IDF Development Environment

There are several ways to work with ESP-IDF.

### Command-Line Tools

ESP-IDF provides command-line tools that allow you to create, configure, build, flash, and monitor projects.

The primary command-line tool is:

```bash
idf.py
```

For example:

```bash
idf.py build
```

can be used to build an ESP-IDF project.

### Visual Studio Code

For this tutorial, we recommend using **Visual Studio Code with the ESP-IDF extension**.

This provides an integrated environment for creating, building, flashing, monitoring, and debugging ESP32 applications.

---

## 3.1 Installing ESP-IDF

Before starting, make sure you have a supported computer and an ESP32 development board.

For this tutorial, an **ESP32-S3 development board** is recommended.

### Step 1: Install ESP-IDF

Download and install ESP-IDF and its required tools from Espressif's official documentation.

[ESP-IDF Get Started Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/)

The ESP-IDF installation includes the tools required to:

* Compile source code
* Configure projects
* Build firmware
* Flash firmware
* Monitor the ESP32
* Debug applications

---

## 3.2 Verify ESP-IDF Installation

After installing ESP-IDF, open an ESP-IDF-enabled terminal.

Run:

```bash
idf.py --version
```

You should see the installed ESP-IDF version.

For example:

```text
ESP-IDF v6.x
```

If the version is displayed successfully, the ESP-IDF command-line environment is available.

You can also verify the ESP-IDF installation path.

On Linux:

```bash
echo $IDF_PATH
```

A correctly configured environment should return the location of your ESP-IDF installation.

---

## 3.3 Installing Visual Studio Code

Download and install **Visual Studio Code** on your computer.

[Download Visual Studio Code](https://code.visualstudio.com/)

After installation, open Visual Studio Code.

---

## 3.4 Install the ESP-IDF Extension

The official ESP-IDF extension integrates ESP-IDF development into Visual Studio Code.

### Step 1

Open Visual Studio Code.

### Step 2

Open the **Extensions** panel.

You can also use:

```text
Ctrl + Shift + X
```

### Step 3

Search for:

```text
ESP-IDF
```

Install the **Espressif IDF** extension.

### Step 4

After installation, reload Visual Studio Code if requested.

The ESP-IDF extension provides tools for:

* Creating projects
* Selecting ESP32 targets
* Configuring projects
* Building firmware
* Flashing firmware
* Monitoring serial output
* Debugging applications

---

## 3.5 Configure ESP-IDF in VS Code

Open the ESP-IDF extension configuration from the VS Code Command Palette.

Press:

```text
Ctrl + Shift + P
```

Then search for:

```text
ESP-IDF: Configure ESP-IDF Extension
```

Follow the configuration wizard.

If ESP-IDF is already installed and correctly configured, the extension should be able to detect the ESP-IDF environment.

---

## 4. VS Code ESP-IDF Interface

Once an ESP-IDF project is opened in Visual Studio Code, the ESP-IDF extension provides several useful controls.

The bottom toolbar provides quick access to common development operations.

### ESP-IDF Version

Select or view the ESP-IDF version being used by the project.

### Flash Method

Select the interface used to program the ESP32.

Depending on the hardware, this may include:

* UART
* JTAG
* DFU

### Select Port

Select the serial port connected to your ESP32 development board.

For example, on Linux:

```text
/dev/ttyUSB0
```

or:

```text
/dev/ttyACM0
```

### Set Target

Select the ESP32 chip used by the project.

For an ESP32-S3 project:

```text
esp32s3
```

This is equivalent to:

```bash
idf.py set-target esp32s3
```

### SDK Configuration

Open the ESP-IDF configuration interface.

This is equivalent to:

```bash
idf.py menuconfig
```

### Full Clean

Removes the project's build output so that the project can be rebuilt from a clean state.

### Build

Compiles the ESP-IDF project.

Equivalent command:

```bash
idf.py build
```

### Flash

Uploads the compiled firmware to the ESP32.

Equivalent command:

```bash
idf.py flash
```

### Monitor

Opens the serial monitor.

Equivalent command:

```bash
idf.py monitor
```

### Build, Flash and Monitor

This combines the common workflow:

```bash
idf.py build flash monitor
```

---

## 5. Install the C/C++ Extension

The Microsoft C/C++ extension is recommended when developing ESP-IDF applications.

It provides features such as:

* C/C++ syntax highlighting
* Code navigation
* IntelliSense
* Error detection
* Debugging support

Open the VS Code Extensions panel:

```text
Ctrl + Shift + X
```

Search for:

```text
C/C++
```

Install the **C/C++ Extension** from Microsoft.

---

## 6. ESP-IDF Core Tools

Several tools work together behind the ESP-IDF development environment.

### idf.py

`idf.py` is the main command-line utility used for ESP-IDF projects.

Common commands include:

```bash
idf.py set-target esp32s3
```

Select the ESP32-S3 target.

```bash
idf.py menuconfig
```

Open project configuration.

```bash
idf.py build
```

Build the project.

```bash
idf.py flash
```

Flash the firmware.

```bash
idf.py monitor
```

Open the serial monitor.

You can also combine operations:

```bash
idf.py build flash monitor
```

### CMake

ESP-IDF uses **CMake** as its build-system configuration tool.

CMake reads the project's `CMakeLists.txt` files and prepares the build configuration.

### Ninja

**Ninja** is the build system used to efficiently compile ESP-IDF projects.

### esptool

**esptool** communicates with the ESP32 ROM bootloader.

It is used for operations such as:

* Flashing firmware
* Reading chip information
* Erasing flash
* Working with ESP32 flash memory

When you execute:

```bash
idf.py flash
```

ESP-IDF uses the underlying flashing tools to transfer the firmware to the ESP32.

### Kconfig and menuconfig

ESP-IDF uses **Kconfig** to manage project configuration.

Running:

```bash
idf.py menuconfig
```

opens the configuration interface.

You can configure settings such as:

* Wi-Fi parameters
* Logging levels
* Flash configuration
* Partition settings
* Component options
* Application settings

The resulting configuration is stored in:

```text
sdkconfig
```

---

## 7. Verify Your Development Environment

Before continuing to the next section, verify that:

* [ ] ESP-IDF is installed.
* [ ] `idf.py --version` works.
* [ ] Visual Studio Code is installed.
* [ ] The ESP-IDF extension is installed.
* [ ] The C/C++ extension is installed.
* [ ] Your ESP32 development board is connected.
* [ ] The correct serial port can be detected.
* [ ] The ESP32-S3 target can be selected.

Once these steps are complete, your development environment is ready.

---

## 8. Reference Links

* [ESP-IDF Programming Guide](https://docs.espressif.com/projects/esp-idf/en/latest/)
* [ESP-IDF Get Started Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/)
* [ESP-IDF VS Code Extension Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/developing-with-vscode.html)
* [ESP-IDF GitHub Repository](https://github.com/espressif/esp-idf)



