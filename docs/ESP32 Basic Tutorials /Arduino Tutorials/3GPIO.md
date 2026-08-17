---
sidebar_position: 3
title: Digital Input and Output
description: Learn how to control LEDs and read buttons using ESP32 GPIO pins.
---

# Section 3: Digital Input and Output

GPIO (General Purpose Input Output) pins are the most commonly used pins on an ESP32. They allow the microcontroller to interact with external devices such as LEDs, buttons, relays, sensors, and displays.

In this tutorial, you will learn:

- What digital signals are
- How to control an LED
- How to read a push button
- How to use internal pull-up resistors

---

# Understanding Digital Signals

A digital signal has only two possible states:

| State | Logic | Voltage (ESP32) |
|---------|---------|---------|
| HIGH | 1 | 3.3V |
| LOW | 0 | 0V |

Think of a room light switch:

- ON = HIGH
- OFF = LOW

The ESP32 uses these two states to communicate with external hardware.

---

# Digital Output

Digital output allows the ESP32 to send HIGH or LOW signals to external devices.

Common examples:

- Turning LEDs ON/OFF
- Controlling Relays
- Activating Buzzers
- Driving Logic Circuits

---

## LED Blink Example

### Connections

| ESP32 | LED |
|---------|---------|
| GPIO 2 | LED Anode (+) |
| GND | LED Cathode (-) |

Use a 220Ω to 330Ω resistor in series with the LED.

### Circuit

```text
GPIO2 ---- Resistor ---- LED ---- GND
```

---

## Code

```cpp
const int ledPin = 2;

void setup()
{
  pinMode(ledPin, OUTPUT);
}

void loop()
{
  digitalWrite(ledPin, HIGH);
  delay(1000);

  digitalWrite(ledPin, LOW);
  delay(1000);
}
```

---

## Code Explanation

### pinMode()

Configures the GPIO direction.

```cpp
pinMode(ledPin, OUTPUT);
```

The pin can now send voltage signals.

---

### digitalWrite()

Sets the output state.

```cpp
digitalWrite(ledPin, HIGH);
```

LED turns ON.

```cpp
digitalWrite(ledPin, LOW);
```

LED turns OFF.

---

### delay()

Pauses program execution.

```cpp
delay(1000);
```

Waits 1 second.

---

# Digital Input

Digital input allows the ESP32 to detect external signals.

Common examples:

- Push Buttons
- Switches
- PIR Sensors
- Limit Switches
- Reed Switches

---

## Push Button Example

### Connections

| ESP32 | Button |
|---------|---------|
| GPIO 4 | Button Pin |
| GND | Button Pin |

We will use the ESP32's internal pull-up resistor.

### Circuit

```text
GPIO4 ---- Button ---- GND
```

---

## Code

```cpp
const int buttonPin = 4;

void setup()
{
  Serial.begin(115200);

  pinMode(buttonPin, INPUT_PULLUP);
}

void loop()
{
  int state = digitalRead(buttonPin);

  if(state == LOW)
  {
    Serial.println("Button Pressed");
  }
  else
  {
    Serial.println("Button Released");
  }

  delay(200);
}
```

---

# Why Use INPUT_PULLUP?

Without a pull-up resistor, the GPIO pin may float between HIGH and LOW, causing unreliable readings.

Using:

```cpp
pinMode(buttonPin, INPUT_PULLUP);
```

enables an internal resistor inside the ESP32.

This keeps the pin HIGH when the button is not pressed.

| Button State | GPIO Reading |
|---------|---------|
| Released | HIGH |
| Pressed | LOW |

---

# Reading a Button and Controlling an LED

A practical example is turning an LED ON only when a button is pressed.

```cpp
const int ledPin = 2;
const int buttonPin = 4;

void setup()
{
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);
}

void loop()
{
  if(digitalRead(buttonPin) == LOW)
  {
    digitalWrite(ledPin, HIGH);
  }
  else
  {
    digitalWrite(ledPin, LOW);
  }
}
```

---

# Common GPIO Functions

## Set Pin Direction

```cpp
pinMode(pin, INPUT);
pinMode(pin, OUTPUT);
pinMode(pin, INPUT_PULLUP);
```

## Write Output

```cpp
digitalWrite(pin, HIGH);
digitalWrite(pin, LOW);
```

## Read Input

```cpp
digitalRead(pin);
```

---

# Practical Applications

Digital I/O is used in:

- LED Control
- Button Interfaces
- Relay Modules
- Door Sensors
- Motion Detectors
- Industrial Automation
- Smart Home Systems

---

# Summary

In this tutorial, you learned:

- What digital signals are
- How to use GPIO pins
- How to control an LED
- How to read a push button
- How INPUT_PULLUP works
- Basic digital input and output functions

In the next tutorial, we will learn how to read analog voltages using the ESP32 ADC.