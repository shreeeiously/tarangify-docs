---
id: micropython-getting-started
title: Set Up Development Environment
sidebar_label: Set Up Development Environment
sidebar_position: 2
description: Learn what MicroPython is and set up a MicroPython development environment for ESP32 using Thonny.
---

# Section 1: Set Up Development Environment

This section introduces MicroPython and walks through getting a working MicroPython development setup for ESP32-series boards.

:::tip

The core steps here apply to any ESP32 board. Screenshots and specific settings reference Tarangify ESP32-S3-based boards — adjust chip selection and pin numbers if you're on a different board.

:::

---

## 1. What Is MicroPython?

MicroPython is a compact, from-scratch implementation of Python 3 designed to run on microcontrollers and other memory- and storage-constrained devices.

It's genuinely lightweight — MicroPython can run on hardware with as little as 256 KB of flash and 16 KB of RAM. ESP32-class chips, with 512 KB+ of flash and 128 KB+ of RAM, sit comfortably above that floor, so you get a smoother, more full-featured experience than on the smallest supported targets.

The short version: MicroPython lets you write Python and have it directly control real hardware, which makes embedded development dramatically more approachable than starting straight in C.

### 1.1 How It Actually Runs

MicroPython lives entirely inside firmware you flash onto the device. Once that firmware is running, you interact with it in two ways:

**Interactively, via the REPL.** After boot, the device runs a small Python interpreter and waits over a serial connection for input. Anything you type gets executed immediately, with results echoed straight back — this is the **REPL** (Read-Eval-Print Loop), and it's what makes MicroPython development feel so fast to iterate on.

**By running saved files.** MicroPython also looks for code on its onboard filesystem at boot: first `boot.py` (a system-level startup script), then `main.py` (your application). Anything saved as `main.py` runs automatically every time the board powers on — no manual step required.

### 1.2 How It Differs From Standard Python

- **It's not CPython ported down** — MicroPython is a separate implementation written specifically for embedded targets. It follows Python 3 syntax closely, but the internals (and performance characteristics) are quite different from CPython.
- **A trimmed standard library** — with RAM and flash both tight, MicroPython ships only a subset of what full Python offers. Heavy libraries like `numpy` or `requests` aren't included as-is; where similar functionality exists, it's usually via a much smaller, purpose-built module.
- **Built-in hardware access** — MicroPython's standout feature is direct hardware control through modules like `machine` (GPIO, I2C, SPI, ADC, PWM, and so on) and `network` (Wi-Fi, Bluetooth).
- **Broad hardware support** — beyond ESP32, MicroPython runs on STM32 boards, ESP8266, Raspberry Pi Pico (RP2040), and many others.

### 1.3 MicroPython vs. Arduino vs. ESP-IDF

| | MicroPython | Arduino | ESP-IDF |
|---|---|---|---|
| Learning curve | Low | Medium | High |
| Development speed | Fast | Medium | Slow |
| Runtime performance | Medium | High | Highest |
| Memory overhead | Relatively high | Medium | Fully controllable |

If you want to move fast and don't need to squeeze out every cycle or byte, MicroPython is usually the quickest path from idea to working hardware. If you need tight control over performance and memory, ESP-IDF (covered in the other tutorial series) is the better fit.

---

## 2. Setting Up Your Development Environment

[Thonny](https://thonny.org/) is a beginner-friendly Python IDE with solid built-in MicroPython support — firmware flashing, a file browser for the device, and an interactive shell, all in one place. This tutorial uses Thonny throughout.

### 2.1 Install Thonny

Download and install Thonny from [thonny.org](https://thonny.org/).

### 2.2 Flash MicroPython Firmware

Before MicroPython code will run, the board needs MicroPython firmware flashed onto it. A few approaches work; the one below (flashing through Thonny directly) is the simplest for most people.

1. **Connect the board** to your computer over USB.

   :::info
   If the board doesn't show up or flashing times out, try entering download mode manually: hold **BOOT**, plug in the USB cable, then release **BOOT**.
   :::

2. **Open the interpreter settings.** In Thonny, click the interpreter indicator in the bottom-right corner (it likely shows "Local Python" initially), then choose **Configure interpreter**.

3. **Open the firmware installer.** Select **MicroPython (ESP32)** as the interpreter and pick the port your board is connected to. Click **Install or update MicroPython (esptool)**.

4. **Choose firmware options:**
   - **Target port** — the port your board is on (if you're not sure which one, unplug the board and see which port disappears).
   - **MicroPython family** — the chip family matching your hardware.
   - **Variant** — the generic `Espressif ...` option for your chip.
   - **Version** — generally the latest stable release.

   :::info
   If these fields are greyed out, Thonny hasn't finished fetching the firmware list over the internet yet. If it never loads, download a `.bin` firmware file manually from the [MicroPython downloads page](https://micropython.org/download/?port=esp32) and use Thonny's "select local MicroPython image" option instead.
   :::

5. **Flash it.** Click **Install**. Thonny erases the existing flash and writes the new firmware — wait for the `Done!` message.

### 2.3 Verify the Setup

1. **Reconnect the board** — unplug and plug it back in, then make sure Thonny's interpreter is set to **MicroPython (ESP32)** with the correct port selected.

   :::note
   The board's COM port can change after flashing, especially on chips with native USB (like ESP32-S3/C3). If Thonny can't connect, reselect the port from the bottom-right menu.
   :::

2. **Restart the interpreter** if the Shell panel looks unresponsive — the Stop button on the toolbar restarts it.

3. **Check the prompt.** A successful connection shows the MicroPython version, board info, and a `>>>` prompt in the Shell — that's the MicroPython REPL running live on your board.

4. **Run a test line.** At the `>>>` prompt, type:

   ```python
   print('Hello, ESP32!')
   ```

   and press Enter. You should immediately see `Hello, ESP32!` echoed back.

At this point your MicroPython environment is fully working, and you've run your first line of code directly on the board.

---

## 3. Reference Links

* [MicroPython ESP32 port README](https://github.com/micropython/micropython/blob/master/ports/esp32/README.md)
* [MicroPython official documentation](https://docs.micropython.org/en/latest/reference/index.html)
* [MicroPython firmware downloads](https://micropython.org/download/?port=esp32)

