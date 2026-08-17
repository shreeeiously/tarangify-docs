---
sidebar_position: 11
---

# 7. GNSS

## Introduction

This example demonstrates how to enable and test the GNSS functionality of the **SIMCom A7672X** module on the Tarangify CoreX-S3 GSM development board.

The A7672X provides positioning functionality using satellite navigation systems.

The ESP32-S3 communicates with the A7672X through UART and uses AT commands to enable GNSS and retrieve positioning information.

The GNSS system can provide information such as:

- Latitude
- Longitude
- Altitude
- Speed
- Date
- Time
- Number of satellites

---

## What You Will Learn

By completing this example, you will learn how to:

- Enable GNSS.
- Communicate with the A7672X.
- Check GNSS status.
- Read positioning information.
- Obtain latitude and longitude.
- Monitor satellite positioning data.

---

## Hardware Used

| Component | Description |
|------------|-------------|
| ESP32-S3 Development Board | Tarangify CoreX-S3 GSM |
| Cellular Module | SIMCom A7672X |
| GNSS Antenna | Connected to GNSS connector |
| USB Type-C Cable | Programming and power |

---

## GNSS Antenna

Connect an appropriate GNSS antenna to the GNSS antenna connector before starting the test.

For the first GNSS fix, place the antenna where it has a clear view of the sky.

:::warning

GNSS acquisition can take some time, especially when the module is being used for the first time or when there is poor satellite visibility.
:::

---

## GNSS Systems

The A7672X supports satellite positioning systems including:

- GPS
- GLONASS
- BeiDou

---

## Required Library

No additional library is required.

The example uses:

```text
HardwareSerial
```

---

## How to Run the Example

### Step 1: Connect the GNSS Antenna

Connect the GNSS antenna to the appropriate connector.

### Step 2: Move Outdoors

For the best results, place the antenna outdoors or near a window with a clear view of the sky.

### Step 3: Open Arduino IDE

Launch Arduino IDE.

### Step 4: Select the Board

Navigate to:

```text
Tools → Board → ESP32 Arduino → ESP32S3 Dev Module
```

### Step 5: Select the COM Port

Navigate to:

```text
Tools → Port → COMx
```

### Step 6: Upload the Code

Set the correct A7672X UART pins and upload the sketch.

### Step 7: Open Serial Monitor

Set the Serial Monitor to:

```text
115200 baud
```

---

## AT Commands Used

| AT Command      | Purpose               |
| ---------------- | --------------------- |
| `AT`            | Check modem           |
| `AT+CGNSSPWR=1` | Enable GNSS           |
| `AT+CGNSSINFO`  | Read GNSS information |
| `AT+CGNSSPWR=0` | Disable GNSS          |

---

## Expected Behaviour

Initially, the module may not have a valid satellite fix.

The Serial Monitor may display:

```text
GNSS : Searching...
```

After satellites are acquired, positioning information will be displayed.

---

## Serial Monitor Output

### Searching for Satellites

```text
[GNSS TEST] Initializing...

GNSS : ENABLED
Searching for satellites...
Please wait...
```

### GNSS Fix Obtained

```text
GNSS : FIXED

Latitude  : 23.0225
Longitude : 72.5714
Altitude  : 53.2 m
Speed     : 0.4 km/h
Satellites: 8

[GNSS TEST] Successful.
```

---

## Arduino Code

```cpp
#include <HardwareSerial.h>

#define MODEM_RX YOUR_MODEM_RX_PIN
#define MODEM_TX YOUR_MODEM_TX_PIN

#define MODEM_BAUD 115200

HardwareSerial modem(1);

void sendCommand(const char *command)
{
  Serial.print("\n>> ");
  Serial.println(command);

  modem.println(command);

  unsigned long startTime = millis();

  while (millis() - startTime < 3000)
  {
    while (modem.available())
    {
      Serial.write(modem.read());
    }
  }
}

void setup()
{
  Serial.begin(115200);

  delay(1000);

  Serial.println();
  Serial.println("[GNSS TEST] Initializing...");

  modem.begin(
    MODEM_BAUD,
    SERIAL_8N1,
    MODEM_RX,
    MODEM_TX
  );

  delay(3000);

  sendCommand("AT");

  Serial.println("\nEnabling GNSS...");

  sendCommand("AT+CGNSSPWR=1");

  Serial.println("\nGNSS enabled.");
  Serial.println("Waiting for satellite fix...");
}

void loop()
{
  sendCommand("AT+CGNSSINFO");

  delay(5000);
}
```

---

## Result

A successful GNSS test confirms that:

- The A7672X GNSS functionality is enabled.
- The GNSS antenna is connected correctly.
- Satellite signals can be received.
- Positioning information can be obtained.

---

## Troubleshooting

If no position is obtained:

- Check the GNSS antenna connection.
- Move the board outdoors.
- Ensure the antenna has a clear view of the sky.
- Wait several minutes for the first fix.
- Check that GNSS has been enabled.

---