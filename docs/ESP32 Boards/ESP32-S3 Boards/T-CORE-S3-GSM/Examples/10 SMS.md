---
sidebar_position: 12
---

# 8. SMS

## Introduction

This example demonstrates how to send an SMS using the **SIMCom A7672X 4G LTE module** on the Tarangify CoreX-S3 GSM development board.

The A7672X provides SMS functionality through the cellular network.

The ESP32-S3 communicates with the A7672X through UART and sends AT commands to configure and transmit an SMS.

This example is useful for applications such as:

- IoT alerts
- Security notifications
- Remote monitoring
- Emergency messages
- Sensor alarms
- Equipment status notifications

---

## What You Will Learn

By completing this example, you will learn how to:

- Configure the A7672X for SMS.
- Select text mode.
- Specify a destination phone number.
- Send an SMS.
- Monitor the SMS transmission response.

---

## Hardware Used

| Component | Description |
|------------|-------------|
| ESP32-S3 Development Board | Tarangify CoreX-S3 GSM |
| Cellular Module | SIMCom A7672X |
| Nano SIM Card | Active SIM with SMS service |
| LTE Antenna | Connected to LTE antenna connector |
| USB Type-C Cable | Programming and power |

---

## SIM Card Requirements

The SIM card must:

- Be inserted correctly.
- Be activated.
- Be registered on the cellular network.
- Support SMS service.

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

### Step 6: Set the Phone Number

Change:

```cpp
const char *phoneNumber = "+91XXXXXXXXXX";
```

to the destination phone number.

### Step 7: Upload the Code

Upload the program to the CoreX-S3 GSM.

### Step 8: Open Serial Monitor

Set:

```text
115200 baud
```

---

## AT Commands Used

| AT Command  | Purpose              |
| ----------- | --------------------- |
| `AT`        | Check modem          |
| `AT+CPIN?`  | Check SIM            |
| `AT+CREG?`  | Check network        |
| `AT+CMGF=1` | Enable SMS text mode |
| `AT+CMGS`   | Send SMS              |

---

## Expected Behaviour

The board will:

1. Initialize the A7672X.
2. Check the SIM card.
3. Check network registration.
4. Enable SMS text mode.
5. Send the specified message.
6. Display the result in Serial Monitor.

---

## Serial Monitor Output

```text
[SMS TEST] Initializing...

A7672X : OK
SIM Status : READY
Network : REGISTERED

SMS Mode : TEXT

Sending SMS...

SMS : SENT

[SMS TEST] Successful.
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
  Serial.println("[SMS TEST] Initializing...");

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

  sendCommand("AT+CMGF=1");

  Serial.println("\nSending SMS...");

  modem.print("AT+CMGS=\"");
  modem.print(phoneNumber);
  modem.println("\"");

  delay(1000);

  modem.print("Hello from Tarangify CoreX-S3 GSM!");

  modem.write(26);

  unsigned long startTime = millis();

  while (millis() - startTime < 10000)
  {
    while (modem.available())
    {
      Serial.write(modem.read());
    }
  }

  Serial.println("\n[SMS TEST] Complete.");
}

void loop()
{
}
```

---

## Result

If the SMS is successfully sent, the Serial Monitor should return:

```text
OK
```

and the destination phone should receive the message.

---

## Troubleshooting

If the SMS is not sent:

- Check the SIM card.
- Check network registration.
- Check cellular signal.
- Verify the destination number.
- Ensure the SIM supports SMS.
- Check the LTE antenna.
- Make sure the modem is powered correctly.

---