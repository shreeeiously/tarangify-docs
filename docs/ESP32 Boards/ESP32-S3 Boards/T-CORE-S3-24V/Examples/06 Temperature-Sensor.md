---
sidebar_position: 8
---

# 6. SHT35 Temperature & Humidity Sensor 

## Introduction

This example demonstrates how to measure temperature and relative humidity using the SHT35 sensor connected to the T-CORE-S3-24V development board.

The SHT35 is a high-accuracy digital temperature and humidity sensor that communicates with the ESP32-S3 using the I2C interface.

The measured temperature and humidity values are displayed in the Serial Monitor and updated every two seconds.

This example is useful for environmental monitoring, weather stations, HVAC systems, and IoT applications.

---

## What You Will Learn

By completing this example, you will learn how to:

- Interface an SHT35 sensor with the ESP32-S3.
- Use I2C communication for sensor data acquisition.
- Read temperature measurements in degrees Celsius.
- Read relative humidity measurements.
- Display sensor readings in the Serial Monitor.

---

## Hardware Used

| Component | Description |
|------------|-------------|
| ESP32-S3 Development Board | T-CORE-S3-24V |
| SHT35 Sensor | Temperature & Humidity Sensor |
| Communication Interface | I2C |

---

## Sensor Connections

| Signal | GPIO Pin |
|---------|----------|
| SDA | GPIO 8 |
| SCL | GPIO 9 |
| I2C Address | 0x44 |

---

## Required Libraries

Install the following library from the Arduino Library Manager:

- Adafruit SHT31 Library

The library automatically handles communication with the SHT35/SHT31 sensor family.

---

## How to Run the Example

### Step 1: Connect the Sensor

Connect the SHT35 sensor to the board using the I2C interface.

### Step 2: Open Arduino IDE

Launch the Arduino IDE and ensure the ESP32 board package is installed.

### Step 3: Install Required Library

Open:

```text
Sketch → Include Library → Manage Libraries
```

Install:

```text
Adafruit SHT31 Library
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

### Step 7: Open Serial Monitor

Open the Serial Monitor and set the baud rate to:

```text
115200
```

The temperature and humidity values will be displayed every two seconds.

---

## Expected Behaviour

The SHT35 sensor will:

- Measure ambient temperature.
- Measure relative humidity.
- Update readings every 2 seconds.
- Display values in the Serial Monitor.

---

## Serial Monitor Output

### Sensor Detected

```text
[SHT3X SENSOR TEST] Initializing...
SHT3x Sensor : DETECTED
[SHT3X SENSOR TEST] Successful.

Temperature : 27.15 °C
Humidity    : 58.42 %RH

Temperature : 27.18 °C
Humidity    : 58.35 %RH
```

### Sensor Not Detected

```text
[SHT3X SENSOR TEST] Initializing...
SHT3x Sensor : NOT DETECTED
[SHT3X SENSOR TEST] Failed.
```

---

## Arduino Code

```cpp
#include <Wire.h>
#include <Adafruit_SHT31.h>

#define SDA_PIN 8
#define SCL_PIN 9

Adafruit_SHT31 sht31 = Adafruit_SHT31();

void setup()
{
  Serial.begin(115200);

  Serial.println("\n[SHT3X SENSOR TEST] Initializing...");

  Wire.begin(SDA_PIN, SCL_PIN);

  if (!sht31.begin(0x44))
  {
    Serial.println("SHT3x Sensor : NOT DETECTED");
    Serial.println("[SHT3X SENSOR TEST] Failed.");
    return;
  }

  Serial.println("SHT3x Sensor : DETECTED");
  Serial.println("[SHT3X SENSOR TEST] Successful.");
}

void loop()
{
  float temperature = sht31.readTemperature();
  float humidity = sht31.readHumidity();

  if (isnan(temperature) || isnan(humidity))
  {
    Serial.println("Failed to read sensor values.");
    delay(2000);
    return;
  }

  Serial.print("Temperature : ");
  Serial.print(temperature, 2);
  Serial.println(" °C");

  Serial.print("Humidity    : ");
  Serial.print(humidity, 2);
  Serial.println(" %RH");

  Serial.println();

  delay(2000);
}
```