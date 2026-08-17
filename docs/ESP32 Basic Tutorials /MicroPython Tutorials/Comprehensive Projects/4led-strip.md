---
id: led-strip
title: Fun LED Strip
sidebar_label: Fun LED Strip
sidebar_position: 17
description: Use a potentiometer to control a WS2812 LED strip in real time, sweeping through yellow, green, and red as more LEDs light up.
---

# Fun LED Strip

:::tip

The core logic here applies to any ESP32-series board. Pin numbers are just examples — adjust for your specific Tarangify board if needed.

:::

## Project Overview

This project turns a potentiometer into a live controller for a WS2812 addressable LED strip. As you turn the knob, more LEDs light up in sequence, and the color sweeps through three stages — yellow, then green, then red — creating a smooth gradient effect across the strip.

## Wire It Up

You'll need:

- 1x WS2812 LED strip
- 1x potentiometer
- 1x breadboard
- Jumper wires
- An ESP32-series board

Wire the potentiometer as in [Section 4](../analog-input#3-wire-up-a-potentiometer), and the LED strip's data-in line to its own GPIO pin (plus power and ground per the strip's requirements). This example uses GPIO7 for the potentiometer and GPIO8 for the strip.

## Code

```python
import time
from machine import Pin, ADC
import neopixel

# --- Configuration ---
POT_PIN_NUM = 7
NEO_PIN_NUM = 8
NUM_LEDS = 8

# --- Colors (R, G, B) ---
COLOR_YELLOW = (255, 255, 0)
COLOR_GREEN  = (0, 255, 0)
COLOR_RED    = (255, 0, 0)
COLOR_OFF    = (0, 0, 0)

np = neopixel.NeoPixel(Pin(NEO_PIN_NUM), NUM_LEDS)
pot = ADC(Pin(POT_PIN_NUM))

def update_leds(adc_val):
    """
    Update the strip based on the potentiometer's ADC value.
    adc_val: 0 - 65535
    """
    # map 0-65535 onto 0-24 (3 color stages x 8 LEDs)
    total_steps = 3 * NUM_LEDS
    position = int((adc_val / 65535) * total_steps)

    if position > total_steps:
        position = total_steps  # clamp, just in case

    for i in range(NUM_LEDS):
        # checked high-to-low so later stages correctly override earlier ones
        if position > (2 * NUM_LEDS + i):
            np[i] = COLOR_RED
        elif position > (1 * NUM_LEDS + i):
            np[i] = COLOR_GREEN
        elif position > i:
            np[i] = COLOR_YELLOW
        else:
            np[i] = COLOR_OFF

    np.write()

print("System started: Potentiometer controlling WS2812")

while True:
    try:
        val = pot.read_u16()  # 0-65535
        update_leds(val)
        time.sleep_ms(50)     # avoid excessive refresh rate

    except KeyboardInterrupt:
        for i in range(NUM_LEDS):
            np[i] = COLOR_OFF
        np.write()
        print("Program stopped")
        break
```

## How It Works

**Setup:** `neopixel.NeoPixel(Pin(NEO_PIN_NUM), NUM_LEDS)` creates the strip object — MicroPython's ESP32 firmware includes the `neopixel` module by default, no separate install needed. `ADC(Pin(POT_PIN_NUM))` sets up the potentiometer input the same way as earlier ADC examples.

**The mapping trick in `update_leds()`:** the ADC's 0–65535 range gets scaled down to a single `position` value spanning `0` to `total_steps` (24, for 3 stages × 8 LEDs) — this one number represents "how far along the whole three-stage sequence we are."

**Per-LED color logic:** for each LED index `i`, the function checks `position` against three thresholds, from highest to lowest:

- `position > 2*NUM_LEDS + i` → red (the "final" stage — this LED has passed all the way through)
- `position > NUM_LEDS + i` → green (mid stage)
- `position > i` → yellow (LED has just turned on)
- otherwise → off (haven't reached this LED yet)

Checking from highest threshold to lowest is what makes this work correctly as a priority order — each LED naturally "graduates" from off → yellow → green → red as `position` climbs past its individual thresholds, and since each LED's thresholds are offset by its index `i`, LEDs further down the strip light up (and progress through colors) later than ones earlier in the strip — that offset is what produces the smooth sweeping gradient rather than every LED changing in lockstep.

**`np.write()`** is what actually pushes the buffered colors out over WS2812's single-wire protocol — nothing changes on the physical strip until this is called.

**Main loop:** reads the potentiometer, updates the strip, and waits 50ms between updates — fast enough to feel responsive to turning the knob, without needlessly re-writing the strip more often than useful. `Ctrl+C` triggers a clean shutdown that explicitly turns every LED off before exiting.

## Reference Links

* [Section 4: ADC Analog Input](../analog-input)
* [MicroPython `neopixel` module reference](https://docs.micropython.org/en/latest/library/neopixel.html)

