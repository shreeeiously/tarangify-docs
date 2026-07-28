---
sidebar_position: 1
---

# 1. RGB LED 

## Introduction

This example demonstrates how to control the onboard WS2812 RGB LED available on the T-CORE-S3-24V development board. The RGB LED is connected to GPIO 48 and can display different colours by controlling the intensity of its Red, Green, and Blue elements.

In this example, the LED cycles through four states:

1. Red
2. Green
3. Blue
4. Off

Each state is displayed for one second before moving to the next colour.

---

## What You Will Learn

By completing this example, you will learn how to:

- Control the onboard RGB LED using the ESP32-S3.
- Use the Adafruit NeoPixel library.
- Display different colours on a WS2812 RGB LED.
- Create simple visual indicators for your projects.

---

## Hardware Used

| Component | Description |
|------------|-------------|
| ESP32-S3 Development Board | T-CORE-S3-24V |
| Onboard RGB LED | WS2812 RGB LED connected to GPIO 48 |

---

## Required Library

Install the following library from the Arduino Library Manager before uploading the code:

- Adafruit NeoPixel

---

## How to Run the Example

### Step 1: Open Arduino IDE

Launch the Arduino IDE and ensure the ESP32 board package is installed.

### Step 2: Select the Board

Navigate to:

```text
Tools → Board → ESP32 Arduino → ESP32S3 Dev Module
```

### Step 3: Select the COM Port

Connect the board to your computer using a USB Type-C cable.

Navigate to:

```text
Tools → Port → COMx
```

and select the COM port corresponding to your ESP32-S3 board.

---

## Step 4: Upload the Code

Copy the example code into a new Arduino sketch and click the **Upload** button.

Wait for the upload process to complete successfully.

---

## Step 5: Observe the RGB LED

After the code has been uploaded, the onboard RGB LED connected to GPIO 48 will start cycling through different colours.

---

## Expected Behaviour

The RGB LED will:

- Turn **Red** for 1 second.
- Turn **Green** for 1 second.
- Turn **Blue** for 1 second.
- Turn **Off** for 1 second.

The sequence repeats continuously.

---

## Serial Monitor Output

Open the **Serial Monitor** and set the baud rate to **115200**.

You should see the following output:

```text
RGB : RED
RGB : GREEN
RGB : BLUE
RGB : OFF
```

---

## Arduino Code

```cpp
/*************************************************************
  ThingsLinker RGB LED Example

  This example demonstrates how to control an RGB LED
  connected to GPIO 48 on an ESP32-S3 development board.

  The RGB LED cycles through Red, Green, Blue, and OFF
  states every second.

  For downloads, documentation, and tutorials, please visit: https://thingslinker.com
  ThingsLinker community: https://community.thingslinker.com
  Follow us: https://www.fb.com/ThingsLinker
             https://twitter.com/ThingsLinker
             https://www.instagram.com/thingslinker
             https://www.linkedin.com/company/thingslinker
 *************************************************************/

#include <Adafruit_NeoPixel.h> // Include NeoPixel library

#define RGB_PIN 48    // GPIO pin connected to the RGB LED
#define NUMPIXELS 1   // Number of RGB LEDs

// Create a NeoPixel object
Adafruit_NeoPixel rgb(NUMPIXELS, RGB_PIN, NEO_GRB + NEO_KHZ800);

void setup()
{
  Serial.begin(115200); // Initialize serial communication

  rgb.begin();          // Initialize the RGB LED
  rgb.clear();          // Turn OFF all pixels
  rgb.show();
}

void loop()
{
  // Turn the RGB LED RED
  Serial.println("RGB : RED");
  rgb.setPixelColor(0, rgb.Color(255, 0, 0));
  rgb.show();
  delay(1000);

  // Turn the RGB LED GREEN
  Serial.println("RGB : GREEN");
  rgb.setPixelColor(0, rgb.Color(0, 255, 0));
  rgb.show();
  delay(1000);

  // Turn the RGB LED BLUE
  Serial.println("RGB : BLUE");
  rgb.setPixelColor(0, rgb.Color(0, 0, 255));
  rgb.show();
  delay(1000);

  // Turn the RGB LED OFF
  Serial.println("RGB : OFF");
  rgb.setPixelColor(0, rgb.Color(0, 0, 0));
  rgb.show();
  delay(1000);
}