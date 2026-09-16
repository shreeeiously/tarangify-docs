---
title: FAQ
sidebar_position: 6
---
# Frequently Asked Questions

## Q. After programming the module, sometimes I cannot connect to the serial port or the upload fails on a subsequent attempt?

Hold down the **BOOT** button, press and release the **RESET** button, then release the **BOOT** button. This puts the module into **download mode** and resolves most programming issues.

## Q. Error when compiling an Arduino program?

Check that the **Arduino IDE → Tools** settings are properly configured for your board before compiling the program.

![FAQ](/img/FAQ.webp)

## Q. How do I check which COM port I am using?

### Windows

**Using Device Manager:**

Press **Windows + R** to open the Run dialog. Enter `devmgmt.msc` and press Enter. Expand **Ports (COM & LPT)** to view the available COM ports.

**Using Command Prompt:**

Open **Command Prompt (CMD)** and enter the mode command, which will display status information for all COM ports.

**Check the hardware connection:**

If an external device is already connected to a COM port, the device typically occupies a port number. You can determine which port is being used by checking the connected hardware.

### Linux

**Check using the `dmesg` command:**

Open the terminal.

**Check using the ls command:**

Type `ls /dev/ttyS*` or `ls /dev/ttyUSB*` to list all serial devices.

**Use the `setserial` command:**

Type `setserial -g /dev/ttyS*` to view configuration information for all serial devices.

## Q: Two COM ports appear in Device Manager. Which one should I select?

The board has an onboard CH334 USB hub. A single Type-C connection enumerates two independent COM ports, and either port can be used to flash programs.

With the USB cable connected, locate the two ports under **Ports (COM & LPT)** in Device Manager and distinguish them by their device names:

- The port whose name contains `USB-Enhanced-SERIAL CH343` is the CH343 USB-to-UART interface.

- The port whose name contains `Espressif` or `USB JTAG/serial debug unit` is the ESP32-S3 native USB interface, which can also be used for JTAG debugging.

To open Device Manager in Windows, right-click the Start menu in the lower-left corner of the desktop and select **Device Manager**. 

Alternatively, press Win + R, enter `devmgmt.msc`, and press Enter.

## Q: Why does the board sometimes fail to connect to the serial port or fail to flash when I flash it again?

Use either of the following methods to put the board back into download mode:

- Press and hold the RESET button for more than 1 second, then release it. Wait for the computer to detect the device again before flashing.

- Press and hold the BOOT button, press and release the RESET button, and then release the BOOT button. The board enters download mode, which resolves most flashing failures.

## Q: Why does the flashing fail?

1. When the serial port is occupied, the flashing will fail. Close the serial port monitor and try to flash again

2. When the ESP32 program crashes, the flashing will fail. In this case, you need to completely power off the development module, hold down BOOT button and power it on again to enter the forced download mode and then flash it. It will not automatically exit the download mode after flashing, so you need to power off and restart again

## Q: Why does flashing fail or the program behave unexpectedly after I replace the board with another one of the same model?

After replacing the board, the computer usually assigns different COM ports. Select the COM port and target chip again, then recompile and flash the program.

## Q: Why are the ESP-IDF controls missing from the VS Code status bar?

A: Press F1 to open the Command Palette and search for **Espressif IDF**. If the extension is marked as untrusted, set it to trusted so it can operate normally.