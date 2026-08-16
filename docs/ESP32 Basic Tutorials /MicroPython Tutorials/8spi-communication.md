---
id: spi-communication
title: SPI Communication
sidebar_label: SPI Communication
sidebar_position: 9
description: Understand the SPI protocol and ESP32's SPI hardware, then drive an SSD1327 OLED display over SPI with MicroPython.
---

# Section 8: SPI Communication

This section covers how SPI works, how ESP32's SPI hardware and pin mapping are organized, and puts it into practice by driving the same SSD1327 OLED display from [Section 7](./i2c-communication) — this time over SPI instead of I2C.

:::info

Make sure you've completed [**Section 1: Set Up Development Environment**](./getting-started) through [**Section 7: I2C Communication**](./i2c-communication) before starting this section.

:::

---

## 1. What SPI Is

**SPI (Serial Peripheral Interface)** is a high-speed, full-duplex synchronous serial protocol, commonly used for displays, TF/SD cards, flash memory, and other peripherals that need more bandwidth than I2C comfortably offers.

Key characteristics:

- **Four wires** (three if there's only ever one device on the bus).
- **Controller/peripheral architecture** — one controller drives the timing; one or more peripherals respond.
- **Full-duplex** — sending and receiving happen simultaneously on separate lines, unlike I2C's shared data line.
- **Fast** — commonly tens of MHz, well beyond typical I2C or UART speeds.
- **Synchronous** — the controller supplies the clock, same idea as I2C but with dedicated lines for each direction.

The four signal lines:

- **SCK** (Serial Clock) — the timing signal, driven by the controller.
- **MOSI** (Master Out, Slave In) — controller → peripheral data.
- **MISO** (Master In, Slave Out) — peripheral → controller data.
- **CS/SS** (Chip/Slave Select) — the controller pulls this line low to address a specific peripheral. Each additional peripheral device needs its own dedicated CS line.

:::info

**A note on terminology:** some current documentation and open-source projects have moved away from "master/slave" language. You may see **Controller** in place of "master," **Peripheral** in place of "slave," and the signal names **PICO** ("Peripheral In, Controller Out") and **POCI** ("Peripheral Out, Controller In") in place of MOSI and MISO. Same wires, same protocol — just newer names. This tutorial sticks with the more common legacy naming for clarity, since it's still what most current libraries and pinout diagrams use.

:::

---

## 2. SPI on ESP32

### 2.1 Available Controllers

ESP32-series chips generally have four SPI controllers on board, but they're not interchangeable:

- **SPI0 and SPI1** are reserved by the system, internally wired to the chip's own flash and PSRAM — not available for your application code.
- **SPI2 and SPI3** are general-purpose and fully available for driving your own peripherals — displays, SD cards, sensors, and so on.

### 2.2 How MicroPython Numbers Them

MicroPython's `machine.SPI` class refers to these by `id`, which doesn't always match the chip datasheet's naming:

- `id=1` → hardware SPI2 (commonly called **HSPI** on the original ESP32, **FSPI** on ESP32-S3)
- `id=2` → hardware SPI3 (commonly called **VSPI** on the original ESP32)

:::tip

The chip-specific names (HSPI/VSPI/FSPI) vary between datasheets and chip generations — in MicroPython code you only ever need to track `id=1` vs `id=2`.

:::

### 2.3 Pin Assignment

Like I2C, SPI signals can be routed to nearly any GPIO pin thanks to the GPIO Matrix — but each controller also has a set of **default pins** wired through IO MUX instead, which support meaningfully higher clock speeds:

- **Default (IO MUX) pins** — up to roughly 80MHz.
- **Custom (GPIO Matrix) pins** — typically capped around 40MHz, which is still plenty for most peripherals like displays and SD cards.

Default pins for common chips:

| Chip | MicroPython id | Hardware name | MOSI | MISO | SCK |
|---|---|---|---|---|---|
| ESP32 | 1 | HSPI | GPIO13 | GPIO12 | GPIO14 |
| ESP32 | 2 | VSPI | GPIO23 | GPIO19 | GPIO18 |
| ESP32-S3 | 1 | SPI2 (FSPI) | GPIO11 | GPIO13 | GPIO12 |
| ESP32-S3 | 2 | SPI3 | GPIO35 | GPIO37 | GPIO36 |

:::note

Exact pin numbers vary between chip models — check your specific chip's datasheet for the authoritative values.

:::

You can also check a controller's default pins directly from the REPL:

```python
from machine import SPI
```

```python
SPI(1)   # inspect SPI2's default pin assignment
```

```python
SPI(2)   # inspect SPI3's default pin assignment
```

---

## 3. Example: Driving an OLED Display Over SPI

This mirrors the I2C OLED example from [Section 7](./i2c-communication#4-example-2-driving-an-ssd1327-oled-display), but over SPI — generally the better choice when you want faster screen refreshes.

### 3.1 Wire It Up

You'll need an SPI-capable SSD1327-based OLED module, a breadboard, and jumper wires.

| Board pin | Module pin | Purpose |
|---|---|---|
| GPIO13 | SCK | SPI clock |
| GPIO11 | MOSI | SPI data out |
| GPIO10 | CS | chip select |
| GPIO8 | DC | data/command select |
| 3.3V | VCC | power |
| GND | GND | ground |

:::note

Since a display like this only receives data from the controller, MISO isn't wired up or needed here.

:::

### 3.2 Upload the Driver

Same driver as [Section 7](./i2c-communication#41-upload-the-driver) — the [`micropython-ssd1327`](https://github.com/mcauser/micropython-ssd1327) library. If you already uploaded `ssd1327.py` for that section, you're set; otherwise upload it to the board's root directory now.

### 3.3 Code

```python
from machine import Pin, SPI
import ssd1327

SCK_PIN = 13
MOSI_PIN = 11
CS_PIN = 10
DC_PIN = 8

# id=1 -> SPI2 controller, clocked at 10 MHz
spi = SPI(1, baudrate=10000000, sck=Pin(SCK_PIN), mosi=Pin(MOSI_PIN))

oled = ssd1327.SSD1327_SPI(128, 128, spi, dc=Pin(DC_PIN), cs=Pin(CS_PIN))

print("SSD1327 OLED test")

oled.fill(0)  # clear to black

# framebuf.text(s, x, y, c) - c is 4-bit grayscale, 0 (black) to 15 (brightest)
oled.text("Hello,", 10, 10, 15)
oled.text("MicroPython!", 10, 25, 8)
oled.text("ESP32", 10, 40, 1)

oled.framebuf.rect(0, 0, 128, 128, 15)
oled.framebuf.ellipse(0, 0, 128, 128, 15)

oled.show()
```

**How it works:**

- `SPI(1, baudrate=10000000, sck=..., mosi=...)` sets up hardware SPI2 at 10MHz. Since this display only receives data, `miso` is left unconfigured.
- `ssd1327.SSD1327_SPI(128, 128, spi, dc=..., cs=...)` creates the display object — same resolution and drawing API as the I2C version from Section 7, just constructed with SPI-specific arguments (`dc` and `cs`) instead of an I2C address.
- Everything from `oled.fill()` onward works identically to the I2C example: drawing calls just modify an in-memory buffer, and nothing actually appears on screen until `oled.show()` sends that buffer over the wire.

Run this and you'll see the same layout as the I2C example — "Hello," in bright text, "MicroPython!" dimmer, "ESP32" dimmer still, framed by a rectangle and circle outline — just refreshed considerably faster thanks to SPI's higher bandwidth.

---

## 4. Reference Links

* [MicroPython ESP32 Quick Reference — Hardware SPI](https://docs.micropython.org/en/latest/esp32/quickref.html#hardware-spi-bus)
* [MicroPython `machine.SPI` class reference](https://docs.micropython.org/en/latest/library/machine.SPI.html)
* [micropython-ssd1327 driver library](https://github.com/mcauser/micropython-ssd1327)
* [MicroPython `framebuf` module reference](https://docs.micropython.org/en/latest/library/framebuf.html)
* [OSHWA: A Resolution to Redefine SPI Signal Names](https://oshwa.org/resources/a-resolution-to-redefine-spi-signal-names/)

---

## Next Step

You can now drive high-speed SPI peripherals in addition to I2C ones.

Continue to:

[**Section 9: Wi-Fi Networking Basics →**](./9wifi-networking-basic)