---
id: uart-communication
title: UART Communication
sidebar_label: UART Communication
sidebar_position: 7
description: Understand UART serial communication and use MicroPython's UART class for computer-to-board control and board-to-board messaging.
---

# Section 6: UART Communication

This section covers how UART serial communication works, then puts it into practice two ways: controlling an LED straight from the REPL, and passing button-press events between two separate ESP32 boards over a hardware UART link.

:::info

Make sure you've completed [**Section 1: Set Up Development Environment**](./getting-started) through [**Section 5: PWM Output**](./pwm) before starting this section.

:::

---

## 1. What UART Is

**UART (Universal Asynchronous Receiver/Transmitter)** is a hardware interface for asynchronous serial communication — the workhorse behind things like talking to sensor modules, and the same link Thonny uses to show REPL output over USB.

A few defining characteristics:

- **Asynchronous** — the two sides don't share a clock signal. Instead, they agree in advance on a transmission speed and stick to it.
- **Serial** — data goes bit by bit down a single wire, rather than many bits in parallel.
- **Full-duplex** — both sides can send and receive at the same time, independently.

### 1.1 Baud Rate

Since there's no shared clock, both ends need to agree on the **baud rate** — bits transmitted per second — ahead of time, or the receiving side won't be able to correctly interpret the incoming bits. Common values are 9600 and 115200; whatever you pick, both sides must match exactly.

### 1.2 Frame Format

Each UART data frame is built from:

- **Start bit** — always `0`, signals the beginning of a byte.
- **Data bits** — typically 8, carrying the actual byte of data.
- **Parity bit (optional)** — for basic error detection.
- **Stop bit(s)** — always `1`, signals the end of the byte.

### 1.3 Wiring

UART needs two signal lines plus a shared ground:

- **TX (Transmit)**
- **RX (Receive)**
- **GND** — a common reference point so both sides interpret voltage levels the same way.

The key wiring rule: connections cross over. Device A's TX goes to Device B's RX, and Device A's RX goes to Device B's TX — the same way you'd need two people's "speak" and "listen" roles to line up for a conversation to work.

---

## 2. UART on ESP32

ESP32 chips typically expose several hardware UART controllers (commonly UART0, UART1, UART2). In MicroPython, all of them are accessed through the `machine.UART` class.

- **UART0** is usually claimed by the REPL console — the same connection Thonny uses when you plug in over USB.
- **UART1** and **UART2** are free for your own use, connecting to external devices.

---

## 3. Example 1: Controlling an LED From the REPL

The simplest possible serial-communication demo: type commands on your computer, and the board reacts. Since the REPL itself runs over UART0, you don't need any extra wiring for the communication link — just Thonny's Shell, doubling as a basic serial terminal.

### 3.1 Wire Up an LED

