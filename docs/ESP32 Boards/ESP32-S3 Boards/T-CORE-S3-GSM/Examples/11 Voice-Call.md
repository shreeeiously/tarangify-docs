---
sidebar_position: 13
---

# 9. Voice Call

## Introduction

This example demonstrates how to make a voice call using the **SIMCom A7672X** cellular module on the Tarangify CoreX-S3 GSM development board.

The A7672X supports voice communication over the cellular network.

The ESP32-S3 communicates with the A7672X through UART and uses AT commands to initiate and terminate a phone call.

This feature can be useful for:

- Emergency alert systems
- Security systems
- Remote monitoring
- Industrial equipment
- IoT alarm systems
- Voice-enabled devices

---

## What You Will Learn

By completing this example, you will learn how to:

- Initialize the A7672X.
- Check the SIM card.
- Check cellular network registration.
- Initiate a voice call.
- Monitor the call status.
- Terminate a voice call.

---

## Hardware Used

| Component | Description |
|------------|-------------|
| ESP32-S3 Development Board | Tarangify CoreX-S3 GSM |
| Cellular Module | SIMCom A7672X |
| Nano SIM Card | Active SIM with voice service |
| LTE Antenna | Connected to LTE antenna connector |
| Speaker | Connected to audio output |
| Microphone | Onboard microphone |
| USB Type-C Cable | Programming and power |

---

## Voice Call Requirements

The SIM card must:

- Be activated.
- Be registered on the cellular network.
- Support voice calling.

The cellular network and SIM must support voice service with the A7672X.

---

## Audio Connections

The CoreX-S3 GSM provides audio functionality through the onboard microphone and speaker interface.

Make sure the required audio hardware is connected before testing a voice call.

---

## Required Library

No additional library is required.

The example uses:

```text
HardwareSerial
```

---

## How to Run the Example

### Step 1: Insert the SIM Card

Insert an active Nano SIM card.

### Step 2: Connect the LTE Antenna

Connect the LTE antenna.

### Step 3: Connect Audio Hardware

Connect the speaker/audio output if required.

### Step 4: Open Arduino IDE

Launch Arduino IDE.

### Step 5: Select the Board

Navigate to:

```text
Tools → Board → ESP32 Arduino → ESP32S3 Dev Module
```

### Step 6: Select the COM Port

Navigate to:

```text
Tools → Port → COMx
```

### Step 7: Set the Phone Number

Change:

```cpp
const char *phoneNumber = "+91XXXXXXXXXX";
```

to the number you want to call.

### Step 8: Upload the Code

Upload the sketch.

### Step 9: Open Serial Monitor

Set the baud rate to:

```text
115200
```

---

## AT Commands Used

| AT Command | Purpose            |
| ---------- | ------------------- |
| `AT`       | Check modem        |
| `AT+CPIN?` | Check SIM           |
| `AT+CREG?` | Check network       |
| `ATD`      | Dial phone number   |
| `ATH`      | Hang up call        |

---

## Expected Behaviour

The board will:

1. Initialize the A7672X.
2. Check the SIM card.
3. Check network registration.
4. Dial the specified phone number.
5. Keep the call active.
6. End the call after the configured duration.

---

## Serial Monitor Output

```text
[VOICE CALL TEST] Initializing...

A7672X : OK
SIM Status : READY
Network : REGISTERED

Calling +91XXXXXXXXXX...

CALLING...

Call active.

Ending call...

CALL ENDED

[VOICE CALL TEST] Successful.
```

---

## Arduino Code

```cpp
#include <HardwareSerial.h>

#define MODEM_RX YOUR_MODEM_RX_PIN
#define MODEM_TX YOUR_MODEM_TX_PIN

#define MODEM_BAUD 115200

HardwareSerial modem(1);

// Change this number
const char *phoneNumber = "+91XXXXXXXXXX";

// Call duration in milliseconds
const unsigned long CALL_DURATION = 30000;

void sendCommand(const char *command, unsigned long timeout = 3000)
{
  Serial.print("\n>> ");
  Serial.println(command);

  modem.println(command);

  unsigned long startTime = millis();

  while (millis() - startTime < timeout)
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
  Serial.println("[VOICE CALL TEST] Initializing...");

  modem.begin(
    MODEM_BAUD,
    SERIAL_8N1,
    MODEM_RX,
    MODEM_TX
  );

  delay(3000);

  sendCommand("AT");

  sendCommand("AT+CPIN?");

  sendCommand("AT+CREG?");

  Serial.println();
  Serial.print("Calling ");
  Serial.print(phoneNumber);
  Serial.println("...");

  modem.print("ATD");
  modem.print(phoneNumber);
  modem.println(";");

  delay(5000);

  Serial.println();
  Serial.println("CALLING...");

  unsigned long callStart = millis();

  while (millis() - callStart < CALL_DURATION)
  {
    while (modem.available())
    {
      Serial.write(modem.read());
    }

    delay(100);
  }

  Serial.println();
  Serial.println("Ending call...");

  modem.println("ATH");

  delay(3000);

  Serial.println("CALL ENDED");

  Serial.println("[VOICE CALL TEST] Successful.");
}

void loop()
{
}
```

---

## Result

A successful test should:

- Detect the SIM card.
- Register with the cellular network.
- Initiate the phone call.
- Establish voice communication.
- End the call successfully.

---

## Troubleshooting

### Call Does Not Start

Check:

- SIM card is active.
- SIM supports voice calls.
- Network registration is successful.
- LTE antenna is connected.
- Phone number is correct.

### No Audio

Check:

- Speaker connection.
- Microphone connection.
- Audio configuration.
- Cellular network support for voice service.

### Network Not Registered

Check:

- Cellular signal.
- SIM activation.
- Network coverage.
- Antenna connection.
- Supported network bands.

---

## Next Step

The CoreX-S3 GSM cellular functionality can now be tested using:

- **4G LTE**
- **GNSS**
- **SMS**
- **Voice Call**

These features can be combined to build complete cellular IoT applications such as GPS trackers, emergency alert systems, remote monitoring systems, and asset tracking devices.