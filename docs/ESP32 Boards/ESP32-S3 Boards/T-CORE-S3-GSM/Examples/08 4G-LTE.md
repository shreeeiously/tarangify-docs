---
sidebar_position: 10
---

# 6. 4G LTE

## Introduction

This example demonstrates how to initialize the **SIMCom A7672X 4G LTE module** on the Tarangify CoreX-S3 GSM development board and check its cellular network connection.

The ESP32-S3 communicates with the A7672X module through UART using AT commands.

The A7672X provides 4G LTE Cat-1 connectivity, allowing the CoreX-S3 GSM to communicate with remote servers and IoT cloud platforms without relying on Wi-Fi.

This example verifies that the cellular module is responding, the SIM card is ready, a cellular network is available, and the module is registered on the network.

---

## What You Will Learn

By completing this example, you will learn how to:

- Communicate with the A7672X module.
- Check the cellular module status.
- Check the SIM card status.
- Check cellular signal strength.
- Check network registration.
- Read the registered network operator.
- Verify 4G LTE connectivity.

---

## Hardware Used

| Component | Description |
|------------|-------------|
| ESP32-S3 Development Board | Tarangify CoreX-S3 GSM |
| Cellular Module | SIMCom A7672X |
| Nano SIM Card | Active cellular SIM |
| LTE Antenna | Connected to LTE antenna connector |
| USB Type-C Cable | Programming and power |

---

## LTE Module

The CoreX-S3 GSM uses the:

```text
SIMCom A7672X
```

The A7672X provides:

- 4G LTE Cat-1 connectivity
- Cellular data
- SMS
- Voice calls
- GNSS
- Network management

---

## UART Communication

The ESP32-S3 communicates with the A7672X using UART.

| Signal      | Connection |
| ----------- | ---------- |
| ESP32-S3 TX | A7672X RX  |
| ESP32-S3 RX | A7672X TX  |
| GND         | GND        |

:::warning Important

Replace `MODEM_RX` and `MODEM_TX` with the actual UART GPIO pins used by the CoreX-S3 GSM.
:::

---

## Required Library

No additional library is required.

The example uses:

- HardwareSerial

The library is included with the ESP32 Arduino core.

---

## How to Run the Example

### Step 1: Insert the SIM Card

Insert an activated Nano SIM card into the onboard SIM slot.

### Step 2: Connect the LTE Antenna

Connect the LTE antenna to the appropriate antenna connector.

### Step 3: Open Arduino IDE

Launch Arduino IDE and make sure the ESP32 board package is installed.

### Step 4: Select the Board

Navigate to:

```text
Tools → Board → ESP32 Arduino → ESP32S3 Dev Module
```

### Step 5: Select the COM Port

Connect the board using USB Type-C.

Navigate to:

```text
Tools → Port → COMx
```

Select the appropriate port.

### Step 6: Upload the Code

Copy the example code into a new Arduino sketch.

Set the correct modem UART pins and upload the program.

### Step 7: Open Serial Monitor

Open Serial Monitor and select:

```text
115200 baud
```

---

## Expected Behaviour

The ESP32-S3 will communicate with the A7672X and check:

1. Modem response.
2. SIM card status.
3. Signal strength.
4. Network registration.
5. Network operator.

---

## AT Commands Used

| AT Command | Purpose                      |
| ---------- | ----------------------------- |
| `AT`       | Check modem response         |
| `AT+CPIN?` | Check SIM status             |
| `AT+CSQ`   | Check signal strength        |
| `AT+CREG?` | Check network registration   |
| `AT+COPS?` | Check network operator       |
| `AT+CPSI?` | Check current network system |

---

## Serial Monitor Output

```text
[4G LTE TEST] Initializing...

A7672X : OK
SIM Status : READY
Signal Strength : 20
Network Registration : REGISTERED
Operator : Airtel

Network Information:
LTE CAT-1

[4G LTE TEST] Successful.
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
  Serial.println("[4G LTE TEST] Initializing...");

  modem.begin(
    MODEM_BAUD,
    SERIAL_8N1,
    MODEM_RX,
    MODEM_TX
  );

  delay(3000);

  sendCommand("AT");

  sendCommand("AT+CPIN?");

  sendCommand("AT+CSQ");

  sendCommand("AT+CREG?");

  sendCommand("AT+COPS?");

  sendCommand("AT+CPSI?");
}

void loop()
{
}
```

---

## Result

A successful test confirms that:

- The A7672X responds.
- The SIM card is detected.
- Cellular signal is available.
- The module is registered.
- The cellular network can be identified.

---
