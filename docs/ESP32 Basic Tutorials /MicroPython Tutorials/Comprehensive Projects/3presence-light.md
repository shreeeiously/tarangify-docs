---
id: presence-light
title: Motion Sensor Light
sidebar_label: Motion Sensor Light
sidebar_position: 16
description: Use a PIR motion sensor to automatically turn a WS2812 LED strip on and off based on nearby movement.
---

# Motion Sensor Light

:::tip

The core logic here applies to any ESP32-series board. Pin numbers are just examples — adjust for your specific Tarangify board if needed.

:::

## Project Overview

This project builds a basic motion-activated light: a PIR (Passive Infrared) sensor detects nearby movement, and a WS2812 addressable LED strip switches on automatically — staying lit until no motion has been seen for a configurable timeout, then switching off.

## Wire It Up

You'll need:

- 1x PIR motion sensor
- 1x WS2812 LED strip
- 1x breadboard
- Jumper wires
- An ESP32-series board

:::warning

Both the PIR sensor and the WS2812 strip typically need a **5V** supply, not 3.3V — check your specific modules' requirements.

:::

:::note

Most PIR modules have a jumper for trigger mode — set it to **H mode** (high-level, "repeatable trigger") for this project, so the output stays high continuously while motion is present rather than pulsing once per detection.

:::

:::tip

While debugging, it's worth turning the PIR module's sensitivity/distance potentiometer down to its minimum first — this avoids false triggers from across the room while you confirm the basic logic works, and you can dial it back up once everything's verified.

:::

## Code

```python
import time
import machine
import neopixel

# --- Configuration ---
PIR_PIN = 7
LED_PIN = 8
NUM_LEDS = 8
TIMEOUT = 5000       # how long the light stays on after motion stops, in ms
COLOR = (128, 0, 128)

# --- Initialization ---
pir = machine.Pin(PIR_PIN, machine.Pin.IN, machine.Pin.PULL_DOWN)
np = neopixel.NeoPixel(machine.Pin(LED_PIN), NUM_LEDS)

def switch_light(on):
    color = COLOR if on else (0, 0, 0)
    np.fill(color)
    np.write()

try:
    print("System starting... (Press Ctrl+C to stop)")
    is_on = False
    last_motion_time = time.ticks_ms()

    switch_light(False)  # force a known-off starting state

    while True:
        current_time = time.ticks_ms()

        if pir.value() == 1:
            # motion currently detected - keep refreshing the timestamp
            last_motion_time = current_time

            if not is_on:
                print("Motion detected -> Turn on light")
                switch_light(True)
                is_on = True

        else:
            # no motion right now - only relevant if the light is already on
            if is_on:
                duration = time.ticks_diff(current_time, last_motion_time)
                if duration > TIMEOUT:
                    print("Timeout - no motion -> Turn off light")
                    switch_light(False)
                    is_on = False
                    # brief pause to avoid a false re-trigger from power fluctuation on shutoff
                    time.sleep_ms(1000)

        time.sleep_ms(100)  # 100ms polling: responsive without hammering the CPU

except KeyboardInterrupt:
    print("\nManually stopped by user")

finally:
    print("Cleaning up resources, turning off LED strip...")
    switch_light(False)
```

## How It Works

**Configuration constants** up top — pin numbers, LED count, timeout duration, and color — keep the tunable parameters in one place, separate from the control logic.

**Initialization:** `machine.Pin(PIR_PIN, machine.Pin.IN, machine.Pin.PULL_DOWN)` sets up the PIR input with an internal pull-down, so the pin reads a defined LOW when the sensor's output isn't actively driven high. A PIR sensor works by detecting the infrared radiation naturally given off by warm bodies moving through its field of view — when it senses that change, it drives its output pin high.

**`switch_light(on)`:** a small helper wrapping the two calls needed to actually update a NeoPixel strip — `np.fill(color)` sets every pixel's color in the local buffer, and `np.write()` pushes that buffer out to the physical LEDs. Nothing changes on the strip until `write()` is called.

**The main loop's core logic:**

1. **While motion is detected** (`pir.value() == 1`) — continuously refresh `last_motion_time` to the current time, and turn the light on if it isn't already.
2. **While no motion is detected** — only matters if the light is currently on. It computes how long it's been since the last detected motion using `time.ticks_diff(current_time, last_motion_time)` (the correct way to compare timestamps in MicroPython, since `ticks_ms()` values can wrap around). If that gap exceeds `TIMEOUT`, the light turns off — with a brief `time.sleep_ms(1000)` pause afterward to avoid a spurious re-trigger from any momentary voltage blip as things power down.

The loop polls every 100ms — frequent enough to feel responsive, without needlessly burning CPU cycles checking constantly.

**Exception handling:** the `try`/`except KeyboardInterrupt`/`finally` structure means `Ctrl+C` exits gracefully, and `finally` guarantees the strip gets turned off no matter how the program stops — so you never end up with lights stuck on after an interrupted run.

## Reference Links

* [Section 3: GPIO Digital Output/Input](./3digital-io)
* [MicroPython `neopixel` module reference](https://docs.micropython.org/en/latest/library/neopixel.html)

---

## Next Step

Continue to:

[**Fun LED Strip →**](./4led-strip)