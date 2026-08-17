---
id: pwm
title: PWM Output
sidebar_label: PWM Output
sidebar_position: 6
description: Understand Pulse Width Modulation and use MicroPython's PWM class to dim an LED, including a breathing-light effect and potentiometer control.
---

# Section 5: PWM Output

This section covers what PWM is and how ESP32 generates it, then puts it to work: dimming an LED, building a smooth "breathing light" fade, and finally tying LED brightness to a potentiometer.

:::info

Make sure you've completed [**Section 1: Set Up Development Environment**](./getting-started) through [**Section 4: ADC Analog Input**](./analog-input) before starting this section.

:::

---

## 1. What PWM Is

**PWM (Pulse Width Modulation)** is a technique for approximating a variable analog output using a purely digital signal.

Rather than truly varying voltage smoothly, a PWM signal stays a simple HIGH/LOW digital signal — it just switches between the two very rapidly, and controls the *proportion* of time spent HIGH versus LOW within each cycle. To anything downstream that can't react as fast as the switching (an LED, a motor, your eye), the effect looks like a genuinely variable voltage.

Two parameters define a PWM signal:

- **Duty cycle** — the percentage of each cycle spent HIGH. This is what determines the effective average voltage:

  | Duty cycle | Effective average voltage (on a 3.3V signal) |
  |---|---|
  | 0% | ≈ 0V |
  | 25% | ≈ 0.825V |
  | 50% | ≈ 1.65V |
  | 75% | ≈ 2.475V |
  | 100% | ≈ 3.3V |

- **Frequency** — how many full cycles happen per second (Hz). The right frequency depends on the application: LED dimming needs a frequency high enough that human eyes can't perceive the flicker, while motor control cares more about efficiency and audible noise.

---

## 2. How ESP32 Generates PWM

ESP32 chips include a dedicated **LEDC (LED Control)** peripheral for generating PWM signals in hardware. Despite the name, it's a general-purpose PWM generator, not limited to driving LEDs — chip models offer anywhere from 6 to 16 independent channels, spanning a frequency range from 1Hz up to 40MHz.

In MicroPython, this is all wrapped up behind the `machine.PWM` class, so you don't need to touch LEDC directly.

---

## 3. Wire Up an LED

You'll need:

- 1x LED
- 1x 330Ω resistor
- 1x breadboard
- Jumper wires
- An ESP32-series board

Same wiring as the [digital output example](./digital-io#21-wire-it-up) — LED anode through the resistor to a GPIO pin, cathode to GND. This tutorial uses GPIO7.

---

## 4. Explore PWM in the REPL

**Create a PWM object:**

```python
from machine import Pin, PWM

led_pwm = PWM(Pin(7))
```

Check its default settings:

```python
print(led_pwm)
```

A freshly created PWM object defaults to a 5000Hz frequency and a duty cycle of `32768` — right around 50%. You can also read these individually with `led_pwm.freq()` and `led_pwm.duty_u16()`.

**Change the frequency:**

```python
led_pwm.freq(10)
```

At 10Hz, the LED visibly flickers — slow enough for your eye to catch each cycle.

```python
led_pwm.freq(5000)
```

Back at 5000Hz, the flicker is far too fast to perceive, so the LED just looks like it's glowing at a steady brightness — this is the persistence-of-vision effect that makes PWM dimming work.

**Set brightness via `duty_u16()`** (range: 0–65535):

```python
led_pwm.duty_u16(65535)   # full brightness
led_pwm.duty_u16(1000)    # dim
led_pwm.duty_u16(0)       # off
```

**Or via `duty()`** (range: 0–1023, an older/alternate API):

```python
led_pwm.duty(1023)   # full brightness
led_pwm.duty(512)    # roughly half
led_pwm.duty(0)      # off
```

---

## 5. Example: LED Breathing Light

This fades the LED smoothly up to full brightness and back down, on repeat — the classic "breathing" effect.

```python
import time
from machine import Pin, PWM

# 5000 Hz is a sufficiently smooth frequency for LED dimming
FREQUENCY = 5000

LED_PIN = 7

led_pwm = PWM(Pin(LED_PIN), freq=FREQUENCY, duty_u16=0)

while True:
    # fade in
    for duty in range(0, 65536, 1000):
        led_pwm.duty_u16(duty)
        time.sleep_ms(10)

    # fade out
    for duty in range(65535, -1, -1000):
        led_pwm.duty_u16(duty)
        time.sleep_ms(10)
```

**How it works:**

- `PWM(Pin(LED_PIN))` creates the PWM object; MicroPython picks an available LEDC channel for you automatically — no manual channel management needed.
- `duty_u16(value)` is the main brightness control. The `u16` refers to a 16-bit unsigned integer range (0–65535); MicroPython automatically rescales that down to whatever resolution the underlying LEDC hardware actually uses (commonly 13- or 14-bit), so you never have to think about the hardware's native resolution.
- Stepping `duty` through a `range()` with a small `time.sleep_ms()` between each step produces the smooth fade. A larger step size or shorter delay speeds up the breathing rhythm; a smaller step or longer delay slows it down.

---

## 6. Extension: Potentiometer-Controlled Brightness

A natural next step: tie LED brightness directly to a potentiometer's position, so turning the knob dims or brightens the LED in real time.

Wire up both an LED (as above) and a potentiometer (as in [Section 4](./analog-input#3-wire-up-a-potentiometer)) — this example uses GPIO7 for the LED and GPIO8 for the potentiometer.

```python
import time
from machine import Pin, PWM, ADC

FREQUENCY = 5000

LED_PIN = 7
POT_PIN = 8

led_pwm = PWM(Pin(LED_PIN), freq=FREQUENCY, duty_u16=0)
pot = ADC(Pin(POT_PIN))

while True:
    # read_u16() returns a 16-bit value (0-65535), matching duty_u16()'s range
    pot_value = pot.read_u16()

    led_pwm.duty_u16(pot_value)

    time.sleep_ms(20)
```

**How it works:** this leans on a nice bit of consistency in MicroPython's design — `ADC.read_u16()` and `PWM.duty_u16()` both use the same 0–65535 scale, regardless of what resolution the underlying ADC or PWM hardware actually has. That means the ADC reading can be handed straight to the PWM duty cycle with no manual rescaling math at all.

---

## 7. Reference Links

* [MicroPython ESP32 Quick Reference — PWM](https://docs.micropython.org/en/latest/esp32/quickref.html#pwm-pulse-width-modulation)
* [MicroPython ESP32 PWM Tutorial](https://docs.micropython.org/en/latest/esp32/tutorial/pwm.html#esp32-pwm)
* [MicroPython `machine.PWM` class reference](https://docs.micropython.org/en/latest/library/machine.PWM.html)

