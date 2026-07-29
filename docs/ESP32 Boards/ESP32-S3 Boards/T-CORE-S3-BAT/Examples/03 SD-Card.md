---
sidebar_position: 5
---

# 3. SD Card 

## Introduction

This example demonstrates how to initialize and detect a microSD card connected to the T-CORE-S3-BAT development board.

The ESP32-S3 communicates with the SD card using the SPI interface. During startup, the board checks whether a valid SD card is present and displays information such as the card type and storage capacity in the Serial Monitor.

This example is useful for verifying that the SD card slot and SPI communication are functioning correctly.

---

## What You Will Learn

By completing this example, you will learn how to:

- Initialize an SD card using the ESP32-S3.
- Configure SPI communication.
- Detect whether an SD card is inserted.
- Read SD card information.
- Display SD card details in the Serial Monitor.

---

## Hardware Used

| Component | Description |
|------------|-------------|
| ESP32-S3 Development Board | T-CORE-S3-BAT |
| MicroSD Card | FAT32 formatted |
| Onboard SD Card Slot | SPI Interface |

---

## SD Card SPI Connections

| Signal | GPIO Pin |
|----------|----------|
| CS | GPIO 10 |
| MOSI | GPIO 11 |
| SCK | GPIO 12 |
| MISO | GPIO 13 |

---

## Required Library

The following libraries are included with the ESP32 Arduino package:

- SPI
- SD

No additional library installation is required.

---

## How to Run the Example

### Step 1: Insert the SD Card

Insert a properly formatted microSD card into the onboard SD card slot.

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

Observe the SD card information displayed by the board.

---

## Expected Behaviour

If an SD card is detected successfully, the Serial Monitor will display:

- SD card detection status
- Card type
- Card size

If no SD card is present, an error message will be displayed.

---

## Serial Monitor Output

### SD Card Detected

```text
[SD CARD TEST] Initializing...
SD Card : DETECTED
Card Type : SDHC
Card Size : 16000 MB
[SD CARD TEST] Successful.
```

### SD Card Not Detected

```text
[SD CARD TEST] Initializing...
SD Card : NOT DETECTED
[SD CARD TEST] Failed.
```

---

## Arduino Code

```cpp
#include <SPI.h>
#include <SD.h>

#define SD_CS   10
#define SD_MOSI 11
#define SD_SCK  12
#define SD_MISO 13

void setup()
{
  Serial.begin(115200);

  Serial.println("\n[SD CARD TEST] Initializing...");

  SPI.begin(SD_SCK, SD_MISO, SD_MOSI, SD_CS);

  if (!SD.begin(SD_CS))
  {
    Serial.println("SD Card : NOT DETECTED");
    Serial.println("[SD CARD TEST] Failed.");
    return;
  }

  Serial.println("SD Card : DETECTED");

  uint8_t cardType = SD.cardType();

  Serial.print("Card Type : ");

  if (cardType == CARD_MMC)
    Serial.println("MMC");
  else if (cardType == CARD_SD)
    Serial.println("SDSC");
  else if (cardType == CARD_SDHC)
    Serial.println("SDHC");
  else
    Serial.println("UNKNOWN");

  uint64_t cardSize = SD.cardSize() / (1024 * 1024);

  Serial.print("Card Size : ");
  Serial.print(cardSize);
  Serial.println(" MB");

  Serial.println("[SD CARD TEST] Successful.");
}

void loop()
{
}
```