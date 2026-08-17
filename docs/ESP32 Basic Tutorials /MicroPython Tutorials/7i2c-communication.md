---
id: i2c-communication
title: I2C Communication
sidebar_label: I2C Communication
sidebar_position: 8
description: Understand the I2C protocol, scan a bus for connected devices, and drive an SSD1327 OLED display with MicroPython.
---

# Section 7: I2C Communication

This section covers how I2C works, then puts it to use two ways: scanning a bus to discover what's connected, and driving a real SSD1327-based OLED display using a community driver library.

:::info

Make sure you've completed [**Section 1: Set Up Development Environment**](./micropython-getting-started) through [**Section 6: UART Communication**](./uart-communication) before starting this section.

:::

---

## 1. What I2C Is

**I2C (Inter-Integrated Circuit)** — also written I²C or IIC — is a widely used two-wire serial protocol for connecting peripherals like sensors, displays, and memory chips.

Key characteristics:

- **Two wires** — just SDA (data) and SCL (clock), regardless of how many devices share the bus.
- **Controller/target architecture** — one or more controller devices can address multiple target devices on the same shared bus.

  :::info
  Newer editions of the I2C specification use "controller/target" terminology in place of the older "master/slave" wording. This tutorial uses both interchangeably, since most existing code and documentation still uses the older terms.
  :::

- **Address-based** — every device on the bus has its own 7-bit (or occasionally 10-bit) address, which is how the controller knows who it's talking to.
- **Synchronous** — the shared clock line keeps both sides in sync, which is part of why I2C is fairly reliable even with simple wiring.

### 1.1 Wiring and Pull-Up Resistors

The bus needs just:

- **SDA** — carries data
- **SCL** — carries the clock signal, driven by the controller
- **GND** — shared ground, same as any other digital interface

:::info

**Why pull-up resistors matter here:** I2C lines are open-drain — a device can only pull the line low, never actively drive it high. Pull-up resistors are what let the line return to HIGH when nothing's pulling it down, and without them the bus won't communicate reliably at all.

**When you need to add them yourself:** many I2C breakout modules already include built-in pull-ups, in which case you can usually wire straight in with no extra components. If you're not sure, check the module's schematic — but as a safe default, a 4.7kΩ resistor from each of SDA and SCL to 3.3V works well, especially on longer wires or busier buses with several devices.

:::

---

## 2. I2C on ESP32

MicroPython exposes two ways to do I2C: `machine.I2C` (hardware-backed) and `machine.SoftI2C` (bit-banged in software).

- **Hardware I2C** uses the chip's dedicated I2C controller — faster, lower CPU overhead, and thanks to ESP32's flexible pin routing, it can be mapped to essentially any GPIO pin.
- **Software I2C** emulates the protocol's timing in software. It exists mainly as a fallback for when hardware I2C channels are already in use elsewhere.

Since ESP32's hardware I2C isn't pin-restricted the way it is on some other microcontrollers, there's rarely a reason to reach for `SoftI2C` — default to `I2C`.

---

## 3. Example 1: Scanning the Bus

Before you can talk to a new I2C device, you need to know its address — and plenty of modules don't print it anywhere obvious, or let it be changed via jumpers. A quick scanner script settles this immediately by checking every possible address and reporting which ones respond.

### 3.1 Wire It Up

You'll need an I2C-capable module (this tutorial uses an SSD1327-based OLED display as the running example) plus, if the module doesn't already include them, two 4.7kΩ pull-up resistors.

| Board pin | Module pin | Note |
|---|---|---|
| GPIO1 | SDA | pull up to 3.3V if the module doesn't already include pull-ups |
| GPIO2 | SCL | pull up to 3.3V if the module doesn't already include pull-ups |
| 3.3V | VCC | power |
| GND | GND | ground |

:::note

Some OLED modules ship configured for SPI by default and need a jumper or resistor-link change to switch into I2C mode — check your specific module's documentation if a scan comes back empty.

:::

### 3.2 Code

```python
from machine import Pin, I2C

SDA_PIN = 1
SCL_PIN = 2

# id=0 selects the first hardware I2C controller
# freq=100000 sets standard-mode (100kHz) speed
i2c = I2C(0, scl=Pin(SCL_PIN), sda=Pin(SDA_PIN), freq=100000)

print("Scanning I2C bus...")
devices = i2c.scan()

if len(devices) == 0:
    print("No I2C devices found")
else:
    print("I2C devices found:", len(devices))
    for device in devices:
        print("Decimal address: ", device, " | Hex address: ", hex(device))
```

**How it works:**

