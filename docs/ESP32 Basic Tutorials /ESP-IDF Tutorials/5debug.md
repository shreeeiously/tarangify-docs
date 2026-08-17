---
id: debug
title: Debug
sidebar_label: Debug
sidebar_position: 6
description: Debug ESP32-S3 firmware in VS Code using the built-in JTAG interface, OpenOCD, and GDB.
---

# Section 5: Debug

This section covers JTAG debugging for ESP32-S3-based Tarangify boards using Visual Studio Code and the ESP-IDF extension.

:::info

Make sure you've completed [**Section 1: Set Up Environment**](./esp-idf-installation) through [**Section 4: Use Component**](./component) before starting this section.

:::

---

## 1. Why Use a Real Debugger

Adding `printf` calls and watching the serial monitor is the simplest way to inspect what firmware is doing, and it's often enough. But it has a real cost: every time you want to check a new value or condition, you have to edit the code, rebuild, and reflash.

A hardware debugger removes that cycle. With breakpoints, single-stepping, and live memory/variable inspection, you can pause execution and look around without touching your source code at all.

ESP32-series chips support this through the **JTAG** interface, paired with **OpenOCD** and **GDB**. JTAG gives a debug host a direct, low-level connection to the running chip — enough to halt execution, inspect the call stack, watch variables, and step line by line.

In practice, the pieces fit together like this: VS Code (via the ESP-IDF extension) drives a GDB client, GDB talks to an OpenOCD server, and OpenOCD talks to the chip itself over JTAG — either the chip's built-in USB-JTAG or an external adapter. ESP-IDF ships its own maintained forks of both tools (`esp-gdb` and `openocd-esp32`) with better support for Espressif chips than the vanilla upstream versions.

---

## 2. Hardware and Driver Setup

### 2.1 Hardware Requirements

This section covers debugging over a chip's **built-in USB-JTAG** interface, available on ESP32-S3, ESP32-C3, ESP32-P4, and similar chips — including Tarangify's ESP32-S3-based boards.

