---
sidebar_position: 4
title: Analog Input
description: Learn how to read analog voltages using the ESP32 ADC.
---

# Section 4: Analog Input

Many sensors produce continuously changing voltage signals rather than simple ON/OFF states. To measure these signals, the ESP32 uses an ADC (Analog-to-Digital Converter).

In this tutorial, you will learn:

- What analog signals are
- What an ADC does
- How ESP32 converts voltage into digital values
- How to read analog inputs
- How to use a potentiometer
- How to calculate voltage from ADC readings

---

# What is an Analog Signal?

An analog signal can change continuously within a range.

Examples include:

- Temperature
- Light Intensity
- Sound Level
- Battery Voltage
- Potentiometer Position

Unlike digital signals, which have only HIGH and LOW states, analog signals can have many values between 0V and 3.3V.

---

# What is an ADC?

ADC stands for:

**Analog-to-Digital Converter**

The ADC converts an analog voltage into a digital number that the ESP32 can process.

```text
Analog Voltage
      │
      ▼
    ADC
      │
      ▼
 Digital Value
```

For example:

| Input Voltage | ADC Value |
|---------------|-----------|
| 0V | 0 |
| 1.65V | ~2048 |
| 3.3V | ~4095 |

The ESP32 ADC typically uses a 12-bit resolution, providing values from 0 to 4095. :contentReference[oaicite:0]{index=0}

---

# ESP32 ADC Resolution

A 12-bit ADC provides:

```text
2^12 = 4096 Levels
```

Therefore:

```text
ADC Range = 0 to 4095
```

Higher resolution means smaller voltage changes can be detected.

---

# ADC Pins on ESP32

Not every GPIO pin supports analog input.

For ESP32-S3 boards, commonly used ADC pins include:

```text
GPIO1  - GPIO10
```

Always verify the pinout of your specific development board before connecting sensors. :contentReference[oaicite:1]{index=1}

---

# Reading a Potentiometer

A potentiometer is a variable resistor that can generate different voltage levels.

## Connections

| Potentiometer | ESP32 |
|--------------|--------|
| VCC | 3.3V |
| GND | GND |
| SIG | GPIO3 |

---

## Circuit

```text
3.3V ---- Potentiometer ---- GND
                │
                ▼
             GPIO3
```

---

# Basic ADC Reading Example

```cpp
const int adcPin = 3;

void setup()
{
  Serial.begin(115200);
}

void loop()
{
  int adcValue = analogRead(adcPin);

  Serial.print("ADC Value: ");
  Serial.println(adcValue);

  delay(500);
}
```

---

# How the Code Works

Read the analog value:

```cpp
analogRead(adcPin);
```

Possible output:

```text
ADC Value: 0
ADC Value: 1250
ADC Value: 2890
ADC Value: 4095
```

Rotating the potentiometer changes the voltage and therefore changes the ADC reading.

---

# Converting ADC Value to Voltage

The ESP32 measures voltage and returns a digital value.

To estimate the voltage:

```cpp
voltage = (adcValue * 3.3) / 4095.0;
```

Example:

```cpp
const int adcPin = 3;

void setup()
{
  Serial.begin(115200);
}

void loop()
{
  int adcValue = analogRead(adcPin);

  float voltage =
      (adcValue * 3.3) / 4095.0;

  Serial.print("ADC: ");
  Serial.print(adcValue);

  Serial.print("  Voltage: ");
  Serial.print(voltage);

  Serial.println(" V");

  delay(500);
}
```

---

# Example Output

```text
ADC: 0      Voltage: 0.00 V
ADC: 1024   Voltage: 0.82 V
ADC: 2048   Voltage: 1.65 V
ADC: 4095   Voltage: 3.30 V
```

---

# Measuring Battery Voltage

The ADC can also be used to monitor battery levels.

Since many batteries exceed 3.3V, a voltage divider is usually required.

Example:

```text
Battery
   │
Voltage Divider
   │
GPIO3 (ADC)
```

This is the same principle used in battery monitoring circuits on many ESP32 development boards.

---

# Analog Input Applications

ADC is commonly used for:

- Battery Monitoring
- Light Sensors (LDR)
- Potentiometers
- Temperature Sensors
- Soil Moisture Sensors
- Sound Sensors
- Gas Sensors
- Industrial Monitoring

---

# Common ADC Functions

## Read Analog Value

```cpp
analogRead(pin);
```

## Read Voltage (Millivolts)

```cpp
analogReadMilliVolts(pin);
```

This function automatically converts the ADC reading into millivolts using ESP32 calibration data when supported. :contentReference[oaicite:2]{index=2}

---

# Practical Example: Display Percentage

```cpp
int adcValue = analogRead(3);

int percentage =
map(adcValue, 0, 4095, 0, 100);

Serial.print(percentage);
Serial.println("%");
```

Output:

```text
0%
25%
50%
75%
100%
```

---

# Summary

In this tutorial, you learned:

- What analog signals are
- What an ADC does
- How ESP32 converts voltage to digital values
- How to use `analogRead()`
- How to calculate voltage
- How ADC is used for battery and sensor monitoring

In the next tutorial, we will learn how to generate analog-like output signals using PWM (Pulse Width Modulation).