Same wiring as [Section 3](./digital-io#21-wire-it-up) — LED anode through a 330Ω resistor to GPIO7, cathode to GND.

### 3.2 Code

```python
from machine import Pin

LED_PIN = 7
led = Pin(LED_PIN, Pin.OUT)

print("System Ready. Please enter 'on' or 'off':")

while True:
    # input() blocks here until the user types a line and presses Enter -
    # the simplest way to receive a command over the REPL's serial link.
    command = input()

    if command == "on":
        led.value(1)
        print("LED is ON")
    elif command == "off":
        led.value(0)
        print("LED is OFF")
    else:
        print("Unknown command. Please enter 'on' or 'off'.")
```

**How it works:** `input()` is a standard Python built-in that, in this context, reads a line from the REPL's underlying serial connection — pausing execution until the user actually sends something. From there it's just a simple string comparison driving the GPIO output, with `print()` echoing feedback back over that same serial link.

### 3.3 Try It

Run the script, then type `on` and press Enter in the Shell — the LED should light, and you'll see `LED is ON` printed back. Type `off` to reverse it.

---

## 4. Example 2: UART Communication Between Two Boards

This example goes further: two separate ESP32 boards talking to each other over a dedicated hardware UART link, rather than through a computer. One board (the transmitter) watches a button; the other (the receiver) drives an LED based on what it hears.

### 4.1 Wire It Up

You'll need:

- 1x LED
- 1x 330Ω resistor
- 2x breadboard
- 1x pushbutton
- Jumper wires
- 2x ESP32-series boards

| Transmitter (Board A) | Receiver (Board B) | Note |
|---|---|---|
| GPIO11 (RX) | GPIO2 (TX) | data flows B → A |
| GPIO12 (TX) | GPIO1 (RX) | data flows A → B |
| GND | GND | must be shared for stable signal levels |

Wire the button to Board A the same way as in [Section 3](./digital-io#31-wire-it-up), and the LED to Board B the same way as in [Section 3](./digital-io#21-wire-it-up).

### 4.2 Transmitter Code (Board A)

Save and run this on the board with the button attached:

```python
import time
from machine import Pin, UART

BUTTON_PIN = 7
TX_PIN = 12
RX_PIN = 11

# baudrate must match the receiver; tx/rx set which pins UART1 uses
uart = UART(1, baudrate=9600, tx=TX_PIN, rx=RX_PIN)

button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)
last_button_state = 1  # pull-up defaults high

print("Sender Ready. Press the button.")

while True:
    current_button_state = button.value()

    if current_button_state != last_button_state:
        if current_button_state == 0:
            uart.write('1')
            print("Sent: 1 (Button Pressed)")
        else:
            uart.write('0')
            print("Sent: 0 (Button Released)")

        last_button_state = current_button_state
        time.sleep_ms(50)  # basic debounce
```

### 4.3 Receiver Code (Board B)

Save and run this on the board with the LED attached:

```python
import time
from machine import Pin, UART

LED_PIN = 7
RX_PIN = 1
TX_PIN = 2

# receiver's RX wires to transmitter's TX and vice versa - see wiring table above
uart = UART(1, baudrate=9600, tx=TX_PIN, rx=RX_PIN)

led = Pin(LED_PIN, Pin.OUT)

print("Receiver Ready. Waiting for commands...")

while True:
    if uart.any():
        command = uart.read(1)

        # read() returns a bytes object, so compare against b'1' / b'0', not '1' / '0'
        if command == b'1':
            led.value(1)
            print("Received: 1 -> LED ON")
        elif command == b'0':
            led.value(0)
            print("Received: 0 -> LED OFF")

    time.sleep_ms(10)  # keep CPU usage reasonable while polling
```

### 4.4 How It Works

**`UART(id, baudrate, tx, rx)`** — `id` picks which hardware UART to use (1 or 2 here, since 0 is generally tied up by the REPL); `baudrate` must match on both ends; `tx`/`rx` set which GPIOs carry the signal.

**On the transmitter:** `uart.write(data)` sends a string or bytes object out over the link. The code only sends when the button's state actually changes — comparing `current_button_state` against `last_button_state` — so it's not spamming the same value every loop iteration.

**On the receiver:** `uart.any()` is a non-blocking check for whether unread data is sitting in the receive buffer, returning how many bytes are waiting. `uart.read(n)` pulls `n` bytes out of that buffer. The key gotcha: MicroPython's `read()` always returns a `bytes` object, so comparisons need to use byte-string literals like `b'1'`, not plain strings.

### 4.5 Running Both Boards

You'll need both boards running their scripts at the same time. Two ways to manage that:

- **Save each as `main.py`** on its respective board (see [Section 2](./basic#4-example-making-a-script-auto-run) for how). Each board then runs its script automatically on power-up, with no computer needed.

  :::note
  If Thonny is actively connected to a board, connecting can interrupt a running `main.py`. If that happens, press `Ctrl + D` in the Shell for a soft reset, or unplug and re-power the board after closing Thonny.
  :::

- **Or run both from Thonny directly** — open two separate Thonny windows, connect each to a different board's port, and press Run in each. By default, Thonny only allows one window at a time; enable multiple instances via **Tools → Options → General**, unchecking "Allow only one Thonny instance."

### 4.6 Try It

Press the button on Board A — Board B's LED should light up. Board A's Shell logs `Sent: 1`, and Board B's Shell logs `Received: 1`. Release the button and the LED turns back off.

---

## 5. Reference Links

* [MicroPython ESP32 Quick Reference — UART](https://docs.micropython.org/en/latest/esp32/quickref.html#uart-serial-bus)
* [MicroPython `machine.UART` class reference](https://docs.micropython.org/en/latest/library/machine.UART.html)

