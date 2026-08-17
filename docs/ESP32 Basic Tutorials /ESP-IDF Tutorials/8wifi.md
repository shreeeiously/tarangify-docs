---
id: wifi
title: Wi-Fi Programming
sidebar_label: Wi-Fi Programming
sidebar_position: 9
description: Learn the ESP32 Wi-Fi programming model and stand up a SoftAP with ESP-IDF.
---

# Section 8: Wi-Fi Programming

This section covers what ESP32's built-in Wi-Fi can do, how ESP-IDF's event-driven Wi-Fi programming model fits together, and walks through a working example that turns an ESP32 board into its own Wi-Fi access point.

:::info

Make sure you've completed [**Section 1: Set Up Environment**](./esp-idf-installation) through [**Section 7: Drive Peripheral**](./peripheral) before starting this section.

:::

---

## 1. What ESP32 Wi-Fi Can Do

Most chips in the ESP32 family include built-in Wi-Fi, which is a big part of what makes them a popular choice for IoT projects. A few variants — generally chips aimed at high-performance compute or specialized use cases — skip Wi-Fi entirely, so it's worth double-checking your specific chip's capabilities before planning around it.

**Basics:** most ESP32 chips support 2.4 GHz 802.11b/g/n, and newer variants (like the ESP32-C6) add 5 GHz and Wi-Fi 6 support.

**Operating modes:**

- **Station (STA)** — the chip connects to an existing Wi-Fi network as a client.
- **SoftAP (AP)** — the chip creates its own Wi-Fi network for other devices to join.
- **STA+AP** — both at once: connected to your router while also broadcasting its own hotspot.
- **Sniffer** — passive monitor mode for capturing and inspecting Wi-Fi traffic.

**Security:** WPA2, WPA3, and enterprise-grade authentication are all supported, depending on chip and configuration.

**Performance:** typical maximum throughput is around 150 Mbps (higher on some newer chips), with various power-saving modes available for battery-powered use cases.

---

## 2. The Wi-Fi Programming Model

ESP-IDF's Wi-Fi stack is **event-driven**. Think of the Wi-Fi driver as a black box that doesn't know anything about your application code, the TCP/IP stack, or your tasks — it just responds to API calls and emits events.

Your application calls Wi-Fi driver functions to initialize and configure Wi-Fi. The driver does its work and reports back by posting events, rather than blocking your code waiting for things to happen.

Those events flow through ESP-IDF's `esp_event` library: the Wi-Fi driver posts to the **default event loop**, and your application subscribes to specific events by registering callback handlers with `esp_event_handler_register()` (or the instance-based variant). Separately, the `esp_netif` component also listens to these same events to provide sensible default behavior automatically — for instance, kicking off a DHCP client the moment a Station connects to an access point.

---

## 3. The General Shape of Wi-Fi Programming

Whether you're setting up Station mode or AP mode, the flow breaks down into three phases.

### Initialization

1. Initialize the underlying TCP/IP stack (LwIP) and the network interface layer (`esp_netif`).
2. Create the default event loop, so Wi-Fi and network events have somewhere to go.
3. Create the default network interface(s) you need — a STA interface, an AP interface, or both.
4. Initialize the Wi-Fi driver itself with `esp_wifi_init()`. This spins up the internal tasks that keep the radio and protocol stack running.

### Configuration

1. Fill in a `wifi_config_t` struct with your connection parameters — SSID, password, auth mode, and so on.
2. Set the operating mode with `esp_wifi_set_mode()`.
3. Apply the configuration with `esp_wifi_set_config()`.

### Connecting and Handling Events

1. Start Wi-Fi with `esp_wifi_start()`.
2. In STA mode, kick off the connection with `esp_wifi_connect()`.
3. Handle the asynchronous events that follow — connected, disconnected, got an IP address — in your registered event callback(s).

---

## 4. Example: A Simple SoftAP

This example configures an ESP32 board as its own Wi-Fi access point, broadcasting a network named `esp32_s3_test` that other devices can find and join.

