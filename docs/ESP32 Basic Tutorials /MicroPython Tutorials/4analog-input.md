---
id: analog-input
title: ADC Analog Input
sidebar_label: ADC Analog Input
sidebar_position: 5
description: Understand analog signals and ADC resolution, then read a potentiometer's voltage in MicroPython, including basic noise filtering.
---

# Section 4: ADC Analog Input

This section covers what analog signals are and how ESP32's ADC turns them into numbers your code can use, then walks through reading a potentiometer and cleaning up the inevitable noise in that reading.

:::info

Make sure you've completed [**Section 1: Set Up Development Environment**](./getting-started) through [**Section 3: GPIO Digital Output/Input**](./digital-io) before starting this section.

:::

---

## 1. What an Analog Signal Is

Unlike a digital signal's two discrete states, an **analog signal** varies continuously across a range. A dimmer knob is a good mental model — brightness slides smoothly from off to full, through effectively infinite intermediate levels, rather than snapping between just "on" and "off."

Plenty of real-world quantities are naturally analog: temperature, light level, sound volume, and — relevant here — the wiper voltage on a potentiometer. None of that fits into a plain HIGH/LOW GPIO read, which is where the **ADC (Analog-to-Digital Converter)** comes in: it converts a continuous input voltage into a discrete number your program can work with.

Think of an ADC as a ruler laid across the voltage range (say, 0V to 3.3V), marked off into many small ticks. How many ticks it has is its **resolution** — more ticks means finer distinction between close voltage values.

ESP32's ADC is **12-bit**, giving 2¹² = **4096** possible levels, so readings range from **0 to 4095**:

- 0V in → roughly `0` out
- 3.3V in → roughly `4095` out
- everything in between scales proportionally

In MicroPython, `adc.read()` hands you that integer directly.

---

## 2. Which Pins Support ADC

Not every GPIO pin on an ESP32 chip can do analog input — only specific pins are wired to the ADC hardware, and it's worth favoring **ADC1** pins over ADC2 where you have the choice, since ADC2 shares hardware with Wi-Fi and can behave inconsistently while Wi-Fi is active.

| Chip | ADC1 (preferred) | ADC2 |
|---|---|---|
| ESP32 | GPIO32–GPIO39 | GPIO0, 2, 4, 12–15, 25–27 |
| ESP32-C3 | GPIO0–GPIO5 | — |
| ESP32-C6 | GPIO0–GPIO6 | — |
| ESP32-C5 | GPIO1–GPIO6 | — |
| ESP32-S3 | GPIO1–GPIO10 | GPIO11–GPIO20 |
| ESP32-P4 | GPIO16–GPIO23 | GPIO49–GPIO54 |

Check your specific chip's datasheet to confirm — exact pin ranges can shift between chip revisions.

---

## 3. Wire Up a Potentiometer

You'll need:

- 1x potentiometer
- 1x breadboard
- Jumper wires
- An ESP32-series board

Wire the potentiometer's outer two pins to 3.3V and GND, and the middle (wiper) pin to an ADC-capable GPIO — this tutorial uses GPIO7.

**How it works:** the potentiometer is a variable resistor. Turning the knob changes where along that resistance the wiper sits, which changes the wiper's output voltage smoothly between 0V (fully one direction) and 3.3V (fully the other).

---

## 4. Reading the Value

### 4.1 Try It in the REPL

```python
from machine import Pin, ADC
```

```python
pot = ADC(Pin(7))
```

```python
pot.read()        # raw reading, 0-4095, reflecting current knob position
```

```python
pot.read()         # try again after turning the knob
```

```python
pot.read_uv()       # calibrated voltage, in microvolts
```

### 4.2 Full Script

This version reads continuously and prints in a format Thonny's built-in plotter can visualize:

```python
import time
from machine import Pin, ADC

POT_PIN = 7
pot = ADC(Pin(POT_PIN))

while True:
    adc_value = pot.read()
    voltage_uv = pot.read_uv()
    voltage_mv = voltage_uv / 1000

    print("ADC:", adc_value, ",Voltage_mV:", voltage_mv)
    time.sleep(0.1)
```

Run it, then open **View → Plotter** in Thonny to see a live graph. Turning the potentiometer should move the curve in real time.

:::note

**Why doesn't the max reading line up exactly with 3.3V?** You may notice the reading saturates at 4095 before you'd expect, or gets non-linear near the extremes. ESP32's ADC hardware only handles a limited input range natively, so an internal attenuator extends it — and in MicroPython's default configuration, the reliably measurable ceiling is closer to roughly 3.1V rather than the full 3.3V rail. Past that, readings just clamp at 4095.

This is exactly why `read_uv()` is worth using over the raw `read()` value: it applies factory calibration data to give you a more accurate voltage figure, correcting for some of this non-linearity rather than requiring you to do a naive `(reading / 4095) * 3300` conversion yourself.

:::

**How the code works:**

- `ADC(Pin(POT_PIN))` creates an ADC object bound to the chosen pin.
- `pot.read()` returns the raw 0–4095 value.
- `pot.read_uv()` returns a calibrated voltage in microvolts — generally the better choice when you actually care about the voltage rather than the raw count.
- The `print(...)` format — labeled values separated by commas — is what lets Thonny's plotter recognize and graph multiple named data series at once.

---

## 5. Cleaning Up Noise

Even holding the potentiometer perfectly still, you'll likely see the reading jitter slightly rather than sitting on one fixed number, sometimes with the occasional spike. ESP32's ADC is fairly sensitive to power-supply noise and ambient electrical interference, so this is normal.

Two common ways to deal with it:

- **Hardware filtering** — add a small ceramic capacitor (around 0.1µF) between the ADC pin and GND, which smooths out high-frequency noise before it ever reaches the ADC.
- **Software filtering** — average multiple readings together in code. A simple and effective approach.

**Example: outlier-trimmed averaging**

This samples several times, discards the single highest and lowest readings (to reject spikes), then averages what's left:

```python
import time
from machine import Pin, ADC

POT_PIN = 7
pot = ADC(Pin(POT_PIN))

def read_average_adc(adc_obj, times=10):
    """
    Sample the ADC several times, drop the min and max, and average the rest.
    :param adc_obj: ADC object
    :param times: number of samples (default 10)
    :return: averaged integer reading
    """
    val_list = []
    for _ in range(times):
        val_list.append(adc_obj.read())
        time.sleep_ms(1)

    if len(val_list) > 2:
        val_list.remove(min(val_list))
        val_list.remove(max(val_list))

    return int(sum(val_list) / len(val_list))

while True:
    smooth_value = read_average_adc(pot, 20)
    print("Raw:", pot.read(), "Smooth:", smooth_value)
    time.sleep(0.1)
```

Running this alongside the raw reading, you should see the "Smooth" value noticeably steadier than "Raw" — fewer spikes, less jitter.

---

## 6. Reference Links

* [MicroPython ESP32 Quick Reference — ADC](https://docs.micropython.org/en/latest/esp32/quickref.html#adc-analog-to-digital-conversion)
* [MicroPython `machine.ADC` class reference](https://docs.micropython.org/en/latest/library/machine.ADC.html)
* [MicroPython `machine.ADCBlock` class reference](https://docs.micropython.org/en/latest/library/machine.ADCBlock.html)

---

## Next Step

You can now read continuously varying analog signals and clean up the noise that comes with them.

Continue to:

[**Section 5: PWM Output →**](./5pwm)