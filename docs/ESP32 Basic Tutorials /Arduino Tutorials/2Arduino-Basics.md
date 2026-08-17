---
sidebar_position: 2
title: Arduino Basics
description: Learn the fundamentals of Arduino programming for ESP32 development.
---

# Section 2: Arduino Basics

In this tutorial, you will learn the basic structure of an Arduino program and upload your first sketch to an ESP32 board.

## What is Arduino?

Arduino is an open-source development platform that allows you to program microcontrollers using a simplified C/C++ language.

With Arduino and ESP32, you can create projects involving:

- LEDs
- Sensors
- Displays
- Motors
- Wi-Fi Applications
- Bluetooth Applications
- IoT Devices

---

## Understanding an Arduino Sketch

Every Arduino program is called a **Sketch**.

A sketch contains two main functions:

```cpp
void setup()
{

}

void loop()
{

}
```

### setup()

The `setup()` function runs only once when the ESP32 starts.

It is commonly used to:

- Initialize Serial Communication
- Configure GPIO Pins
- Initialize Sensors
- Initialize Displays

### loop()

The `loop()` function runs continuously after `setup()` finishes.

This is where your main application logic executes.

---

## Your First Program

Let's print a message to the Serial Monitor.

```cpp
void setup()
{
  Serial.begin(115200);

  Serial.println("Hello Tarangify!");
}

void loop()
{

}
```

### Code Explanation

#### Serial.begin(115200)

Starts serial communication between the ESP32 and your computer.

```cpp
Serial.begin(115200);
```

115200 is the communication speed (baud rate).

#### Serial.println()

Sends text to the Serial Monitor.

```cpp
Serial.println("Hello Tarangify!");
```

---

## Uploading the Program

1. Connect the ESP32 board.
2. Open Arduino IDE.
3. Select the correct board.
4. Select the COM Port.
5. Click **Upload**.

After uploading:

1. Open **Serial Monitor**.
2. Set baud rate to **115200**.

Output:

```text
Hello Tarangify!
```

---

## Repeating Messages

To continuously print text, place the command inside `loop()`.

```cpp
void setup()
{
  Serial.begin(115200);
}

void loop()
{
  Serial.println("Hello Tarangify!");

  delay(1000);
}
```

Output:

```text
Hello Tarangify!
Hello Tarangify!
Hello Tarangify!
```

The message appears every second.

---

## Understanding delay()

The delay function pauses program execution.

```cpp
delay(1000);
```

Common values:

| Value | Time |
|---------|---------|
| 100 | 0.1 Second |
| 500 | 0.5 Second |
| 1000 | 1 Second |
| 2000 | 2 Seconds |

---

## Common Arduino Functions

### pinMode()

Configures a pin as input or output.

```cpp
pinMode(2, OUTPUT);
```

### digitalWrite()

Sets a pin HIGH or LOW.

```cpp
digitalWrite(2, HIGH);
```

### digitalRead()

Reads the state of a digital pin.

```cpp
int state = digitalRead(4);
```

### analogRead()

Reads analog voltage values.

```cpp
int value = analogRead(3);
```

---

## Arduino Program Flow

```text
Power ON
    │
    ▼
setup()
    │
    ▼
loop()
    │
    ▼
loop()
    │
    ▼
loop()
    │
    ▼
Forever
```

---

## Summary

In this tutorial, you learned:

- What Arduino is
- What a Sketch is
- The purpose of setup()
- The purpose of loop()
- Serial Communication
- delay()
- Basic Arduino functions

In the next tutorial, we will learn how to control GPIO pins using Digital Input and Output.