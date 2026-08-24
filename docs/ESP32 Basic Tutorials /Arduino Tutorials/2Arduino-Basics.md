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

![Arduino IDE](/img/2A1.jpg)

4. Select the COM Port.

![Arduino IDE](/img/2A2.jpg)

5. Click **Upload**.

![Arduino IDE](/img/2A3.jpg)

### Enable USB CDC On Boot (Optional)

In the Tools menu, check the USB CDC On Boot option.

:::info
Some ESP32 boards (e.g., the ESP32-S3 series) feature a native USB interface on the chip itself, which can be used for firmware uploading or serial communication without requiring a separate USB-to-serial chip (like CH340, CP2102).

For such boards, you need to enable the USB CDC On Boot feature in the Arduino IDE. [More Info](https://docs.espressif.com/projects/arduino-esp32/en/latest/tutorials/cdc_dfu_flash.html#usb-cdc)

For example, the Waveshare ESP32-S3-Zero development board relies on the USB CDC On Boot feature. This option is usually enabled by default. Please check and confirm that the "USB CDC On Boot" option is set to "Enabled" in the Arduino IDE's "Tools" menu.
:::

![Arduino IDE](/img/2A4.jpg)

After uploading:

1. Open **Serial Monitor**.

![Arduino IDE](/img/2A5.jpg)

2. Set baud rate to **115200**.

![Arduino IDE](/img/6A3.webp)

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

## Navigating Official Documentation
### 1. ESP32 Arduino Core Documentation
- While many core Arduino functions apply to the ESP32, the ESP32 chip is much more powerful than the traditional Arduino Uno, so it has many unique APIs and libraries (e.g., for Wi-Fi, Bluetooth, FreeRTOS, etc.).

- [Arduino Core for ESP32 Documentation](https://docs.espressif.com/projects/arduino-esp32/en/latest/index.html)
- [Espressif official Documentation (ESP-IDF)](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/) (This is the underlying SDK documentation; the Arduino Core is wrapped around this).

### 2. Arduino Official Reference:
- URL: https://www.arduino.cc/reference/en/
- This is the authoritative official resource for learning Arduino programming. It details the core functions, data types, structures, and usage of commonly used libraries in the Arduino language.
- How to use: On the website, you can search directly for function names (like Serial.println) or browse through categories on the left (Variables, Functions, Libraries, etc.). Each entry typically contains a function description, syntax, parameter explanation, return values, and example code.

### 3. Getting Started with Arduino:
- URL: https://docs.arduino.cc/learn/starting-guide/getting-started-arduino
- This guide is highly recommended for beginners. It provides a comprehensive overview of the Arduino ecosystem, explaining the relationship between hardware and software, making it an ideal starting point for those new to microcontrollers.

### 4. Troubleshooting 
#### 1. No new ports appear in the port list
- Check if the USB cable is a data cable (not just a charging cable)
- Confirm if the BOOT key was pressed correctly (if necessary)
- Try plugging and unplugging the USB cable or replacing the USB port
#### 2. Code upload failed
- Confirm that the correct development board model is selected in the Arduino IDE
- nCheck if the correct port is selected
- Retry entering download mode by pressing the BOOT key
- Close other programs that may be using the serial port
#### 3. Serial monitor displays garbled characters
- Check if the baud rate setting in the serial monitor is consistent with the value of Serial.begin() in the code
#### 4. Upload successful but no output in Serial Monitor
- For development boards with native USB ports, check if the **USB CDC On Boot** feature is enabled
- Confirm the Serial Monitor is connected to the correct port.
- Try pressing the RESET button on the board to restart the board.


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
