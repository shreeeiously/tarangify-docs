---
sidebar_position: 6
title: UART Communication
description: Learn how to use UART serial communication on ESP32 for debugging and device-to-device communication.
---

# Section 6: UART Communication

UART (Universal Asynchronous Receiver/Transmitter) is one of the most widely used communication interfaces in embedded systems. It allows two devices to exchange data using only two signal lines: TX (Transmit) and RX (Receive). UART is commonly used for debugging, communication with sensors and modules, and data exchange between microcontrollers. :contentReference[oaicite:0]{index=0}

In this tutorial, you will learn:

- What UART is
- How UART communication works
- Baud Rate and Data Frames
- Using Serial Monitor
- Sending and Receiving Data
- Communication Between Two ESP32 Boards

---

# What is UART?

UART stands for:

```text
Universal Asynchronous Receiver/Transmitter
```

UART is an asynchronous serial communication protocol, meaning that devices do not share a clock signal. Instead, both devices agree on the same communication speed (baud rate). :contentReference[oaicite:1]{index=1}

---

# UART Communication Lines

UART requires three connections:

| Signal | Function |
|----------|----------|
| TX | Transmit Data |
| RX | Receive Data |
| GND | Common Ground |

Connection rule:

```text
Device A TX → Device B RX
Device A RX → Device B TX
Device A GND → Device B GND
```

The TX and RX lines must always be crossed between devices. :contentReference[oaicite:2]{index=2}

---

# UART Features

UART communication provides:

- Asynchronous Communication
- Serial Data Transfer
- Full Duplex Communication
- Simple Wiring
- Reliable Short-Distance Communication

UART can send and receive data simultaneously. :contentReference[oaicite:3]{index=3}

---

# Understanding Baud Rate

Baud Rate defines the communication speed.

Common values:

```text
9600
19200
38400
57600
115200
```

Example:

```text
115200 baud
```

means approximately:

```text
115200 bits per second
```

Both devices must use the same baud rate for proper communication. :contentReference[oaicite:4]{index=4}

---

# UART Data Frame

A UART transmission consists of:

```text
Start Bit
Data Bits
Parity Bit (Optional)
Stop Bit
```

Typical configuration:

```text
8 Data Bits
No Parity
1 Stop Bit
```

Often written as:

```text
8N1
```

This is the default UART configuration used in most Arduino projects. :contentReference[oaicite:5]{index=5}

---

# UART on ESP32

ESP32 contains multiple hardware UART controllers.

Commonly used interfaces:

| UART | Arduino Object |
|--------|--------|
| UART0 | Serial |
| UART1 | Serial1 |
| UART2 | Serial2 (Board Dependent) |

The default `Serial` interface is typically used for:

- Serial Monitor
- Debug Messages
- Program Status Information

Additional UART ports can communicate with external devices without affecting debugging. :contentReference[oaicite:6]{index=6}

---

# Example 1: Serial Monitor Output

The simplest UART application is sending messages to the Arduino IDE Serial Monitor.

```cpp
void setup()
{
  Serial.begin(115200);

  Serial.println("UART Communication Started");
}

void loop()
{
  Serial.println("Hello Tarangify");

  delay(1000);
}
```

---

# Code Explanation

Initialize UART:

```cpp
Serial.begin(115200);
```

Send text:

```cpp
Serial.println("Hello Tarangify");
```

The message appears in the Serial Monitor every second.

---

# Example Output

```text
UART Communication Started
Hello Tarangify
Hello Tarangify
Hello Tarangify
```

---

# Receiving Data from Serial Monitor

The Serial Monitor can also send data to the ESP32.

```cpp
void setup()
{
  Serial.begin(115200);
}

void loop()
{
  if(Serial.available())
  {
    String message = Serial.readStringUntil('\n');

    Serial.print("Received: ");
    Serial.println(message);
  }
}
```

---

# How It Works

Check for incoming data:

```cpp
Serial.available()
```

Read the received text:

```cpp
Serial.readStringUntil('\n')
```

Display the received message:

```cpp
Serial.println(message);
```

---

# Example

User enters:

```text
Hello ESP32
```

Output:

```text
Received: Hello ESP32
```

---

# Example 2: LED Control Using Serial Commands

This example allows the Serial Monitor to control an LED.

```cpp
const int ledPin = 2;

void setup()
{
  Serial.begin(115200);

  pinMode(ledPin, OUTPUT);
}

void loop()
{
  if(Serial.available())
  {
    String command =
    Serial.readStringUntil('\n');

    command.trim();

    if(command == "ON")
    {
      digitalWrite(ledPin, HIGH);
      Serial.println("LED ON");
    }

    if(command == "OFF")
    {
      digitalWrite(ledPin, LOW);
      Serial.println("LED OFF");
    }
  }
}
```

---

# Testing

Send:

```text
ON
```

Result:

```text
LED ON
```

LED turns ON.

Send:

```text
OFF
```

Result:

```text
LED OFF
```

LED turns OFF.

---

# Communication Between Two ESP32 Boards

ESP32 boards can communicate directly through UART.

## Connections

| ESP32 A | ESP32 B |
|----------|----------|
| TX | RX |
| RX | TX |
| GND | GND |

Example:

```text
ESP32 A TX → ESP32 B RX
ESP32 A RX → ESP32 B TX
ESP32 A GND → ESP32 B GND
```

This arrangement allows data exchange between the two boards. :contentReference[oaicite:7]{index=7}

---

# Example Transmitter

```cpp
void setup()
{
  Serial1.begin(115200);
}

void loop()
{
  Serial1.println("Hello Board B");

  delay(1000);
}
```

---

# Example Receiver

```cpp
void setup()
{
  Serial.begin(115200);

  Serial1.begin(115200);
}

void loop()
{
  if(Serial1.available())
  {
    String msg =
    Serial1.readStringUntil('\n');

    Serial.println(msg);
  }
}
```

---

# Common UART Functions

## Initialize UART

```cpp
Serial.begin(115200);
```

## Send Data

```cpp
Serial.print("Hello");
Serial.println("Hello");
```

## Check Incoming Data

```cpp
Serial.available();
```

## Read One Character

```cpp
char c = Serial.read();
```

## Read String

```cpp
String data =
Serial.readStringUntil('\n');
```

---

# UART Applications

UART is commonly used in:

- GPS Modules
- GSM/4G Modules
- Bluetooth Modules
- LoRa Modules
- Serial Displays
- Fingerprint Sensors
- Debugging Systems
- Communication Between Microcontrollers

---

# UART vs I2C vs SPI

| Feature | UART | I2C | SPI |
|----------|----------|----------|----------|
| Wires | 2 + GND | 2 | 4+ |
| Speed | Medium | Medium | High |
| Multi Device Support | No | Yes | Yes |
| Complexity | Easy | Medium | Medium |

---

# Summary

In this tutorial, you learned:

- What UART is
- How UART communication works
- Baud Rate and Data Frames
- Using the Serial Monitor
- Sending and Receiving Data
- Controlling hardware using UART
- Communication between two ESP32 boards

In the next tutorial, we will learn about I2C Communication and how multiple devices can share the same communication bus.