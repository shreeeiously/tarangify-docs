---
id: sos
title: SOS Signal
sidebar_label: SOS Signal
sidebar_position: 15
description: Blink an LED and beep a buzzer together to transmit the SOS distress signal in Morse code, with correct international timing ratios.
---

# SOS Signal

:::tip

The core logic here applies to any ESP32-series board. Pin numbers are just examples — adjust for your specific Tarangify board if needed.

:::

## Project Overview

This project drives an LED and buzzer together to transmit **SOS** — the internationally recognized distress signal — in proper Morse code timing.

## Morse Code Basics

Morse code encodes letters and numbers as sequences of two basic signals:

- **Dot** (`.`) — a short pulse.
- **Dash** (`-`) — a longer pulse.

SOS specifically breaks down as:

- **S** = three dots (`...`)
- **O** = three dashes (`---`)

giving the full sequence: `... --- ...`

**Timing matters as much as the pattern itself.** Morse code follows an internationally standardized ratio, all built off one base unit (the dot's duration):

- A dash is **3×** the length of a dot.
- The gap *within* a letter (between its dots/dashes) is **1×** a dot.
- The gap *between* letters is **3×** a dot.
- The gap *between* words (or full SOS repeats) is **7×** a dot.

Getting these ratios right is what makes the signal actually readable as Morse rather than just "blinking randomly."

## Wire It Up

You'll need:

- 1x LED
- 1x active buzzer
- 1x breadboard
- Jumper wires
- An ESP32-series board

Wire the LED the same way as [Section 3](../digital-io#21-wire-it-up), and the buzzer's signal pin to its own GPIO pin with the other leg to GND. This example uses GPIO7 for the LED and GPIO8 for the buzzer.

:::note

An **active** buzzer has its own built-in oscillator — it just beeps whenever its signal pin is driven high, no PWM or tone-generation needed. That's what makes it controllable with a plain digital output, same as an LED.

:::

## Code

```python
import time
import machine

LED_PIN = 7
BUZZER_PIN = 8

led = machine.Pin(LED_PIN, machine.Pin.OUT)
buzzer = machine.Pin(BUZZER_PIN, machine.Pin.OUT)

# --- Morse code timing ---
DOT_DURATION = 0.2  # base time unit, in seconds

DASH_DURATION = 3 * DOT_DURATION       # dash = 3 dots
INTER_ELEMENT_GAP = DOT_DURATION       # gap within a letter = 1 dot
INTER_LETTER_GAP = 3 * DOT_DURATION    # gap between letters = 3 dots
INTER_WORD_GAP = 7 * DOT_DURATION      # gap between repeats = 7 dots

def signal_on():
    """Turn on the LED and buzzer together."""
    led.on()
    buzzer.on()

def signal_off():
    """Turn off the LED and buzzer together."""
    led.off()
    buzzer.off()

def dot():
    """Send one dot."""
    signal_on()
    time.sleep(DOT_DURATION)
    signal_off()

def dash():
    """Send one dash."""
    signal_on()
    time.sleep(DASH_DURATION)
    signal_off()

def letter_s():
    """Send 'S' (...): three dots."""
    print('.', end='')
    dot()
    time.sleep(INTER_ELEMENT_GAP)
    print('.', end='')
    dot()
    time.sleep(INTER_ELEMENT_GAP)
    print('.', end='')
    dot()

def letter_o():
    """Send 'O' (---): three dashes."""
    print('-', end='')
    dash()
    time.sleep(INTER_ELEMENT_GAP)
    print('-', end='')
    dash()
    time.sleep(INTER_ELEMENT_GAP)
    print('-', end='')
    dash()

def play_sos():
    """Play one complete S-O-S sequence."""
    print("Sending S: ", end='')
    letter_s()
    print(" | ", end='')
    time.sleep(INTER_LETTER_GAP)

    print("Sending O: ", end='')
    letter_o()
    print(" | ", end='')
    time.sleep(INTER_LETTER_GAP)

    print("Sending S: ", end='')
    letter_s()
    print()
    print("SOS sequence sent.")

try:
    print("Program starting, preparing to send SOS signal. Press Ctrl+C to stop.")
    signal_off()  # make sure we start from a known-off state
    time.sleep(2)

    while True:
        play_sos()
        print(f"Waiting {INTER_WORD_GAP} seconds before repeating...\n")
        time.sleep(INTER_WORD_GAP)

except KeyboardInterrupt:
    print("\nProgram interrupted by user.")

finally:
    print("Turning off LED and buzzer...")
    signal_off()
    print("Devices safely shut down.")
```

## How It Works

**Parameterized timing:** every duration in the script derives from a single `DOT_DURATION` constant, following the standard ratios described above. Want to send Morse code faster or slower? Change that one number and everything else follows correctly.

**`signal_on()` / `signal_off()`:** small helpers that drive the LED and buzzer together, so every other function only has to think about "signal on" vs "signal off" rather than juggling two devices individually.

**`dot()` / `dash()`:** each turns the signal on for the appropriate duration, then off — always ending in the off state so the next element starts clean.

**`letter_s()` / `letter_o()`:** compose dots or dashes with the correct intra-letter gap between each element, building up the actual letters from the basic signal primitives.

**`play_sos()`:** strings the three letters together with the correct inter-letter gaps between them, playing the full S-O-S sequence once.

**Main loop and cleanup:** the `while True` loop replays the sequence indefinitely, pausing `INTER_WORD_GAP` between repeats. The `try`/`except KeyboardInterrupt`/`finally` structure means pressing `Ctrl+C` exits cleanly, and `finally` guarantees `signal_off()` runs regardless of how the program stops — so you never end up with a buzzer stuck beeping.

## Reference Links

* [Section 3: GPIO Digital Output/Input](../digital-io)
* [Morse code — Wikipedia](https://en.wikipedia.org/wiki/Morse_code)

