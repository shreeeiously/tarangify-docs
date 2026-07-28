---
sidebar_position: 10
title: Web Server
description: Learn how to create web servers using ESP32 and control hardware from any web browser.
---

# Web Server

One of the most powerful features of the ESP32 is its ability to host web pages directly from the microcontroller. By combining the ESP32's built-in Wi-Fi capabilities with an HTTP server, you can create browser-based interfaces for monitoring sensors, controlling hardware, and building Internet of Things (IoT) applications. :contentReference[oaicite:0]{index=0}

In this tutorial, you will learn:

- What a Web Server is
- How HTTP communication works
- Creating a simple web page
- Hosting a website on ESP32
- Controlling LEDs from a browser
- Handling user requests
- Building interactive IoT applications

---

# What is a Web Server?

A web server is a device or application that responds to requests from web browsers.

When a user enters an address into a browser:

```text
http://192.168.1.100
```

the browser sends an HTTP request to the ESP32.

The ESP32 processes the request and returns a web page. :contentReference[oaicite:1]{index=1}

---

# How Web Communication Works

```text
Browser
    │
HTTP Request
    │
    ▼
ESP32 Web Server
    │
HTTP Response
    │
    ▼
Web Page Displayed
```

Example:

```text
Browser requests "/"
ESP32 sends HTML page
Browser displays webpage
```

---

# HTTP Basics

HTTP stands for:

```text
HyperText Transfer Protocol
```

It is the protocol used by web browsers and servers to exchange information.

Common HTTP methods:

| Method | Purpose |
|----------|----------|
| GET | Request Data |
| POST | Send Data |
| PUT | Update Data |
| DELETE | Remove Data |

For most ESP32 projects, GET requests are sufficient.

---

# WebServer Library

The ESP32 Arduino framework includes the WebServer library, which makes it easy to create web servers. It supports route handling, request processing, and HTML responses. :contentReference[oaicite:2]{index=2}

Include the required libraries:

```cpp
#include <WiFi.h>
#include <WebServer.h>
```

Create a server object:

```cpp
WebServer server(80);
```

Port 80 is the standard HTTP port.

---

# Example 1: Simple Web Page

This example creates a web page displaying a message.

```cpp
#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "YourWiFi";
const char* password = "YourPassword";

WebServer server(80);

void handleRoot()
{
  server.send(
    200,
    "text/html",
    "<h1>Hello Tarangify!</h1>");
}

void setup()
{
  Serial.begin(115200);

  WiFi.begin(
    ssid,
    password);

  while(WiFi.status()
        != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  server.on("/", handleRoot);

  server.begin();

  Serial.println(
    WiFi.localIP());
}

void loop()
{
  server.handleClient();
}
```

---

# How It Works

Register a webpage route:

```cpp
server.on("/", handleRoot);
```

Start the server:

```cpp
server.begin();
```

Process incoming requests:

```cpp
server.handleClient();
```

This function should run continuously inside `loop()`. :contentReference[oaicite:3]{index=3}

---

# Example Output

After uploading:

```text
192.168.1.105
```

Open your browser:

```text
http://192.168.1.105
```

You will see:

```text
Hello Tarangify!
```

---

# Example 2: LED Control Web Page

This example allows a user to turn an LED ON and OFF from a browser.

## Connections

| ESP32 | LED |
|---------|---------|
| GPIO 2 | LED |
| GND | LED GND |

---

## Code

```cpp
#include <WiFi.h>
#include <WebServer.h>

const int ledPin = 2;

const char* ssid = "YourWiFi";
const char* password = "YourPassword";

WebServer server(80);

void handleRoot()
{
  String html;

  html += "<h1>ESP32 LED Control</h1>";

  html +=
  "<a href='/on'>"
  "<button>ON</button>"
  "</a>";

  html +=
  "<a href='/off'>"
  "<button>OFF</button>"
  "</a>";

  server.send(
    200,
    "text/html",
    html);
}

void handleOn()
{
  digitalWrite(
    ledPin,
    HIGH);

  handleRoot();
}

void handleOff()
{
  digitalWrite(
    ledPin,
    LOW);

  handleRoot();
}

void setup()
{
  pinMode(
    ledPin,
    OUTPUT);

  WiFi.begin(
    ssid,
    password);

  while(WiFi.status()
        != WL_CONNECTED)
  {
    delay(500);
  }

  server.on("/", handleRoot);
  server.on("/on", handleOn);
  server.on("/off", handleOff);

  server.begin();
}

void loop()
{
  server.handleClient();
}
```

---

# Understanding Routes

Routes define different URLs handled by the server.

Example:

```cpp
server.on("/", handleRoot);
```

Handles:

```text
http://IP_ADDRESS/
```

Example:

```cpp
server.on("/on", handleOn);
```

Handles:

```text
http://IP_ADDRESS/on
```

Example:

```cpp
server.on("/off", handleOff);
```

Handles:

```text
http://IP_ADDRESS/off
```

---

# HTML Inside ESP32

Web pages are usually written using HTML.

Example:

```html
<h1>Welcome</h1>

<button>Click Me</button>
```

The ESP32 can generate HTML dynamically and send it to browsers.

```cpp
server.send(
  200,
  "text/html",
  html);
```

The browser automatically renders the page.

---

# Display Sensor Data on a Web Page

Sensor readings can be embedded directly into HTML.

Example:

```cpp
float temperature = 28.5;

String page;

page += "<h2>";

page += temperature;

page += " C</h2>";
```

The browser will display:

```text
28.5 C
```

This approach is commonly used in IoT dashboards.

---

# Useful WebServer Functions

## Register Route

```cpp
server.on(
  "/",
  callback);
```

## Start Server

```cpp
server.begin();
```

## Handle Requests

```cpp
server.handleClient();
```

## Send Response

```cpp
server.send(
  200,
  "text/html",
  html);
```

---

# Common HTTP Status Codes

| Code | Meaning |
|--------|--------|
| 200 | Success |
| 404 | Not Found |
| 500 | Server Error |

Example:

```cpp
server.send(
  404,
  "text/plain",
  "Page Not Found");
```

---

# Practical Applications

ESP32 web servers are commonly used for:

- Home Automation
- RGB LED Controllers
- Sensor Dashboards
- Weather Stations
- Smart Agriculture
- Data Logging Systems
- Industrial Monitoring
- Remote Device Control

Many makers use browser-based interfaces because they work on phones, tablets, and computers without requiring dedicated applications. :contentReference[oaicite:4]{index=4}

---

# Advantages of ESP32 Web Servers

- No Mobile App Required
- Accessible from Any Browser
- Easy User Interface Development
- Wireless Control
- Supports Multiple Devices

---

# Project Ideas

After learning web servers, try:

1. LED Control Dashboard
2. RGB LED Controller
3. Temperature Monitoring System
4. Battery Voltage Monitor
5. SD Card File Viewer
6. Smart Home Control Panel

---

# Summary

In this tutorial, you learned:

- What a web server is
- How HTTP communication works
- How to create a web page on ESP32
- How to handle browser requests
- How to control hardware through a browser
- How to display sensor data on a webpage
- Common WebServer library functions

In the next tutorial, we will learn about Bluetooth Communication and how the ESP32 can exchange data wirelessly with smartphones and other Bluetooth devices.