If your board's chip doesn't expose USB-JTAG, you can still debug using an external JTAG adapter (such as Espressif's ESP-PROG), but that setup isn't covered here — see Espressif's own debugging documentation for that path.

### 2.2 Install JTAG Drivers

JTAG communication needs the right USB drivers installed first. You can do this either through Espressif's installation manager GUI or from the command line.

**Espressif Installation Manager (GUI):** open the dashboard from "Manage Installations," then choose "Install Drivers."

**PowerShell (Windows, as Administrator):**

```powershell
Invoke-WebRequest 'https://dl.espressif.com/dl/idf-env/idf-env.exe' -OutFile .\idf-env.exe; .\idf-env.exe driver install --espressif
```

---

## 3. A Small Example to Debug

Create a new project (see [Section 3](./create-project#2-create-a-project-from-scratch) if you need a refresher), and replace `main/main.c` with something simple enough to step through clearly:

```c
#include <stdio.h>

// Sums all integers from 1 up to 'number'
int summation(int number)
{
    int sum = 0;
    for (int i = 1; i <= number; i++) {
        sum += i;
    }
    return sum;
}

void app_main(void)
{
    printf("Hello world!\n");
    int final_number = 6;
    int sum = summation(final_number);
    printf("The summation up to %d is %d\n", final_number, sum);
}
```

Set your target, port, and flash method (see [Section 2](./run-example#13-configure-target-port-and-flash-method)), then build, flash, and monitor. You should see:

```text
Hello world!
The summation up to 6 is 21
```

With that working, you're ready to attach a debugger instead of just reading printed output.

---

## 4. Start OpenOCD

OpenOCD runs as a server: it connects to your board over the debug adapter (JTAG), then exposes a network interface that GDB (and other clients) can connect to.

1. Open the command palette (`Ctrl + Shift + P`) and run **ESP-IDF: Select OpenOCD Board Configuration**. Choose the built-in USB-JTAG option matching your chip (for example, "ESP32-S3 chip (via builtin USB-JTAG)").
2. Open the command palette again and run **ESP-IDF: OpenOCD Manager**, then choose **Start OpenOCD**.
3. A successful start prints a log ending with something like:

```text
Info : [esp32s3.cpu0] starting gdb server on 3333
Info : Listening on port 3333 for gdb connections
```

By default, OpenOCD listens on port `4444` for Telnet, `6666` for TCL, and `3333` for GDB connections.

---

## 5. Start a Debugging Session

1. Set a breakpoint on the `sum += i;` line: click on the line, then press `F9` (or click in the gutter to the left of the line number).
2. Press `F5` (or **Run → Start Debugging**) to launch the session.

VS Code will connect GDB to the running OpenOCD server and pause execution at the start of `app_main`. You'll get a **Variables**, **Watch**, **Call Stack**, and **Breakpoints** panel on the side, a **Debug Console** and **Output** panel at the bottom, and a debug toolbar above the editor.

---

## 6. Common Debugging Operations

The debug toolbar gives you:

- **Continue** — resume execution until the next breakpoint or program end.
- **Step Over** — run the current line; if it calls a function, run the whole function without stepping into it.
- **Step Into** — run the current line, but step inside any function it calls.
- **Step Out** — finish the current function and pause back in its caller.
- **Restart** — restart the debug session from the beginning.
- **Disconnect** — end the debug session entirely.

A quick walkthrough using the example above:

1. **Continue** (`F5`) — execution runs until it hits your breakpoint on `sum += i;` and pauses. At this point `sum` will still show `0`, since that line hasn't executed yet. You can check any variable's value directly in the Debug Console by typing its name.
2. **Step Over** (`F10`) — advances one line at a time. Repeat it a few times to watch `i` and `sum` change on each loop iteration.
3. **Conditional breakpoints** — right-click your existing breakpoint, choose **Edit Breakpoint**, and enter a condition like `i==6`. Continue again, and execution will now only stop once `i` reaches `6`, skipping the earlier iterations.
4. **Step Into** (`F11`) — steps inside a called function rather than over it. Trying this on a `printf` call will actually step into FreeRTOS/newlib internals.

   :::note
   Since `printf` comes from a precompiled system library without source available in your project, VS Code may report that the file can't be found when you step into it. The function still runs correctly — you just won't see its source.
   :::

5. **Step Out** (`Shift + F11`) — finishes the current function and returns to `app_main`.
6. **Disconnect** (`Shift + F5`) — ends the debugging session.

---

## 7. Troubleshooting

**`LIBUSB_ERROR_NOT_FOUND`**

Usually a driver or USB permissions issue — see the [OpenOCD ESP32 troubleshooting FAQ](https://github.com/espressif/openocd-esp32/wiki/Troubleshooting-FAQ) for platform-specific fixes.

**OpenOCD won't connect**

- Double-check you've selected the correct board/chip in the OpenOCD board configuration step.
- Confirm the correct serial port is selected.
- Try re-entering download mode (hold **BOOT**, plug in USB, release **BOOT**).
- Close any other program (serial monitor, another IDE) that might already be holding the port open.

**Debugger behaves unexpectedly**

If breakpoints don't line up with your code or variables look wrong, it's often because the flashed firmware is out of date. Rebuild and reflash before starting a new debug session — any source change needs both.

---

## 8. Reference Links

* [ESP-IDF JTAG Debugging Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-guides/jtag-debugging/index.html)
* [Configuring the ESP32-S3 Built-in JTAG Interface](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-guides/jtag-debugging/configure-builtin-jtag.html)
* [ESP-IDF VS Code Extension — Debug Project](https://docs.espressif.com/projects/vscode-esp-idf-extension/en/latest/debugproject.html)
* [openocd-esp32 Troubleshooting FAQ](https://github.com/espressif/openocd-esp32/wiki/Troubleshooting-FAQ)

