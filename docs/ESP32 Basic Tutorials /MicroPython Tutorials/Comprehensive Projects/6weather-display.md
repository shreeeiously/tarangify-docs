---
id: weather-display
title: Internet Weather Display
sidebar_label: Internet Weather Display
sidebar_position: 19
description: Build an ESP32 MicroPython weather display that connects to Wi-Fi, retrieves weather information from an online API, and displays it on an OLED.
---

# Internet Weather Display

This project demonstrates how to build a simple **Internet Weather Display** using an ESP32 and MicroPython.

The ESP32 connects to a Wi-Fi network and periodically retrieves current weather information from the **OpenWeather API**.

The received information is then displayed on an OLED screen.

The project demonstrates several important ESP32 concepts:

- Wi-Fi networking
- HTTP requests
- REST API communication
- JSON data processing
- OLED display control
- SPI communication
- Error handling
- Periodic data updates

### Hardware Compatibility

The core logic of this project can be used with ESP32-series boards.

This example is written with **ESP32-S3 development boards** in mind. If you are using a different Tarangify board, modify the GPIO and display configuration according to the hardware available on your board.


---

## 1. Project Overview

The ESP32 performs the following operations:

```text
ESP32
  │
  ├── Connect to Wi-Fi
  │
  ├── Send request to OpenWeather API
  │
  ├── Receive JSON weather data
  │
  ├── Extract:
  │     ├── City
  │     ├── Weather condition
  │     ├── Temperature
  │     └── Humidity
  │
  └── Display information on OLED
```

The ESP32 repeats this process periodically so that the displayed information can be updated automatically.

---

## 2. Required Hardware

The following hardware is required:

| Component | Quantity |
|---|---:|
| ESP32 / ESP32-S3 Development Board | 1 |
| 128 × 128 OLED Display | 1 |
| Breadboard | 1 |
| Jumper Wires | As required |
| Wi-Fi Network | 1 |

:::tip

If your Tarangify development board already includes an OLED display, you can use the onboard display instead of an external OLED module.

:::

---

## 3. OLED Connection

This example uses an **SSD1327 128 × 128 OLED display** with an SPI interface.

The example SPI connection is:

| ESP32-S3 | OLED | Description |
|---|---|---|
| GPIO13 | SCK | SPI Clock |
| GPIO11 | MOSI | SPI Data |
| GPIO10 | CS | Chip Select |
| GPIO8 | DC | Data / Command |
| GPIO9 | RST | Reset |
| 3.3V | VCC | Power |
| GND | GND | Ground |

The exact GPIO numbers depend on your hardware.

:::warning

Do not copy these GPIO assignments blindly if you are using a different Tarangify board.

Check the board pinout and schematic before connecting the display.

:::

---

## 4. Software Requirements

You will need:

- MicroPython
- An ESP32 development board
- A MicroPython-compatible terminal such as Thonny
- An SSD1327 MicroPython display driver
- An OpenWeather API key
- A Wi-Fi network with Internet access

---

## 5. SSD1327 Display Driver

The example requires an `ssd1327.py` MicroPython driver.

Download a compatible SSD1327 MicroPython driver and upload:

```text
ssd1327.py
```

to the root directory of your ESP32 filesystem.

Your device filesystem should look similar to:

```text
/
├── boot.py
├── main.py
└── ssd1327.py
```

:::info

Make sure that the driver you use supports the interface configured in your program.

This project uses the SPI interface.

:::

---

## 6. Getting an OpenWeather API Key

This project uses the **OpenWeather API** to retrieve weather information.

Create an account on OpenWeather and generate an API key.

