---
id: create-project
title: Create Project
sidebar_label: Create Project
sidebar_position: 4
description: Create a new ESP-IDF project from scratch and drive an external LED with custom GPIO code.
---

# Section 3: Create Project

This section shows how to start a brand-new ESP-IDF project in Visual Studio Code (rather than opening a built-in example) and walks through writing simple GPIO code to blink an externally wired LED.

:::tip

The steps below apply to any ESP32-series board. Wiring and pin numbers shown here are generic — check your specific Tarangify board's pinout before connecting hardware.

:::

:::info

Make sure you've completed [**Section 1: Set Up Environment**](./esp-idf-installation) and [**Section 2: Run Example**](./run-example) before starting this section.

:::

> This section explains how to create a fresh ESP-IDF project in VS Code and demonstrates it with a hands-on example: blinking an externally connected LED.

---

## 1. Wire Up the Circuit

You'll need:

- 1x LED
- 1x 330Ω resistor
- 1x breadboard
- Jumper wires
- An ESP32-series development board

Connect the LED's longer (anode) leg through the resistor to a GPIO pin of your choice, and the shorter (cathode) leg to a ground (GND) pin. Double-check your board's pinout diagram to confirm which pins are available for general-purpose output before wiring.

:::note

The example code below uses GPIO7. If your board doesn't expose GPIO7, or reserves it for another purpose, pick a different available output-capable pin and update the code accordingly.

:::

---

## 2. Create a Project From Scratch

1. Open Visual Studio Code, click the ESP-IDF extension icon, and open the **New Project Wizard**.
2. Select the ESP-IDF version you want the project to target.
3. Instead of choosing one of the example templates, select the **sample_project** template under **ESP-IDF Templates**, then confirm.
4. Choose a project name and save location. Board-specific settings can be changed later, so it's fine to leave them at their defaults for now.

:::danger

The project path must not contain spaces, non-ASCII characters, or other special characters, or the build may fail.

:::

5. Once creation finishes, open the new project.

---

## 3. Write the Application Code

A new `sample_project` comes with a standard set of generated files and folders. For this tutorial, leave everything as-is and only edit `main.c`.

Replace its contents with the following:

```c
#include <stdio.h>

#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

static const gpio_num_t led_pin = GPIO_NUM_7;

void app_main(void)
{
    gpio_reset_pin(led_pin);
    gpio_set_direction(led_pin, GPIO_MODE_OUTPUT);

    while (1)
    {
        gpio_set_level(led_pin, 1);
        printf("LED is ON\n");
        vTaskDelay(pdMS_TO_TICKS(1000));

        gpio_set_level(led_pin, 0);
        printf("LED is OFF\n");
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}
```

### Getting Syntax Highlighting and Code Navigation Working

The [Microsoft C/C++ extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) (covered in Section 1) usually picks up ESP-IDF macros and headers automatically once you've built the project at least once.

If you see red squiggly underlines on valid ESP-IDF symbols before that, it's typically because `compile_commands.json` hasn't been generated yet. To generate it directly:

1. Open the command palette with `Ctrl + Shift + P`.
2. Run **ESP-IDF: Run idf.py reconfigure Task**.

---

## 4. Build and Flash

1. As in Section 2, confirm your **target chip**, **serial port**, and **flash method** are set correctly in the ESP-IDF toolbar.
2. Use the combined **Build, Flash and Monitor** action to compile, upload, and open the serial monitor in one step.
3. Once flashing completes, the LED should start blinking, and the serial monitor will print alternating `LED is ON` / `LED is OFF` messages roughly once per second.

---

## 5. How the Code Works

**Includes**

```c
#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
```

- `stdio.h` gives access to `printf`, used here to log LED state over serial.
- `driver/gpio.h` is ESP-IDF's GPIO driver API — it provides functions for configuring pin direction and setting or reading pin levels.
- `freertos/FreeRTOS.h` and `freertos/task.h` expose FreeRTOS's task APIs. This example only needs `vTaskDelay` for timing.

**Pin definition**

```c
static const gpio_num_t led_pin = GPIO_NUM_7;
```

`gpio_num_t` is the enum ESP-IDF uses to represent GPIO numbers. Using named constants like `GPIO_NUM_7` instead of a bare integer makes the code clearer and catches type mistakes at compile time.

:::note

Which GPIOs are available — and which are reserved for flash, PSRAM, or other internal use — differs between chip variants. Always check your specific chip's pin reference before choosing a pin.

:::

**Initialization**

```c
gpio_reset_pin(led_pin);
gpio_set_direction(led_pin, GPIO_MODE_OUTPUT);
```

`gpio_reset_pin` returns the pin to its default state before you configure it, avoiding leftover settings from boot-time pin muxing. `gpio_set_direction` then puts the pin into output mode so it can drive the LED.

**The main loop**

```c
while (1)
{
    gpio_set_level(led_pin, 1);
    printf("LED is ON\n");
    vTaskDelay(pdMS_TO_TICKS(1000));

    gpio_set_level(led_pin, 0);
    printf("LED is OFF\n");
    vTaskDelay(pdMS_TO_TICKS(1000));
}
```

An infinite `while(1)` loop is the normal pattern for a FreeRTOS task that should run indefinitely — it keeps `app_main`'s task alive under the scheduler rather than letting it return and get cleaned up.

- `gpio_set_level(led_pin, 1)` and `gpio_set_level(led_pin, 0)` drive the pin high and low to turn the LED on and off.
- `printf(...)` writes status messages to the serial console, which is useful for confirming the loop is actually running even before you can see the LED.
- `vTaskDelay(pdMS_TO_TICKS(1000))` blocks this task for roughly 1000 ms. Because it's a blocking *delay* rather than a busy-wait, FreeRTOS is free to schedule other tasks during that time — important once your project has more than one task running.

---

## 6. Reference Links

* [ESP-IDF Style Guide (C code formatting)](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/contribute/style-guide.html#c)
* [ESP-IDF GPIO API Reference](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/gpio.html)
* [FreeRTOS Task Control API](https://docs.espressif.com/projects/esp-techpedia/en/latest/esp-friends/get-started/code-development/common-freertos-api/task-control.html)

---

## Next Step

You've now created an ESP-IDF project from scratch and written your own GPIO code.

Continue to:

[**Section 4: Use Component →**](./4component)