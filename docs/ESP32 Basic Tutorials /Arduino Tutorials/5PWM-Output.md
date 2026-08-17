---
sidebar_position: 5
title: PWM (Pulse Width Modulation)
description: Learn how to generate PWM signals with the ESP32 to control LED brightness, motor speed, and more.
---

# Section 5: PWM (Pulse Width Modulation)

PWM (Pulse Width Modulation) is a technique used to simulate analog output using digital signals. It allows the ESP32 to control the brightness of LEDs, the speed of motors, the position of servos, and many other devices. :contentReference[oaicite:0]{index=0}

In this tutorial, you will learn:

- What PWM is
- How PWM works
- Duty Cycle and Frequency
- Generating PWM with ESP32
- Controlling LED Brightness
- PWM Applications

---

# What is PWM?

A GPIO pin can normally output only:

```text
HIGH (3.3V)
LOW (0V)
```

However, many devices require values between fully ON and fully OFF.

PWM solves this by rapidly switching a signal between HIGH and LOW states. By changing how long the signal stays HIGH during each cycle, we can control the average power delivered to a device. :contentReference[oaicite:1]{index=1}

---

# How PWM Works

A PWM signal has two important parameters:

## Frequency

Frequency indicates how many times a signal repeats every second.

Example:

```text
1000 Hz = 1000 cycles per second
```

---

## Duty Cycle

Duty Cycle is the percentage of time a signal remains HIGH during one cycle.

### 0% Duty Cycle

```text
LOW LOW LOW LOW
```

Output = OFF

---

### 25% Duty Cycle

```text
HIGH LOW LOW LOW
```

Output = Dim

---

### 50% Duty Cycle

```text
HIGH LOW HIGH LOW
```

Output = Medium Brightness

---

### 75% Duty Cycle

```text
HIGH HIGH HIGH LOW
```

Output = Bright

---

### 100% Duty Cycle

```text
HIGH HIGH HIGH HIGH
```

Output = Fully ON

---

# PWM on ESP32

The ESP32 contains dedicated hardware called **LEDC (LED Control)** for generating PWM signals. Depending on the ESP32 variant, multiple PWM channels can be generated independently. :contentReference[oaicite:2]{index=2}

PWM can be used with:

- LEDs
- Motors
- Buzzers
- Fans
- Servos
- Power Control Circuits

---

# LED Brightness Control

## Connections

| ESP32 | LED |
|---------|---------|
| GPIO 2 | LED Anode (+) |
| GND | LED Cathode (-) |

Use a 220Ω resistor in series with the LED.

---

# Basic PWM Example

```cpp
const int ledPin = 2;

void setup()
{
}

void loop()
{
  for(int brightness = 0; brightness <= 255; brightness++)
  {
    analogWrite(ledPin, brightness);
    delay(10);
  }

  for(int brightness = 255; brightness >= 0; brightness--)
  {
    analogWrite(ledPin, brightness);
    delay(10);
  }
}
```

---

# How the Code Works

The brightness value ranges from:

```text
0   = OFF
255 = Fully ON
```

Example:

```cpp
analogWrite(ledPin, 0);
```

LED OFF

```cpp
analogWrite(ledPin, 128);
```

Approximately 50% brightness

```cpp
analogWrite(ledPin, 255);
```

Maximum brightness

---

# Smooth LED Fade

The previous example gradually increases and decreases brightness, creating a fading effect.

```text
Dark
 ↓
Dim
 ↓
Bright
 ↓
Dim
 ↓
Dark
```

This is one of the most common PWM demonstrations. :contentReference[oaicite:3]{index=3}

---

# Using LEDC Functions

ESP32 also provides advanced PWM control through LEDC APIs.

Example:

```cpp
const int ledPin = 2;

void setup()
{
  ledcAttach(ledPin, 5000, 8);
}

void loop()
{
  ledcWrite(ledPin, 128);
}
```

Where:

```text
5000 = Frequency (Hz)
8    = Resolution (bits)
128  = Duty Cycle Value
```

LEDC functions provide more flexibility when working with motors, servos, and advanced control applications. :contentReference[oaicite:4]{index=4}

---

# Resolution

PWM resolution determines the number of available brightness levels.

### 8-bit Resolution

```text
0 - 255
```

256 levels

---

### 10-bit Resolution

```text
0 - 1023
```

1024 levels

---

### 12-bit Resolution

```text
0 - 4095
```

4096 levels

---

# Controlling a Buzzer

PWM can generate tones by changing frequency.

Example:

```cpp
ledcWriteTone(0, 1000);
```

Produces a tone near:

```text
1000 Hz
```

---

# Motor Speed Control

PWM is commonly used to control DC motor speed.

```text
Low Duty Cycle   → Slow Speed
Medium Duty Cycle → Medium Speed
High Duty Cycle  → High Speed
```

---

# Practical Applications

PWM is widely used in:

- LED Brightness Control
- RGB LED Strips
- DC Motor Speed Control
- Fan Speed Control
- Audio Tone Generation
- Servo Control
- Power Electronics

---

# PWM vs Digital Output

| Digital Output | PWM |
|---------------|------|
| ON/OFF Only | Variable Control |
| HIGH or LOW | Adjustable Duty Cycle |
| LED ON/OFF | LED Brightness Control |
| Motor Start/Stop | Motor Speed Control |

---

# Summary

In this tutorial, you learned:

- What PWM is
- What Duty Cycle means
- What Frequency means
- How ESP32 generates PWM signals
- How to control LED brightness
- How PWM controls motors and buzzers
- Basic PWM programming using Arduino

In the next tutorial, we will learn about Serial Communication (UART) and how devices exchange data with the ESP32.