---
sidebar_position: 5
---

# 3. Nano SIM Card

## Introduction

This example demonstrates how to detect and verify a Nano SIM card installed in the Tarangify CoreX-S3 GSM development board.

The CoreX-S3 GSM uses the **SIMCom A7672X 4G LTE module** for cellular communication. The Nano SIM card is connected directly to the A7672X module, while the ESP32-S3 communicates with the cellular module through a serial UART interface.

The SIM card is required for cellular features such as:

- 4G LTE data communication
- SMS messaging
- Voice calls
- Network registration

This example uses AT commands to communicate with the A7672X module and check whether a SIM card is available.

---

## What You Will Learn

By completing this example, you will learn how to:

- Communicate with the SIMCom A7672X module.
- Send AT commands from the ESP32-S3.
- Check whether a Nano SIM card is detected.
- Read the SIM card status.
- Check the cellular network registration status.
- Verify that the cellular module is ready for communication.

---

## Hardware Used

| Component | Description |
|------------|-------------|
| ESP32-S3 Development Board | Tarangify CoreX-S3 GSM |
| Cellular Module | SIMCom A7672X |
| Nano SIM Card | Active SIM card |
| LTE Antenna | Connected to the LTE antenna connector |
| USB Type-C Cable | Programming and power |

---

## Nano SIM Slot

The CoreX-S3 GSM uses a standard:

```text
Nano SIM (4FF)
```

Insert the Nano SIM card into the onboard SIM card slot in the correct orientation.

The SIM card is used by the A7672X module to authenticate with the cellular network.

---

## SIM Card Requirements

For this test, use a Nano SIM card that:

- Is correctly activated.
- Supports cellular service.
- Has an active network connection.
- Does not require an unknown SIM PIN.
- Supports the cellular services required for the application.

A SIM card with an active data plan is required when testing mobile data connectivity.

---

## Cellular Module

The CoreX-S3 GSM uses the:

```text
SIMCom A7672X
```

The A7672X is responsible for:

- SIM card communication
- Cellular network registration
- 4G LTE communication
- SMS
- Voice calls
- GNSS functionality

The ESP32-S3 sends AT commands to the A7672X to control and monitor these functions.

---

## UART Communication

The ESP32-S3 communicates with the A7672X through a UART interface.

The UART pins used for the cellular module are:

| Signal      | Connection |
| ----------- | ---------- |
| ESP32-S3 TX | A7672X RX  |
| ESP32-S3 RX | A7672X TX  |
| GND         | GND        |

:::warning
 Important

Use the exact UART GPIO numbers specified in the CoreX-S3 GSM schematic.

Do not assign GPIO10, GPIO11, or GPIO13 to the cellular UART because these pins are internally connected to the A7672X module.
:::

---

## Required Library

No additional library is required for this example.

The following Arduino library is used:

- HardwareSerial

`HardwareSerial` is included with the ESP32 Arduino Core.

---

## How to Run the Example

### Step 1: Insert the Nano SIM

Insert an activated Nano SIM card into the onboard SIM card slot.

Make sure the SIM card is inserted in the correct orientation.

### Step 2: Connect the LTE Antenna

Connect the appropriate LTE antenna to the LTE antenna connector on the board.

### Step 3: Open Arduino IDE

Launch Arduino IDE and make sure the ESP32 board package is installed.

### Step 4: Select the Board

Navigate to:

```text
Tools → Board → ESP32 Arduino → ESP32S3 Dev Module
```

### Step 5: Select the COM Port

Connect the CoreX-S3 GSM to your computer using a USB Type-C cable.

Navigate to:

```text
Tools → Port → COMx
```

Select the COM port corresponding to the board.

### Step 6: Upload the Code

Copy the example code into a new Arduino sketch.

Replace the UART pin definitions with the correct CoreX-S3 GSM UART pins if required.

Click the **Upload** button.

### Step 7: Open Serial Monitor

Open the Serial Monitor and select:

```text
115200 baud
```

The ESP32-S3 will communicate with the A7672X and display the SIM status.

---

## Expected Behaviour

When the board starts, it communicates with the A7672X using AT commands.

The test checks:

1. Whether the A7672X is responding.
2. Whether a SIM card is detected.
3. Whether the SIM is ready.
4. Whether the module is registered on the cellular network.

---

## AT Commands Used

| AT Command | Purpose                                 |
| ---------- | ---------------------------------------- |
| `AT`       | Checks whether the A7672X is responding |
| `AT+CPIN?` | Checks SIM card status                  |
| `AT+CSQ`   | Checks signal strength                  |
| `AT+CREG?` | Checks network registration             |
| `AT+COPS?` | Reads the current network operator      |

