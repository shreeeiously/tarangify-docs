---
id: micropython-basic
title: Basics
sidebar_label: Basics
sidebar_position: 3
description: Get comfortable with the Thonny IDE — file management, REPL vs script execution, ESP32's boot sequence, and MicroPython's core built-in modules.
---

# Section 2: Basics

This section builds your day-to-day fluency with the Thonny IDE and MicroPython on ESP32: moving files between your computer and the board, the two ways to run code, how the board decides what to run at boot, and a tour of the built-in modules you'll use constantly.

:::info

Make sure you've completed [**Section 1: Set Up Development Environment**](./getting-started) before starting this section.

:::

---

## 1. Thonny's File View

Embedded development means juggling files in two places — your computer and the board's own flash storage. Thonny's file view handles that.

1. Open it via **View → Files** in the menu bar.
2. The sidebar splits into two panels:
   - **Top: Local files** — your computer's filesystem.
   - **Bottom: MicroPython device** — files stored on the ESP32 itself.

:::note

A freshly flashed board usually already has one file present: `boot.py`, a system-generated startup script.

:::

---

## 2. Two Ways to Run Code

MicroPython gives you two distinct workflows: typing commands interactively, or writing and running full scripts.

### 2.1 Interactive Execution (REPL)

Type code directly into Thonny's **Shell** panel at the bottom, and it runs the instant you hit Enter.

This is great for quick checks — testing a one-liner, inspecting a variable, probing which I2C devices are on a bus — but nothing you type here is saved. Power-cycle or reset the board and it's gone.

Try this directly in the Shell:

```python
import sys
import machine

freq = machine.freq() / 1000000
print(f"Device Info: {sys.platform}\nCPU Freq: {freq} MHz")
```

You'll see the board's platform name and CPU clock speed printed back immediately.

### 2.2 Script Execution

For anything beyond a quick test, write real files in Thonny's editor pane, then run them on the board.

1. **Write the code.** Try something with a loop, since that's the more realistic case:

```python
import sys
import machine
import time

freq = machine.freq() / 1000000
print(f"Device Info: {sys.platform}\nCPU Freq: {freq} MHz")

count = 0

while True:
    print(f"Hello World! {count}")
    count += 1
    time.sleep(1)
```

2. **Run it** with the green Run button (or `F5`).
3. **Watch the output** stream into the Shell below.

:::note

Because this script loops forever, the Shell stays busy running it — you won't be able to save files or do anything else until you stop it. Click the red Stop button, or press `Ctrl + C` in the Shell.

:::

Forcibly stopping the script this way raises a `KeyboardInterrupt`, which is harmless but shows up as an error in the Shell. If you'd rather handle that cleanly, wrap the loop in a `try`/`except`:

```python
import sys
import machine
import time

freq = machine.freq() / 1000000
print(f"Device Info: {sys.platform}\nCPU Freq: {freq} MHz")

count = 0

try:
    while True:
        print(f"Hello World! {count}")
        count += 1
        time.sleep(1)
except KeyboardInterrupt:
    print("Exit")
```

4. **Save it to the board.** Stop the script, then save (`Ctrl + S`), choose **MicroPython device** as the destination, and give it a name — for example `test_print.py`. It'll now show up under the device panel in the file view.

---

## 3. How ESP32 Decides What Runs at Boot

Saving a script to the board doesn't automatically make it run when you unplug and re-power the device — MicroPython follows a specific boot sequence.

### 3.1 `boot.py`

Runs first, immediately after the system starts. It's meant for low-level setup — things like configuring the USB mode or bringing up a network connection. As a beginner, it's best left at its default contents; editing it carelessly can prevent the board from starting up cleanly.

### 3.2 `main.py`

Runs next, right after `boot.py` finishes. This is where your actual application code belongs.

:::note

Only a file specifically named `main.py` runs automatically on power-up. A script saved under any other name — like `test_print.py` from the earlier example — just sits there as a regular file until you run it manually.

:::

### 3.3 Falling Back to the REPL

If there's no `main.py`, or once `main.py` finishes running, MicroPython drops into the interactive REPL. Any global variables set in `boot.py` or `main.py` remain accessible there, and the REPL stays active until the next hard or soft reset.

---

## 4. Example: Making a Script Auto-Run

To have a program start automatically when the board is powered on its own (no computer attached), it needs to be saved specifically as `main.py`.

1. Open the `test_print.py` file you saved earlier from the MicroPython device panel.
2. Use **File → Save copy**, choose **MicroPython device** as the destination, and name the file `main.py`.
3. In the Shell, press `Ctrl + D` to trigger a soft reset and check that `main.py` runs automatically.

:::note

**Why `Ctrl + D`?** When Thonny connects to a board, it interrupts whatever's currently running so it can drop into the REPL — meaning even a `main.py` that ran fine on power-up gets stopped the moment Thonny attaches, with no visible output. A soft reset (`Ctrl + D`) restarts the MicroPython interpreter while keeping Thonny connected, so you get to watch `main.py`'s startup output in the Shell.

:::

---

## 5. Uploading Extra Files

Once you start using external libraries — a driver for an OLED display, a sensor library, and so on — you'll need to get those `.py` files onto the board too.

1. Find the file (for example `ssd1327.py`) in the local files panel.
2. Right-click it and choose **Upload to /**.
3. It's now on the board's filesystem, and importable in your code with `import ssd1327`.

---

## 6. Commonly Used Built-In Modules

MicroPython on ESP32 ships with a set of hardware-facing modules you'll reach for constantly.

### 6.1 `machine`

The core module for touching hardware directly:

- `machine.Pin` — GPIO input/output
- `machine.ADC` — reading analog signals
- `machine.PWM` — PWM output
- `machine.UART` — serial communication
- `machine.I2C` — I2C bus
- `machine.SPI` — SPI bus
- `machine.Timer` — hardware/software timers
- `machine.RTC` — real-time clock

For example, to check the CPU clock speed from the REPL:

```python
import machine
print(machine.freq())
```

### 6.2 `time`

Handles delays and elapsed-time tracking (some firmware builds expose this as `utime` instead):

```python
import time

time.sleep(1)        # delay 1 second
time.sleep_ms(500)    # delay 500 ms
time.sleep_us(100)    # delay 100 µs
print(time.ticks_ms())  # ms elapsed since boot
```

### 6.3 `network` and `bluetooth`

These configure Wi-Fi and Bluetooth respectively. You can browse what each exposes with:

```python
import network, bluetooth
help(network)
help(bluetooth)
```

### 6.4 Exploring What's Available

Exactly which modules and functions are available can vary a bit by firmware version and chip. A few ways to check on your specific setup:

**List every built-in module:**

```python
help('modules')
```

**List a module's contents:**

```python
import machine
dir(machine)
```

**Get a quick description of something specific:**

```python
import machine
help(machine.Pin)
```

:::note

`help()` gives a short summary, not the full API. For complete details, check the [MicroPython documentation](https://docs.micropython.org/en/latest/index.html).

:::

---

## 7. Reference Links

* [MicroPython core library reference](https://docs.micropython.org/en/latest/library/index.html)
* [MicroPython ESP32 quick reference](https://docs.micropython.org/en/latest/esp32/quickref.html)
* [MicroPython REPL reference](https://docs.micropython.org/en/latest/reference/repl.html)
* [MicroPython boot process reference](https://docs.micropython.org/en/latest/reference/reset_boot.html)

---

## Next Step

You're now comfortable moving between the REPL and saved scripts, and you understand how the board decides what runs on boot.

Continue to:

[**Section 3: GPIO Digital Output/Input →**](./3digital-io)