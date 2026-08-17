---
sidebar_position: 7
---

# 5. OLED Display 

## Introduction

This example demonstrates how to initialize and display text on a 0.91-inch OLED display connected to the T-CORE-S3-GSM development board.

The OLED display communicates with the ESP32-S3 using the I2C interface. Once initialized, the display shows a simple test message confirming successful communication between the board and the display.

This example is useful for verifying that the OLED display is functioning correctly and for learning how to display text using the Adafruit SSD1306 library.

---

## What You Will Learn

By completing this example, you will learn how to:

- Initialize an I2C OLED display using the ESP32-S3.
- Use the Adafruit SSD1306 library.
- Display text on an OLED screen.
- Configure custom SDA and SCL pins.
- Verify display operation using the Serial Monitor.

---

## Hardware Used

| Component | Description |
|------------|-------------|
| ESP32-S3 Development Board | T-CORE-S3-GSM |
| OLED Display | 0.91-inch SSD1306 OLED |
| Communication Interface | I2C |

---

## OLED Connections

| Signal | GPIO Pin |
|---------|----------|
| SDA | GPIO 8 |
| SCL | GPIO 9 |
| Address | 0x3C |

---

## Required Libraries

Install the following libraries from the Arduino Library Manager:

- Adafruit GFX Library
- Adafruit SSD1306

These libraries are required for graphics and text rendering on the OLED display.

---

## How to Run the Example

### Step 1: Open Arduino IDE

Launch the Arduino IDE and ensure the ESP32 board package is installed.

### Step 2: Install Required Libraries

Open:

```text
Sketch → Include Library → Manage Libraries
```

Install:

- Adafruit GFX Library
- Adafruit SSD1306

### Step 3: Select the Board

Navigate to:

```text
Tools → Board → ESP32 Arduino → ESP32S3 Dev Module
```

### Step 4: Select the COM Port

Connect the board to your computer using a USB Type-C cable.

Navigate to:

```text
Tools → Port → COMx
```

and select the COM port corresponding to your ESP32-S3 board.

### Step 5: Upload the Code

Copy the example code into a new Arduino sketch and click the **Upload** button.

Wait for the upload process to complete successfully.

### Step 6: Observe the OLED Display

After the upload is complete, the OLED display should initialize and show the test message.

---

## Expected Behaviour

The OLED display will show:

```text
ThingsLinker

Display Test OK
```

At the same time, status messages will be printed to the Serial Monitor.

---

## Serial Monitor Output

### Display Detected

```text
[DISPLAY TEST] Initializing...
Display : DETECTED
Message Displayed Successfully.
[DISPLAY TEST] Successful.
```

### Display Not Detected

```text
[DISPLAY TEST] Initializing...
Display : NOT DETECTED
[DISPLAY TEST] Failed.
```

---

## Arduino Code

```cpp
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 32
#define OLED_ADDRESS 0x3C

#define SDA_PIN 8
#define SCL_PIN 9

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

void setup()
{
  Serial.begin(115200);

  Serial.println("\n[DISPLAY TEST] Initializing...");

  Wire.begin(SDA_PIN, SCL_PIN);

  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDRESS))
  {
    Serial.println("Display : NOT DETECTED");
    Serial.println("[DISPLAY TEST] Failed.");
    return;
  }

  Serial.println("Display : DETECTED");

  display.clearDisplay();

  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  display.setCursor(0, 8);
  display.println("ThingsLinker");

  display.setCursor(0, 20);
  display.println("Display Test OK");

  display.display();

  Serial.println("Message Displayed Successfully.");
  Serial.println("[DISPLAY TEST] Successful.");
}

void loop()
{
}
```