1. Create a new project (see [Section 3](./create-project#2-create-a-project-from-scratch) if you need a refresher).
2. Replace `main/main.c` with:

```c
#include <stdio.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "esp_wifi.h"
#include "esp_log.h"
#include "string.h"

static const char *TAG = "wifi example";

#define ESP_WIFI_SSID "esp32_s3_test"
#define ESP_WIFI_PASS "12345678"
#define ESP_WIFI_CHANNEL 1
#define MAX_STA_CONN 2

static void wifi_event_handler(void *arg, esp_event_base_t event_base,
                               int32_t event_id, void *event_data)
{
    // Just logs the event ID here. A real app would branch on
    // event_id to handle STA connect/disconnect, etc.
    printf("Event nr: %ld!\n", event_id);
}

void wifi_init_softap()
{
    // --- Initialization ---
    esp_netif_init();
    esp_event_loop_create_default();
    esp_netif_create_default_wifi_ap();

    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    esp_wifi_init(&cfg);
    esp_event_handler_instance_register(WIFI_EVENT,
                                        ESP_EVENT_ANY_ID,
                                        &wifi_event_handler,
                                        NULL,
                                        NULL);

    // --- Configuration ---
    wifi_config_t wifi_config = {
        .ap = {
            .ssid = ESP_WIFI_SSID,
            .ssid_len = strlen(ESP_WIFI_SSID),
            .channel = ESP_WIFI_CHANNEL,
            .password = ESP_WIFI_PASS,
            .max_connection = MAX_STA_CONN,
            .authmode = WIFI_AUTH_WPA2_PSK,
            .pmf_cfg = {
                .required = true,
            },
        },
    };

    // --- Start ---
    esp_wifi_set_mode(WIFI_MODE_AP);
    esp_wifi_set_config(WIFI_IF_AP, &wifi_config);
    esp_wifi_start();

    ESP_LOGI(TAG, "wifi_init_softap finished. SSID:%s password:%s channel:%d",
             ESP_WIFI_SSID, ESP_WIFI_PASS, ESP_WIFI_CHANNEL);
}

void app_main(void)
{
    wifi_init_softap();

    while (1) {
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}
```

3. **Disable NVS for this example.** Wi-Fi apps normally store credentials in Non-Volatile Storage (NVS), but this example hard-codes them for simplicity, and NVS is enabled by default. To avoid unrelated warnings, turn it off:

   - Open the SDK Configuration Editor.
   - Search for **NVS** and disable the relevant option.
   - Save.

   :::warning
   Hard-coding Wi-Fi credentials is fine for a quick test, but it's not how you'd want to ship a real device — store credentials in NVS (or another secure store) instead.
   :::

4. Set your target, port, and flash method (see [Section 2](./run-example#13-configure-target-port-and-flash-method)).
5. Build, flash, and monitor. You should see log output showing the AP has started.
6. Connect to the ESP32's hotspot from a phone or laptop. When a device connects, you'll see `Event nr: 14!` in the log — event ID `14` corresponds to `WIFI_EVENT_AP_STACONNECTED` (the full list of Wi-Fi event IDs is defined in ESP-IDF's `esp_wifi_types_generic.h`).

---

## 5. Where to Go From Here

Once a device is actually on the network, the next question is usually "now what do I send over it?" ESP-IDF has solid support for the usual application-layer protocols:

- **HTTP/HTTPS** — as a client talking to a server, or as a lightweight web server running on the ESP32 itself.
- **MQTT** — the standard lightweight pub/sub protocol most IoT-to-cloud integrations use.
- **WebSocket** — full-duplex, good fit for real-time data streams.
- **SNTP** — syncs the device's clock from an internet time server, useful anywhere accurate timestamps matter.
- **mDNS** — lets you reach a device by hostname (like `my-device.local`) on the local network instead of tracking its IP.

ESP-IDF's own [`examples/protocols`](https://github.com/espressif/esp-idf/tree/master/examples/protocols) directory has working examples for all of these.

---

## 6. Reference Links

* [ESP-IDF Wi-Fi Driver Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-guides/wifi-driver/index.html)
* [ESP-IDF lwIP Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-guides/lwip.html)
* [ESP-IDF Application-Layer Protocols API Reference](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-reference/protocols/index.html)
* [ESP-IDF protocol examples](https://github.com/espressif/esp-idf/tree/master/examples/protocols)

