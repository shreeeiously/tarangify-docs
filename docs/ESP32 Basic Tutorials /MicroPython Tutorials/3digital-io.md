---
id: digital-io
title: GPIO Digital Output/Input
sidebar_label: PIO Digital Output/Input
sidebar_position: 4
description: Learn digital signal basics and control GPIO output and input in MicroPython by blinking an LED and reading a button.
---

# Section 3: GPIO Digital Output/Input

This section covers digital signals conceptually, then puts them into practice with two classic examples: blinking an external LED (digital output) and reading a button's state (digital input) — including handling button bounce along the way.

:::info

Make sure you've completed [**Section 1: Set Up Development Environment**](./getting-started) and [**Section 2: Basics**](./basic) before starting this section.

:::

---

## 1. What a Digital Signal Is

A **digital signal** represents information using discrete values, rather than a smoothly varying one. The simplest and most common form — and the one GPIO pins deal in — is **binary**: just two possible states.

Think of it like a light switch: at any given moment, a pin is in exactly one of two states.

- **HIGH** — logical "1" / "True". On an ESP32, this means the pin is at roughly 3.3V.
- **LOW** — logical "0" / "False". On an ESP32, this means the pin is at roughly 0V (tied to GND).

- **Output**: the board sets a pin HIGH or LOW to communicate outward — for example, turning an LED on or off.
- **Input**: the board reads whether a pin is currently HIGH or LOW — for example, checking whether a button is pressed.

:::note

Why 3.3V specifically? HIGH voltage tracks the chip's own operating voltage — ESP32 runs at 3.3V, so that's HIGH for ESP32. A 5V board like classic Arduino Uno treats 5V as HIGH; some ultra-low-power chips use 1.8V. It's chip-dependent, not a universal constant.

:::

---

## 2. Digital Output: Blinking an LED

### 2.1 Wire It Up

You'll need:

- 1x LED
- 1x 330Ω resistor
- 1x breadboard
- Jumper wires
- An ESP32-series board

Connect the LED's anode (long leg) through the resistor to a GPIO pin, and the cathode (short leg) to GND. This tutorial uses GPIO7 as the example pin — check your board's pinout if GPIO7 isn't available or suitable on your hardware.

**How the circuit works:** when the pin outputs HIGH, current flows from the pin, through the resistor, through the LED, and back to GND — completing the loop and lighting the LED. The resistor limits that current so it doesn't damage either the LED or the GPIO pin driving it. Wiring the LED backwards just means it won't light — it generally won't cause damage.

:::tip

Don't have exactly 330Ω? Anything from about 220Ω to 1kΩ works fine — a higher value just dims the LED somewhat.

:::

### 2.2 Try It in the REPL

Get a feel for the `Pin` API interactively before writing a full script. Type these one at a time in the Shell:

```python
from machine import Pin
```

```python
led = Pin(7, Pin.OUT)
```

```python
led.on()
```

```python
led.off()
```

```python
led.toggle()
```

```python
led.value(1)   # explicit high
```

```python
led.value(0)   # explicit low
```

```python
led.value()    # read back current state
```

### 2.3 Full Script: Blink

```python
import time
from machine import Pin

LED_PIN = 7
led = Pin(LED_PIN, Pin.OUT)

while True:
    led.value(1)      # on
    time.sleep(1)
    led.value(0)      # off
    time.sleep(1)
```

Running this blinks the LED on a steady 1-second-on, 1-second-off cycle.

**How it works:**

- `from machine import Pin` pulls in the class used for all GPIO control.
- `Pin(LED_PIN, Pin.OUT)` creates a `Pin` object bound to GPIO7, configured for output.
- `led.value(1)` / `led.value(0)` drive the pin high or low (`led.on()` / `led.off()` do the same thing, if you prefer the more readable form).
- `time.sleep(1)` blocks for a second between toggles — simple and sufficient for a basic blink loop.

---

## 3. Digital Input: Reading a Button

### 3.1 Wire It Up

You'll need:

- 1x pushbutton
- 1x breadboard
- Jumper wires
- An ESP32-series board
- Optionally, a 10kΩ resistor (not needed if you use the internal pull-up)

:::note

**Why does a button need a pull-up?** If a pin isn't tied to either power or ground when the button is open, it "floats" — its read value becomes unpredictable. A pull-up resistor guarantees the pin reads a defined HIGH whenever the button isn't pressed.

:::