- `I2C(0, scl=..., sda=..., freq=...)` sets up the hardware I2C controller on the given pins and speed. 100kHz ("standard mode") and 400kHz ("fast mode") are the two common choices.
- `i2c.scan()` checks every address in the valid 7-bit range (0x08–0x77) and returns a list of every address that responded.
- `hex(device)` converts each address to the hex format (like `0x3d`) that's conventionally used to refer to I2C addresses.

Run this against a connected OLED module and you'd typically see a single device reported, something like:

```text
Scanning I2C bus...
I2C devices found: 1
Decimal address:  61  | Hex address:  0x3d
```

---

## 4. Example 2: Driving an SSD1327 OLED Display

In practice, you rarely write raw I2C transfer logic for a specific chip by hand — you use a driver library someone's already built for that hardware. This example drives an SSD1327-based OLED using a community-maintained MicroPython driver.

:::tip

This example uses the [`micropython-ssd1327`](https://github.com/mcauser/micropython-ssd1327) driver by community developer mcauser. Download `ssd1327.py` from that repository and upload it to your board's root directory before running the code below.

:::

### 4.1 Upload the Driver

MicroPython firmware doesn't ship with display-specific drivers built in — you add them as regular `.py` files.

1. Download `ssd1327.py` from the driver repository linked above.
2. In Thonny's file view, right-click it and choose **Upload to /** — it needs to sit in the root of the board's filesystem for a plain `import ssd1327` to find it.

### 4.2 Code

```python
from machine import I2C, Pin
import ssd1327

SDA_PIN = 1
SCL_PIN = 2
I2C_ADDR = 0x3d

i2c = I2C(0, scl=Pin(SCL_PIN), sda=Pin(SDA_PIN), freq=400000)

oled = ssd1327.SSD1327_I2C(128, 128, i2c, I2C_ADDR)

oled.fill(0)  # clear to black

# framebuf.text(s, x, y, c) - c is 4-bit grayscale, 0 (black) to 15 (brightest)
oled.text("Hello,", 10, 10, 15)
oled.text("MicroPython!", 10, 25, 8)
oled.text("ESP32", 10, 40, 1)

oled.framebuf.rect(0, 0, 128, 128, 15)      # rectangle outline
oled.framebuf.ellipse(0, 0, 128, 128, 15)   # circle/ellipse outline

oled.show()
```

**How it works:**

- `ssd1327.SSD1327_I2C(width, height, i2c, addr)` creates the display object, tying it to the I2C bus and address you set up earlier.
- `oled.fill(0)` clears the display buffer to black.
- `oled.text(string, x, y, color)` writes text into the buffer using `framebuf`'s built-in 8×8 pixel font. The `color` value is 4-bit grayscale on this chip — `0` is black, `15` is brightest.
- The `ssd1327` driver builds on MicroPython's built-in `framebuf` module, which supplies the underlying drawing primitives (`rect`, `ellipse`, lines, and more) — the driver exposes these through `oled.framebuf`.
- **Nothing appears on screen until `oled.show()` is called** — every drawing call before that just modifies an in-memory buffer.

Run this and you should see "Hello, MicroPython!" and "ESP32" appear on the display, framed by a rectangle outline.

---

## 5. Notes and Gotchas

### 5.1 When You'd Actually Need SoftI2C

Because ESP32's hardware I2C can be routed to nearly any pin, there's rarely a real need for the software fallback — but the syntax, if you ever do need it, is a drop-in swap:

```python
from machine import Pin, SoftI2C

i2c = SoftI2C(scl=Pin(SCL_PIN), sda=Pin(SDA_PIN), freq=100000)
```

`SoftI2C` behaves identically from a code perspective, just emulated by the CPU rather than dedicated hardware — expect it to be somewhat less stable at higher speeds or under heavier load.

### 5.2 No Target/Slave Mode

MicroPython's `machine.I2C` and `machine.SoftI2C` classes only implement controller (master) mode. If your project needs the ESP32 to act as an I2C *target* device rather than the one initiating communication, that's outside what these classes currently support.

---

## 6. Reference Links

* [MicroPython `machine.I2C` class reference](https://docs.micropython.org/en/latest/library/machine.I2C.html)
* [MicroPython ESP32 Quick Reference — Hardware I2C](https://docs.micropython.org/en/latest/esp32/quickref.html#hardware-i2c-bus)
* [micropython-ssd1327 driver library](https://github.com/mcauser/micropython-ssd1327)
* [MicroPython `framebuf` module reference](https://docs.micropython.org/en/latest/library/framebuf.html)

