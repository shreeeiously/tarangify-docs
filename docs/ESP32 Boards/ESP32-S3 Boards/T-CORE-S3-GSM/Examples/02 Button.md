---
sidebar_position: 3
---

# 2. User Button 

## Introduction

This example demonstrates how to read the state of the onboard User Button available on the T-CORE-S3-GSM development board.

The User Button is connected to GPIO 41 and is configured using the ESP32-S3's internal pull-up resistor.

The example continuously monitors the button state and prints a message to the Serial Monitor whenever the button is pressed or released.

---

## What You Will Learn

By completing this example, you will learn how to:

- Read a digital input using the ESP32-S3.
- Configure a GPIO pin with an internal pull-up resistor.
- Detect button press and release events.
- Display button status using the Serial Monitor.

---

## Hardware Used

| Component | Description |
|------------|-------------|
| ESP32-S3 Development Board | T-CORE-S3-GSM |
| User Button | Connected to GPIO 41 |

---

## How the Button Works

The User Button uses the ESP32-S3's internal pull-up resistor.

| Button State | GPIO Reading |
|-------------|-------------|
| Released | HIGH |
| Pressed | LOW |

When the button is pressed, GPIO 41 is connected to GND, causing the input to read LOW.

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

### Step 4: Upload the Code

Copy the example code into a new Arduino sketch and click the **Upload** button.

Wait for the upload process to complete successfully.

### Step 5: Open Serial Monitor

Open the Serial Monitor and set the baud rate to:

```text
115200
```

### Step 6: Press the User Button

Press and release the onboard User Button connected to GPIO 41.

Observe the messages displayed in the Serial Monitor.

---

## Expected Behaviour

When the button is pressed:

```text
Button : PRESSED
```

When the button is released:

```text
Button : RELEASED
```

A message is printed only when the button state changes.

---

## Serial Monitor Output

Example:

```text
Button : PRESSED
Button : RELEASED
Button : PRESSED
Button : RELEASED
```

---

## Arduino Code

```cpp
#define BUTTON_PIN 41

int lastButtonState = HIGH;

void setup()
{
  Serial.begin(115200);

  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop()
{
  int buttonState = digitalRead(BUTTON_PIN);

  if (buttonState == LOW && lastButtonState == HIGH)
  {
    Serial.println("Button : PRESSED");
  }

  if (buttonState == HIGH && lastButtonState == LOW)
  {
    Serial.println("Button : RELEASED");
  }

  lastButtonState = buttonState;

  delay(20);
}
```