**Using the internal pull-up (recommended):** wire one leg of the button to GPIO8, the other to GND. The chip's own internal pull-up holds GPIO8 high; pressing the button pulls it to GND (low). In code: `Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)`. No extra components needed.

**Using an external pull-up:** same button wiring, plus a 10kΩ resistor between GPIO8 and 3.3V. Same electrical behavior — high when unpressed, low when pressed — but you control the exact pull-up current. In code, this just needs `Pin(BUTTON_PIN, Pin.IN)` since the pull-up is external.

### 3.2 Try It in the REPL

```python
from machine import Pin
button = Pin(8, Pin.IN, Pin.PULL_UP)
```

With the button **released**, run:

```python
button.value()
```

You should see `1` — the pull-up holds the pin high when nothing's pressing it low.

Now **hold the button down** and run `button.value()` again — this time you should see `0`, since pressing it grounds the pin.

### 3.3 Full Scripts

**Example 1 — just print the button state:**

```python
import time
from machine import Pin

BUTTON_PIN = 8
button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)

while True:
    button_state = button.value()
    print(button_state)
    time.sleep_ms(20)   # small delay so output isn't overwhelming
```

Watch the Shell: it prints `1` continuously while the button is untouched, and `0` while it's held down.

**Example 2 — count button presses (naive version):**

```python
import time
from machine import Pin

BUTTON_PIN = 8
button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)

last_button_state = 1
count = 0

while True:
    current_button_state = button.value()

    if last_button_state == 1 and current_button_state == 0:
        # falling edge: button was just pressed
        pass
    elif last_button_state == 0 and current_button_state == 1:
        # rising edge: button was just released
        count += 1
        print(count)

    last_button_state = current_button_state
```

This counts on the **rising edge** — the moment the button goes from pressed back to released, which lines up with how people intuitively think of "a click." Note the state-tracking pattern: comparing `current_button_state` against `last_button_state` each loop, then updating `last_button_state` at the end so the next iteration has fresh history to compare against.

Run this and press the button a few times — you may notice the counter occasionally jumping by 2 or 3 on a single press. That's **button bounce**: a mechanical switch's contacts physically vibrate for a few milliseconds when pressed or released, rapidly connecting and disconnecting several times. Since the loop runs far faster than that bounce settles, it can register several transitions from what felt like one press.

**Example 3 — same thing, with basic debouncing:**

```python
import time
from machine import Pin

BUTTON_PIN = 8
button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)

last_button_state = 1
count = 0

while True:
    current_button_state = button.value()

    if last_button_state == 1 and current_button_state == 0:
        pass
    elif last_button_state == 0 and current_button_state == 1:
        count += 1
        print(count)
        time.sleep_ms(100)   # debounce delay

    last_button_state = current_button_state
```

Adding `time.sleep_ms(100)` right after registering a press gives the mechanical bounce time to settle before the loop starts checking again, so each real press reliably counts once. The tradeoff is that the program is fully blocked for that 100ms — fine for a simple button demo, less fine if you need to keep doing other things during that window.

---

## 4. Practice Exercises

**Exercise 1: LED follows the button** — LED on while held, off while released.

```python
import time
from machine import Pin

LED_PIN = 7
BUTTON_PIN = 8

led = Pin(LED_PIN, Pin.OUT)
button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)

while True:
    button_state = button.value()

    if button_state == 0:
        led.value(1)
    else:
        led.value(0)

    time.sleep_ms(10)
```

**Exercise 2: One press toggles the LED** — each release flips the LED's state rather than following the button directly.

```python
import time
from machine import Pin

LED_PIN = 7
BUTTON_PIN = 8

led = Pin(LED_PIN, Pin.OUT)
button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)

last_button_state = 1
led_state = 0

while True:
    current_button_state = button.value()

    if last_button_state == 0 and current_button_state == 1:
        led_state = not led_state
        led.value(led_state)
        time.sleep_ms(100)   # debounce

    last_button_state = current_button_state
    time.sleep_ms(10)
```

---

## 5. Reference Links

* [MicroPython ESP32 Quick Reference — Pins and GPIO](https://docs.micropython.org/en/latest/esp32/quickref.html#pins-and-gpio)
* [MicroPython `machine.Pin` class reference](https://docs.micropython.org/en/latest/library/machine.Pin.html)
* [MicroPython `time.sleep` reference](https://docs.micropython.org/en/latest/library/time.html#time.sleep)

