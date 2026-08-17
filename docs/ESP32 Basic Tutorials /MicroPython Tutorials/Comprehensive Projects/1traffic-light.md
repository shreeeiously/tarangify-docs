---
id: traffic-light
title: Traffic Light
sidebar_label: Traffic Light
sidebar_position: 14
description: Simulate a red/yellow/green traffic light sequence using three LEDs and MicroPython.
---

# Traffic Light

:::tip

The core logic here applies to any ESP32-series board. Pin numbers are just examples — adjust them to match your specific Tarangify board if needed.

:::

## Project Overview

This project simulates a real traffic light: three LEDs cycle through green, a blinking yellow warning phase, and red, each held for a configurable duration.

## Wire It Up

You'll need:

- 3x LED
- 3x 330Ω resistor
- 1x breadboard
- Jumper wires
- An ESP32-series board

Wire each LED (through its own resistor) to its own GPIO pin, with all three cathodes tied to GND — same basic wiring as the [single-LED example](../digital-io#21-wire-it-up), just repeated three times. This example uses GPIO7 (red), GPIO8 (yellow), and GPIO9 (green).

## Code

```python
import time
import machine

RED_LED_PIN = 7
YELLOW_LED_PIN = 8
GREEN_LED_PIN = 9

RED_LIGHT_DURATION = 10      # red stays on for 10 seconds
GREEN_LIGHT_DURATION = 8     # green stays on for 8 seconds
YELLOW_LIGHT_DURATION = 3    # total time spent in the yellow blink phase
YELLOW_BLINK_INTERVAL = 0.5  # on/off duration per blink

red_led = machine.Pin(RED_LED_PIN, machine.Pin.OUT)
yellow_led = machine.Pin(YELLOW_LED_PIN, machine.Pin.OUT)
green_led = machine.Pin(GREEN_LED_PIN, machine.Pin.OUT)

def all_lights_off():
    """Turn off all three LEDs."""
    red_led.off()
    yellow_led.off()
    green_led.off()

print("Traffic light simulation program starting...")
print(f"Configuration: Red={RED_LIGHT_DURATION}s, Green={GREEN_LIGHT_DURATION}s, Yellow={YELLOW_LIGHT_DURATION}s")
print(f"Yellow light blink interval: {YELLOW_BLINK_INTERVAL}s")

try:
    while True:
        # --- Green phase ---
        print("Green light ON")
        all_lights_off()  # clear state before each transition
        green_led.on()
        time.sleep(GREEN_LIGHT_DURATION)

        # --- Yellow blink phase ---
        print("Yellow light blinking")
        green_led.off()

        # a full blink cycle (on + off) takes YELLOW_BLINK_INTERVAL * 2;
        # divide the total yellow duration by that to get the blink count
        num_blinks = int(YELLOW_LIGHT_DURATION / (YELLOW_BLINK_INTERVAL * 2))
        if num_blinks == 0:
            num_blinks = 1  # always blink at least once

        for _ in range(num_blinks):
            yellow_led.on()
            time.sleep(YELLOW_BLINK_INTERVAL)
            yellow_led.off()
            time.sleep(YELLOW_BLINK_INTERVAL)

        yellow_led.off()  # make sure it's off before moving on

        # --- Red phase ---
        print("Red light ON")
        red_led.on()
        time.sleep(RED_LIGHT_DURATION)

except KeyboardInterrupt:
    print("\nProgram interrupted by user.")

finally:
    # always leave the hardware in a known state, however the loop exits
    all_lights_off()
    print("All traffic lights are off. Program ended.")
```

## How It Works

**Constants up top** — pin numbers and phase durations are all defined together at the start, so tuning the timing later doesn't mean digging through the loop logic.

**`all_lights_off()`** — a small helper that guarantees a clean slate before each phase transition, so no light is ever left on by accident from a previous phase.

**The main loop** runs three phases in sequence, forever:

- **Green** — clear state, turn on green, hold for `GREEN_LIGHT_DURATION`.
- **Yellow blink** — turn off green, then compute how many full on/off cycles fit into `YELLOW_LIGHT_DURATION` given each cycle's length (`YELLOW_BLINK_INTERVAL * 2`), and blink that many times in a `for` loop.
- **Red** — turn on red and hold for `RED_LIGHT_DURATION`. Since yellow was already switched off at the end of its phase, no explicit cleanup is needed here.

**Exception handling:** wrapping the loop in `try`/`except KeyboardInterrupt`/`finally` means an interrupt (`Ctrl+C`) exits cleanly rather than crashing mid-cycle, and the `finally` block guarantees `all_lights_off()` runs no matter how the loop ends — so you never end up with a light stuck on.

## Reference Links

* [Section 3: GPIO Digital Output/Input](../digital-io)

