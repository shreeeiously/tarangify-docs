---
sidebar_position: 9
---

# 7. Servo Motor

## Introduction

This example demonstrates how to control a servo motor using the T-CORE-S3-BAT development board.

A servo motor is a position-controlled actuator commonly used in robotics, automation, RC vehicles, and mechanical systems. The ESP32-S3 generates PWM signals that allow the servo motor to rotate to specific angles.

In this example, the servo motor continuously moves between:

1. 0°
2. 90°
3. 180°

The current position is displayed in the Serial Monitor.

---

## What You Will Learn

By completing this example, you will learn how to:

- Interface a servo motor with the ESP32-S3.
- Use the ESP32Servo library.
- Generate PWM signals for servo control.
- Move a servo motor to specific positions.
- Monitor servo movement through the Serial Monitor.

---

## Hardware Used

| Component | Description |
|------------|-------------|
| ESP32-S3 Development Board | T-CORE-S3-BAT |
| Servo Motor | Standard 180° Servo |
| Control Pin | GPIO 3 |

---

## Servo Connections

| Servo Wire | ESP32-S3 Connection |
|------------|---------------------|
| Red (VCC) | 5V |
| Brown/Black (GND) | GND |
| Orange/Yellow (Signal) | GPIO 3 |

> For larger servo motors, use an external power supply instead of powering the servo directly from the ESP32 board.

---

## Required Library

Install the following library from the Arduino Library Manager:

- ESP32Servo

---

## How to Run the Example

### Step 1: Connect the Servo Motor

Connect the servo motor according to the wiring table above.

### Step 2: Open Arduino IDE

Launch the Arduino IDE and ensure the ESP32 board package is installed.

### Step 3: Install Required Library

Open:

```text
Sketch → Include Library → Manage Libraries
```

Install:

```text
ESP32Servo
```

### Step 4: Select the Board

Navigate to:

```text
Tools → Board → ESP32 Arduino → ESP32S3 Dev Module
```

### Step 5: Select the COM Port

Connect the board to your computer using a USB Type-C cable.

Navigate to:

```text
Tools → Port → COMx
```

and select the COM port corresponding to your ESP32-S3 board.

### Step 6: Upload the Code

Copy the example code into a new Arduino sketch and click the **Upload** button.

Wait for the upload process to complete successfully.

### Step 7: Observe the Servo Motor

After the upload is complete, the servo motor will begin rotating between predefined positions.

---

## Expected Behaviour

The servo motor will:

- Rotate to **0°**
- Move to **90°**
- Move to **180°**
- Repeat the sequence continuously

Each position is held for one second before moving to the next position.

---

## Serial Monitor Output

Open the Serial Monitor and set the baud rate to **115200**.

Example output:

```text
[SERVO TEST] Initializing...
Servo Motor : DETECTED
[SERVO TEST] Successful.

Servo Position : 0°
Servo Position : 90°
Servo Position : 180°
```

---

## Arduino Code

```cpp
#include <ESP32Servo.h>

#define SERVO_PIN 3

Servo myServo;

void setup()
{
  Serial.begin(115200);

  Serial.println("\n[SERVO TEST] Initializing...");

  myServo.attach(SERVO_PIN);

  Serial.println("Servo Motor : DETECTED");
  Serial.println("[SERVO TEST] Successful.");
}

void loop()
{
  Serial.println("Servo Position : 0°");
  myServo.write(0);
  delay(1000);

  Serial.println("Servo Position : 90°");
  myServo.write(90);
  delay(1000);

  Serial.println("Servo Position : 180°");
  myServo.write(180);
  delay(1000);
}
```