---

## Serial Monitor Output

### SIM Card Detected

```text
[NANO SIM TEST] Initializing...

A7672X : OK
SIM Status : READY
Signal Strength : 20
Network Registration : REGISTERED
Operator : Airtel

[NANO SIM TEST] Successful.
```

### SIM Card Not Detected

```text
[NANO SIM TEST] Initializing...

A7672X : OK
SIM Status : SIM NOT INSERTED

[NANO SIM TEST] Failed.
```

### SIM PIN Required

```text
[NANO SIM TEST] Initializing...

A7672X : OK
SIM Status : SIM PIN REQUIRED

Please disable the SIM PIN or enter the required SIM PIN.
```

---

## Arduino Code

```cpp
/*
  Tarangify CoreX-S3 GSM
  Nano SIM Card Test

  This example checks:
  1. A7672X module response
  2. SIM card status
  3. Signal strength
  4. Network registration
  5. Network operator

  IMPORTANT:
  Replace MODEM_RX and MODEM_TX with the
  actual UART GPIO pins of the CoreX-S3 GSM.
*/

#include <HardwareSerial.h>

// Replace these with the actual CoreX-S3 GSM UART pins
#define MODEM_RX YOUR_MODEM_RX_PIN
#define MODEM_TX YOUR_MODEM_TX_PIN

#define MODEM_BAUD 115200

HardwareSerial modem(1);

void sendATCommand(const char *command)
{
  Serial.print("\n>> ");
  Serial.println(command);

  modem.println(command);

  unsigned long startTime = millis();

  while (millis() - startTime < 2000)
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
  Serial.println("[NANO SIM TEST] Initializing...");

  modem.begin(
    MODEM_BAUD,
    SERIAL_8N1,
    MODEM_RX,
    MODEM_TX
  );

  delay(2000);

  // Check A7672X response
  sendATCommand("AT");

  // Check SIM card
  sendATCommand("AT+CPIN?");

  // Check signal strength
  sendATCommand("AT+CSQ");

  // Check network registration
  sendATCommand("AT+CREG?");

  // Check network operator
  sendATCommand("AT+COPS?");
}

void loop()
{
}
```

---

## Understanding the SIM Status

The command:

```text
AT+CPIN?
```

is used to check the SIM card status.

A successful SIM card detection normally returns:

```text
+CPIN: READY
```

This means that the SIM card has been detected and is ready to be used.

---

## Understanding Signal Strength

The command:

```text
AT+CSQ
```

returns the cellular signal strength.

For example:

```text
+CSQ: 20,99
```

The first value represents the received signal strength.

Generally:

| CSQ   | Signal    |
| ----- | --------- |
| 0–9   | Very Weak |
| 10–14 | Weak      |
| 15–19 | Fair      |
| 20–24 | Good      |
| 25–31 | Very Good |
| 99    | Unknown   |

---

## Understanding Network Registration

The command:

```text
AT+CREG?
```

can be used to check whether the module is registered on the cellular network.

A typical response is:

```text
+CREG: 0,1
```

where:

```text
1 = Registered on the home network
```

Another possible successful response is:

```text
+CREG: 0,5
```

where:

```text
5 = Registered while roaming
```

---

## Troubleshooting

### SIM Not Detected

If the Serial Monitor shows:

```text
SIM NOT INSERTED
```

check:

- Nano SIM orientation.
- SIM card seating.
- SIM card compatibility.
- SIM card contacts.
- A7672X power supply.

### SIM PIN Required

If the response is:

```text
+CPIN: SIM PIN
```

the SIM card is protected by a PIN.

Disable the SIM PIN using a phone or use the appropriate AT command to enter the PIN.

### No Network

If the SIM is detected but the module is not registered:

- Check the LTE antenna.
- Move the board to an area with better cellular coverage.
- Verify that the SIM is active.
- Check whether the network supports the A7672X bands.
- Check the signal strength using `AT+CSQ`.

---

## Result

After completing this test, the Nano SIM slot and cellular module should be verified as operational.

A successful test should confirm:

- A7672X responds to AT commands.
- Nano SIM is detected.
- SIM status is `READY`.
- Cellular signal is available.
- The module can register with the network.

---

## Next Step

After successfully detecting the Nano SIM card, continue with the **4G LTE Test** to establish a cellular data connection using the SIMCom A7672X module.