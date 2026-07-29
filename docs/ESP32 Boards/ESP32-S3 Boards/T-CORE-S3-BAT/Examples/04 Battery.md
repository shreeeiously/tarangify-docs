---
sidebar_position: 6
---

# 4. Battery Monitoring 

## Introduction

This example demonstrates how to measure the battery voltage connected to the T-CORE-S3-BAT development board.

The battery voltage is monitored using the ESP32-S3's Analog-to-Digital Converter (ADC). The measured voltage is then converted to the actual battery voltage using the onboard voltage divider ratio.

The example also estimates the battery charge percentage and displays both values in the Serial Monitor.

This example is useful for battery-powered applications where monitoring the battery level is important.

---

## What You Will Learn

By completing this example, you will learn how to:

- Read analog voltages using the ESP32-S3 ADC.
- Convert ADC readings into real voltage values.
- Calculate battery voltage using a voltage divider.
- Estimate battery charge percentage.
- Display battery information in the Serial Monitor.

---

## Hardware Used

| Component | Description |
|------------|-------------|
| ESP32-S3 Development Board | T-CORE-S3-BAT |
| Battery Input | Connected through onboard voltage divider |
| ADC Pin | GPIO 3 |

---

## Battery Measurement Details

| Parameter | Value |
|------------|--------|
| ADC Pin | GPIO 3 |
| ADC Resolution | 12-bit |
| Divider Ratio | 14.2 |
| Battery Range | 3.3V - 4.2V |

The onboard voltage divider reduces the battery voltage to a safe level that can be measured by the ESP32-S3 ADC.

---

## How to Run the Example

### Step 1: Connect the Battery

Ensure a battery is connected to the board.

### Step 2: Open Arduino IDE

Launch the Arduino IDE and ensure the ESP32 board package is installed.

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

### Step 6: Open Serial Monitor

Open the Serial Monitor and set the baud rate to:

```text
115200
```

The battery voltage and estimated charge percentage will be displayed.

---

## Expected Behaviour

The board will:

- Read the battery voltage through GPIO 3.
- Calculate the actual battery voltage.
- Estimate the battery percentage.
- Display the results in the Serial Monitor.

---

## Serial Monitor Output

Example:

```text
[BATTERY TEST] Initializing...

Battery Voltage : 4.05 V
Battery Percentage : 83 %

[BATTERY TEST] Successful.
```

> The displayed percentage is an estimate based on a battery voltage range of 3.3V to 4.2V.

---

## Arduino Code

```cpp
#define BATTERY_PIN 3
#define DIVIDER_RATIO 14.2

void setup()
{
  Serial.begin(115200);

  Serial.println("\n[BATTERY TEST] Initializing...");

  analogReadResolution(12);

  const int samples = 20;
  long total = 0;

  for (int i = 0; i < samples; i++)
  {
    total += analogRead(BATTERY_PIN);
    delay(5);
  }

  float rawValue = total / (float)samples;

  float adcVoltage = (rawValue * 3.3) / 4095.0;

  float batteryVoltage = adcVoltage * DIVIDER_RATIO;

  int batteryPercentage = map((int)(batteryVoltage * 100),
                              330, 420,
                              0, 100);

  batteryPercentage = constrain(batteryPercentage, 0, 100);

  Serial.print("Battery Voltage : ");
  Serial.print(batteryVoltage, 2);
  Serial.println(" V");

  Serial.print("Battery Percentage : ");
  Serial.print(batteryPercentage);
  Serial.println(" %");

  Serial.println("[BATTERY TEST] Successful.");
}

void loop()
{
}
```