[OpenWeather](https://openweathermap.org/)

After obtaining your API key, add it to:

```python
API_KEY = "YOUR_API_KEY"
```

Never publish your real API key in a public GitHub repository or documentation page.


Always replace it with a placeholder such as:

```python
API_KEY = "YOUR_API_KEY"
```

New API keys may take some time to become active.

If the API returns an authentication error immediately after creating a key, wait before testing again.

---

## 7. Project Configuration

Before uploading the program, modify these settings:

```python
WIFI_SSID = "YOUR_WIFI_NAME"
WIFI_PASSWORD = "YOUR_WIFI_PASSWORD"

API_KEY = "YOUR_API_KEY"

LOCATION = "Mumbai"
```

For example:

```python
WIFI_SSID = "MyWiFi"
WIFI_PASSWORD = "mypassword"

API_KEY = "YOUR_API_KEY"

LOCATION = "Mumbai"
```

You can change the city to another location.

For example:

```python
LOCATION = "Delhi"
```

or:

```python
LOCATION = "Bengaluru"
```

---

# 8. Complete MicroPython Program

Create a file named:

```text
main.py
```

and upload it to the ESP32.

```python
import time
import network
import urequests

from machine import Pin, SPI

import ssd1327


# ============================================================
# Wi-Fi Configuration
# ============================================================

WIFI_SSID = "YOUR_WIFI_NAME"
WIFI_PASSWORD = "YOUR_WIFI_PASSWORD"


# ============================================================
# OpenWeather API Configuration
# ============================================================

API_KEY = "YOUR_API_KEY"

# City to display
LOCATION = "Mumbai"

# OpenWeather API
API_URL = (
    "http://api.openweathermap.org/data/2.5/weather"
    "?appid={}&q={}&units=metric"
)


# ============================================================
# Update Interval
# ============================================================

# 1800 seconds = 30 minutes
UPDATE_INTERVAL = 1800


# ============================================================
# OLED Configuration
# ============================================================

TEXT_BRIGHTNESS = 8


# ============================================================
# SPI Pin Configuration
# ============================================================

SCK_PIN = 13
MOSI_PIN = 11
CS_PIN = 10
DC_PIN = 8
RST_PIN = 9


# ============================================================
# Initialize SPI
# ============================================================

spi = SPI(
    1,
    baudrate=10000000,
    sck=Pin(SCK_PIN),
    mosi=Pin(MOSI_PIN)
)


# ============================================================
# Initialize OLED
# ============================================================

try:

    oled = ssd1327.SSD1327_SPI(
        128,
        128,
        spi,
        dc=Pin(DC_PIN),
        res=Pin(RST_PIN),
        cs=Pin(CS_PIN)
    )

    print("OLED initialized successfully.")

except Exception as e:

    print("OLED initialization failed:")
    print(e)

    while True:
        time.sleep(1)


# ============================================================
# Wi-Fi Connection
# ============================================================

def connect_wifi():

    """Connect to the configured Wi-Fi network."""

    wlan = network.WLAN(network.STA_IF)

    wlan.active(True)

    if not wlan.isconnected():

        print("Connecting to Wi-Fi...")
        print("Network:", WIFI_SSID)

        oled.fill(0)

        oled.text("Connecting", 5, 20, TEXT_BRIGHTNESS)
        oled.text("to WiFi...", 5, 40, TEXT_BRIGHTNESS)

        oled.show()

        wlan.connect(
            WIFI_SSID,
            WIFI_PASSWORD
        )

        timeout = 15

        start_time = time.time()

        while (
            not wlan.isconnected()
            and
            (time.time() - start_time) < timeout
        ):

            time.sleep(1)

            print(".", end="")


    if wlan.isconnected():

        ip_address = wlan.ifconfig()[0]

        print()
        print("Wi-Fi connected!")
        print("IP Address:", ip_address)

        oled.fill(0)

        oled.text(
            "WiFi Connected",
            5,
            20,
            TEXT_BRIGHTNESS
        )

        oled.text(
            "IP:",
            5,
            40,
            TEXT_BRIGHTNESS
        )

        oled.text(
            ip_address,
            5,
            55,
            TEXT_BRIGHTNESS
        )

        oled.show()

        time.sleep(2)

        return True


    else:

        print()
        print("Wi-Fi connection failed.")

        oled.fill(0)

        oled.text(
            "WiFi Failed!",
            5,
            30,
            TEXT_BRIGHTNESS
        )

        oled.show()

        return False


# ============================================================
# Get Weather Data
# ============================================================

def get_weather():

    """Fetch current weather information from OpenWeather."""

    url = API_URL.format(
        API_KEY,
        LOCATION
    )

    print()
    print("Requesting weather data...")
    print("Location:", LOCATION)

    response = None

    try:

        response = urequests.get(url)

        print("HTTP Status:", response.status_code)

        if response.status_code == 200:

            weather_data = response.json()

            # Extract information from JSON response

            city = weather_data["name"]

            weather = weather_data["weather"][0]["main"]

            temperature = weather_data["main"]["temp"]

            humidity = weather_data["main"]["humidity"]

            return (
                city,
                weather,
                temperature,
                humidity
            )

        else:

            error = "HTTP {}".format(
                response.status_code
            )

            print("API Error:", error)

            return (
                None,
                error,
                "",
                ""
            )

    except Exception as e:

        print("Request error:")
        print(e)

        return (
            None,
            "Request Error",
            "",
            ""
        )

    finally:

        if response is not None:

            response.close()


# ============================================================
# Display Weather
# ============================================================

def display_weather(
    city,
    weather,
    temperature,
    humidity
):

    """Display weather information on OLED."""

    oled.fill(0)

    # City

    oled.text(
        "City:",
        5,
        10,
        TEXT_BRIGHTNESS
    )

    oled.text(
        str(city),
        5,
        25,
        TEXT_BRIGHTNESS
    )


    # Weather condition

    oled.text(
        "Weather:",
        5,
        45,
        TEXT_BRIGHTNESS
    )

    oled.text(
        str(weather),
        5,
        60,
        TEXT_BRIGHTNESS
    )


    # Temperature

    oled.text(
        "Temp:",
        5,
        80,
        TEXT_BRIGHTNESS
    )

    oled.text(
        "{} C".format(temperature),
        50,
        80,
        TEXT_BRIGHTNESS
    )


    # Humidity

    oled.text(
        "Hum:",
        5,
        100,
        TEXT_BRIGHTNESS
    )

    oled.text(
        "{} %".format(humidity),
        50,
        100,
        TEXT_BRIGHTNESS
    )

    oled.show()


    print()
    print("Weather Display Updated")
    print("City:", city)
    print("Weather:", weather)
    print("Temperature:", temperature, "C")
    print("Humidity:", humidity, "%")


# ============================================================
# Display Error
# ============================================================

def display_error(
    message,
    detail
):

    """Display an error message."""

    oled.fill(0)

    oled.text(
        "Error:",
        5,
        20,
        TEXT_BRIGHTNESS
    )

    oled.text(
        str(message),
        5,
        40,
        TEXT_BRIGHTNESS
    )

    oled.text(
        str(detail),
        5,
        60,
        TEXT_BRIGHTNESS
    )

    oled.show()


# ============================================================
# Main Program
# ============================================================

def main():

    # Connect to Wi-Fi

    if not connect_wifi():

        print("Unable to connect to Wi-Fi.")

        return


    while True:

        print()
        print("====================")
        print("Fetching weather...")
        print("====================")


        # Display loading message

        oled.fill(0)

        oled.text(
            "Fetching...",
            5,
            30,
            TEXT_BRIGHTNESS
        )

        oled.show()


        # Get weather information

        city, weather, temperature, humidity = (
            get_weather()
        )


        # Check result

        if city is not None:

            display_weather(
                city,
                weather,
                temperature,
                humidity
            )

        else:

            display_error(
                "API Error",
                weather
            )


        print()
        print(
            "Waiting {} seconds...".format(
                UPDATE_INTERVAL
            )
        )


        # Wait before next update

        time.sleep(
            UPDATE_INTERVAL
        )


# ============================================================
# Start Program
# ============================================================

if __name__ == "__main__":

    main()
```

---

# 9. Code Explanation

## 9.1 Import Libraries

The program imports the required MicroPython modules:

```python
import time
import network
import urequests

from machine import Pin, SPI

import ssd1327
```

### `time`

Used for delays and timing.

### `network`

Used to connect the ESP32 to Wi-Fi.

### `urequests`

Used to send HTTP requests to the weather API.

### `Pin` and `SPI`

Used to control the ESP32 GPIO pins and SPI interface.

### `ssd1327`

Used to control the OLED display.

---

## 9.2 Wi-Fi Configuration

The Wi-Fi information is configured using:

```python
WIFI_SSID = "YOUR_WIFI_NAME"
WIFI_PASSWORD = "YOUR_WIFI_PASSWORD"
```

Replace these values with your Wi-Fi credentials.

For example:

```python
WIFI_SSID = "HomeWiFi"
WIFI_PASSWORD = "mypassword"
```

---

## 9.3 OpenWeather Configuration

The API key is stored in:

```python
API_KEY = "YOUR_API_KEY"
```

The city is configured using:

```python
LOCATION = "Mumbai"
```

The API URL uses:

```text
units=metric
```

so temperature is returned in Celsius.

---

## 9.4 Connecting to Wi-Fi

The following function handles the Wi-Fi connection:

```python
def connect_wifi():
```

The ESP32 creates a station interface:

```python
wlan = network.WLAN(network.STA_IF)
```

The interface is activated:

```python
wlan.active(True)
```

The ESP32 then connects to the configured network:

```python
wlan.connect(
    WIFI_SSID,
    WIFI_PASSWORD
)
```

The program waits until the connection succeeds or the timeout is reached.

---

## 9.5 Getting the IP Address

After successfully connecting to Wi-Fi:

```python
ip_address = wlan.ifconfig()[0]
```

The IP address is displayed on the OLED.

For example:

```text
WiFi Connected

IP:
192.168.1.25
```

---

# 10. Fetching Weather Data

The weather API URL is generated using:

```python
url = API_URL.format(
    API_KEY,
    LOCATION
)
```

The ESP32 sends an HTTP GET request:

```python
response = urequests.get(url)
```

The API returns JSON data.

For example, the response contains information about:

- City
- Weather condition
- Temperature
- Humidity

The program extracts the required values:

```python
city = weather_data["name"]

weather = weather_data["weather"][0]["main"]

temperature = weather_data["main"]["temp"]

humidity = weather_data["main"]["humidity"]
```

The original Waveshare example uses the same OpenWeather current-weather approach and extracts city, weather condition, temperature, and humidity from the JSON response. :contentReference[oaicite:1]{index=1}

---

# 11. Displaying the Weather

The `display_weather()` function updates the OLED.

The display is first cleared:

```python
oled.fill(0)
```

The city is displayed:

```python
oled.text(
    str(city),
    5,
    25,
    TEXT_BRIGHTNESS
)
```

The weather condition is displayed:

```python
oled.text(
    str(weather),
    5,
    60,
    TEXT_BRIGHTNESS
)
```

The temperature is displayed in Celsius:

```python
oled.text(
    "{} C".format(temperature),
    50,
    80,
    TEXT_BRIGHTNESS
)
```

Humidity is displayed as a percentage:

```python
oled.text(
    "{} %".format(humidity),
    50,
    100,
    TEXT_BRIGHTNESS
)
```

Finally:

```python
oled.show()
```

updates the physical OLED screen.

---

# 12. Error Handling

The program checks whether the API request was successful.

A successful request returns:

```text
HTTP 200
```

If another HTTP status code is returned, the program displays an error.

For example:

```text
Error:

API Error

HTTP 401
```

A `401` response generally indicates an authentication or API-key problem.

:::tip

If you have just created an OpenWeather API key and receive an authentication error, make sure the key is correct and active before troubleshooting the MicroPython code.

:::

---

# 13. Automatic Updates

The weather information is periodically updated.

The interval is configured using:

```python
UPDATE_INTERVAL = 1800
```

Since:

```text
1800 seconds = 30 minutes
```

the ESP32 requests new weather information every 30 minutes.

You can change this value for testing.

For example:

```python
UPDATE_INTERVAL = 60
```

updates the weather every minute.

:::warning

For normal use, avoid making API requests excessively frequently. Follow the limits and terms of the weather API service you are using.

:::

---

# 14. Celsius and Fahrenheit

The current API configuration uses:

```text
units=metric
```

This returns temperature in Celsius.

To request Fahrenheit, change:

```python
API_URL = (
    "http://api.openweathermap.org/data/2.5/weather"
    "?appid={}&q={}&units=metric"
)
```

to:

```python
API_URL = (
    "http://api.openweathermap.org/data/2.5/weather"
    "?appid={}&q={}&units=imperial"
)
```

You should also change the display label from:

```text
C
```

to:

```text
F
```

---

# 15. Testing the Project

Follow these steps to test the weather display.

### Step 1: Connect the OLED

Connect the OLED according to the pinout of your development board.

### Step 2: Install MicroPython

Make sure MicroPython is installed on your ESP32.

### Step 3: Upload the Driver

Upload:

```text
ssd1327.py
```

to the ESP32.

### Step 4: Configure Wi-Fi

Change:

```python
WIFI_SSID = "YOUR_WIFI_NAME"
WIFI_PASSWORD = "YOUR_WIFI_PASSWORD"
```

to your actual Wi-Fi credentials.

### Step 5: Add Your API Key

Change:

```python
API_KEY = "YOUR_API_KEY"
```

to your own OpenWeather API key.

### Step 6: Select a City

For example:

```python
LOCATION = "Mumbai"
```

### Step 7: Upload `main.py`

Upload the program to the ESP32.

### Step 8: Run the Program

Run `main.py`.

The OLED should first display:

```text
Connecting
to WiFi...
```

After a successful connection:

```text
WiFi Connected

IP:
192.168.x.x
```

The ESP32 then retrieves the weather information.

The final display should contain information similar to:

```text
City:
Mumbai

Weather:
Clouds

Temp:
29 C

Hum:
72 %
```

The exact values depend on the current weather returned by the API.

---

# 16. Troubleshooting

## Wi-Fi Does Not Connect

Check:

- Wi-Fi SSID
- Wi-Fi password
- Wi-Fi availability
- ESP32 antenna/environment
- Serial Monitor output

Make sure:

```python
WIFI_SSID = "YOUR_WIFI_NAME"
```

and:

```python
WIFI_PASSWORD = "YOUR_WIFI_PASSWORD"
```

contain the correct values.

---

## OLED Does Not Work

Check:

- VCC connection
- GND connection
- SPI wiring
- SCK pin
- MOSI pin
- CS pin
- DC pin
- Reset pin
- SSD1327 driver

Also verify that the display is actually an **SSD1327-compatible OLED**.

---

## API Error

Check:

```python
API_KEY = "YOUR_API_KEY"
```

Make sure your API key is correct and active.

Also verify:

```python
LOCATION = "Mumbai"
```

contains a valid location.

---

## `ssd1327` Module Not Found

If the terminal reports:

```text
ImportError: no module named 'ssd1327'
```

make sure the file:

```text
ssd1327.py
```

has been uploaded to the ESP32 filesystem.

The file should be located alongside `main.py`.

---

# 17. What You Learned

After completing this project, you should understand how to:

- Connect an ESP32 to Wi-Fi
- Send HTTP requests
- Communicate with an online API
- Process JSON data
- Read weather information
- Control an OLED display
- Use SPI peripherals
- Display sensor/API data
- Handle communication errors
- Periodically update information

---

# 18. Project Architecture

The complete project can be summarized as:

```text
              ┌─────────────────┐
              │     ESP32-S3    │
              └────────┬────────┘
                       │
                 Wi-Fi Connection
                       │
                       ▼
              ┌─────────────────┐
              │    Internet     │
              └────────┬────────┘
                       │
                 HTTP Request
                       │
                       ▼
              ┌─────────────────┐
              │ OpenWeather API │
              └────────┬────────┘
                       │
                  JSON Response
                       │
                       ▼
              ┌─────────────────┐
              │    MicroPython  │
              │  JSON Processing│
              └────────┬────────┘
                       │
                Weather Data
                       │
                       ▼
              ┌─────────────────┐
              │   OLED Display  │
              │                 │
              │ City: Mumbai    │
              │ Weather: Clouds │
              │ Temp: 29 C      │
              │ Hum: 72 %       │
              └─────────────────┘
```

---

# 19. Further Improvements

Once the basic weather display is working, you can extend the project with additional features.

### Add Weather Icons

Display different icons for:

- Sunny
- Cloudy
- Rain
- Storm
- Snow

### Add Multiple Cities

Allow the user to switch between multiple cities.

### Add a User Button

Use a button to switch between cities.

### Add an RGB LED

Use the RGB LED to indicate the weather condition.

For example:

```text
Sunny  → RGB indication
Rainy  → RGB indication
Cloudy → RGB indication
Storm  → RGB indication
```

### Add Automatic Brightness

Use an LDR and ADC input to automatically adjust the OLED brightness based on ambient light.

### Add a Clock

Use NTP to synchronize the ESP32's time over the Internet and display:

```text
Time
Date
Temperature
Humidity
Weather
```

---

# 20. Related Tutorials

Before continuing with more advanced IoT projects, it is recommended to understand:

- [SPI Communication](../8spi-communication)
- [Wi-Fi Networking Basics](../9wifi-networking-basics)
- [Web Server](../10web-server)
- [ADC Analog Input](4analog-input)

---

## Next Step

You have now built an Internet-connected ESP32 weather display using MicroPython.

Try modifying the project to display additional information or interact with other peripherals on your Tarangify development board.

[**← Back to Comprehensive Projects**](./0fun-project)