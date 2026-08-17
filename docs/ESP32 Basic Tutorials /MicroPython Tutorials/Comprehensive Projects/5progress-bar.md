---
id: progress-bar
title: Interactive Progress Bar
sidebar_label: Interactive Progress Bar
sidebar_position: 18
description: Read a potentiometer and render its value as a live horizontal progress bar or a semi-circular gauge on an SSD1327 OLED display.
---

# Interactive Progress Bar

:::tip

The core logic here applies to any ESP32-series board. Pin numbers are just examples — adjust for your specific Tarangify board if needed.

:::

## Project Overview

This project reads a potentiometer and renders its live value on an OLED display two different ways: a horizontal progress bar, or a semi-circular gauge with a moving pointer — like a speedometer needle. Turning the knob updates the display in real time.

## Wire It Up

You'll need:

- 1x SSD1327-based OLED display
- 1x potentiometer
- 1x breadboard
- Jumper wires
- An ESP32-series board

This example wires the OLED over SPI:

| Board pin | OLED pin | Purpose |
|---|---|---|
| GPIO13 | SCK | SPI clock |
| GPIO11 | MOSI | SPI data out |
| GPIO10 | CS | chip select |
| GPIO8 | DC | data/command select |
| 5V | VCC | power |
| GND | GND | ground |

:::tip

Many SSD1327-based displays also support I2C mode via a BS1/BS2 jumper setting. If you'd rather use I2C, wire it as in [Section 7](./7i2c-communication#3-wire-it-up) and swap the display initialization code as shown below.

:::

Wire the potentiometer as in [Section 4](../analog-input#3-wire-up-a-potentiometer) — this example uses GPIO7.

## Upload the Driver

Same driver as [Section 7](../i2c-communication#41-upload-the-driver) — the [`micropython-ssd1327`](https://github.com/mcauser/micropython-ssd1327) library. Upload `ssd1327.py` to your board's root directory if you haven't already.

## Code

```python
import time
import math
from machine import Pin, SPI, ADC
import ssd1327

SCK_PIN = 13
MOSI_PIN = 11
CS_PIN = 10
DC_PIN = 8
RST_PIN = 9

POT_PIN = 7

spi = SPI(1, baudrate=10000000, sck=Pin(SCK_PIN), mosi=Pin(MOSI_PIN))
oled = ssd1327.SSD1327_SPI(128, 128, spi, dc=Pin(DC_PIN), res=Pin(RST_PIN), cs=Pin(CS_PIN))

# For I2C instead, comment out the SPI block above and uncomment this:
# from machine import I2C
# SDA_PIN = 2
# SCL_PIN = 1
# I2C_ADDR = 0x3d
# i2c = I2C(0, scl=Pin(SCL_PIN), sda=Pin(SDA_PIN), freq=400000)
# oled = ssd1327.SSD1327_I2C(128, 128, i2c, I2C_ADDR)

adc = ADC(Pin(POT_PIN))

def get_percentage():
    """Read the potentiometer and return an integer 0-100."""
    val = adc.read_u16()  # 0-65535
    percent = int((val / 65535) * 100)
    return max(0, min(100, percent))

def show_horizontal_bar(oled, percent):
    """Draw a horizontal progress bar."""
    oled.fill(0)

    bar_x = 10
    bar_y = 55
    bar_w = 108
    bar_h = 18

    # outer frame in gray
    oled.framebuf.rect(bar_x, bar_y, bar_w, bar_h, 6)

    # inner fill in bright white, with a 2px margin from the frame
    inner_max_w = bar_w - 4
    fill_w = int((percent / 100) * inner_max_w)
    if fill_w > 0:
        oled.framebuf.fill_rect(bar_x + 2, bar_y + 2, fill_w, bar_h - 4, 15)

    oled.text("Progress", 32, 35, 8)
    p_str = f"{percent}%"
    text_x = 64 - (len(p_str) * 4)  # rough horizontal centering
    oled.text(p_str, text_x, 80, 15)

    oled.show()

def show_gauge(oled, percent):
    """Draw a semi-circular gauge with a pointer."""
    oled.fill(0)

    cx, cy = 64, 105   # center point, near the bottom of the screen
    radius = 55
    pointer_len = 48

    # tick marks around the semicircle, 180° (left) to 0° (right)
    for i in range(0, 11):
        angle = 180 - (i * 18)
        rad = math.radians(angle)

        x1 = int(cx + math.cos(rad) * radius)
        y1 = int(cy - math.sin(rad) * radius)
        x2 = int(cx + math.cos(rad) * (radius - 6))
        y2 = int(cy - math.sin(rad) * (radius - 6))

        oled.line(x1, y1, x2, y2, 6)

    # pointer angle scales with the percentage
    current_angle = 180 - (percent / 100 * 180)
    current_rad = math.radians(current_angle)
    px = int(cx + math.cos(current_rad) * pointer_len)
    py = int(cy - math.sin(current_rad) * pointer_len)
    oled.line(cx, cy, px, py, 15)

    oled.framebuf.fill_rect(cx-2, cy-2, 5, 5, 15)  # center hub

    oled.text(f"{percent}", 56, 110, 15)
    oled.text("GAUGE", 44, 10, 8)

    oled.show()

print("Started.")

while True:
    val = get_percentage()

    # pick one display mode:
    show_horizontal_bar(oled, val)
    # show_gauge(oled, val)

    time.sleep(0.05)
```

## How It Works

**`get_percentage()`** converts the raw 0–65535 ADC reading into a plain 0–100 percentage, clamped with `max()`/`min()` so it can never spill outside that range even with slight ADC noise.

**`show_horizontal_bar()`:** draws an outer rectangle as the bar's frame, then fills a proportionally-sized inner rectangle based on the percentage — leaving a small margin so the fill never overlaps the border. `oled.text()` labels the bar with a title and the current percentage.

**`show_gauge()`** is the more involved of the two, and uses basic trigonometry to place elements around a semicircle:

- **Tick marks:** loops 11 times (0%, 10%, 20%, ... 100%), computing an angle for each tick that sweeps from 180° (left) down to 0° (right) — matching how a real analog gauge reads left-to-right. `math.cos`/`math.sin` convert each angle into x/y coordinates for the tick's outer and inner endpoints, with `oled.line()` drawing the short radial line between them.
- **Pointer:** the same angle math, but scaled by the current percentage instead of a fixed tick position — `current_angle = 180 - (percent / 100 * 180)` maps 0% to 180° and 100% to 0°, giving a pointer that sweeps smoothly across the gauge as the value changes.
- **Center hub and labels:** a small filled square marks the pivot point, and text at top/bottom labels the gauge and shows the live number.

**Both drawing functions follow the same buffer-then-show pattern** you've seen in earlier OLED examples: `oled.fill(0)` clears the buffer, drawing calls modify it in memory, and `oled.show()` is what actually pushes it to the physical screen.

**Main loop:** reads the potentiometer and re-renders roughly 20 times per second (`time.sleep(0.05)`) — fast enough to feel live without needlessly hammering the display. Swap which `show_...` call is active (comment/uncomment) to switch between the bar and gauge display modes.

## Reference Links

* [Section 4: ADC Analog Input](../analog-input)
* [Section 8: SPI Communication](../spi-communication)
* [micropython-ssd1327 driver library](https://github.com/mcauser/micropython-ssd1327)
