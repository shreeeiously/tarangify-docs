---
id: freertos
title: FreeRTOS
sidebar_label: FreeRTOS
sidebar_position: 7
description: Learn FreeRTOS task concepts and scheduling in ESP-IDF, then create, suspend, resume, and delete tasks across both CPU cores.
---

# Section 6: FreeRTOS

This section introduces FreeRTOS as it's used inside ESP-IDF, and walks through a hands-on example that creates two tasks, pins them to different CPU cores, and demonstrates suspending, resuming, and deleting a task at runtime.

:::info

Make sure you've completed [**Section 1: Set Up Environment**](./esp-idf-installation) through [**Section 5: Debug**](./debug) before starting this section.

:::

FreeRTOS is the real-time operating system kernel built into ESP-IDF as a core component — virtually every ESP-IDF application and most of its components run on top of it.

It's worth knowing that ESP-IDF doesn't use stock FreeRTOS unmodified. Espressif maintains its own fork, informally called **IDF FreeRTOS**, with substantial changes — most notably dual-core (SMP) support. The official upstream SMP implementation from Amazon exists and can be enabled, but it's still considered experimental and isn't the default.

IDF FreeRTOS's key characteristics on ESP32 chips:

- **Multitasking with real-time guarantees** — task priorities, inter-task communication primitives (queues, semaphores, event groups), and software timers, covering the coordination needs typical of embedded/IoT applications.
- **Dual-core scheduling** — tasks can be pinned to a specific core or left free to run on either, and the two cores' schedulers coordinate.
- **Hardware-aware optimizations** — takes advantage of ESP chip features like shared memory, atomic instructions, and cross-core interrupts for efficient multicore coordination.

---

## 1. Core FreeRTOS Concepts

FreeRTOS structures concurrency around **tasks** — independent threads of execution that you create, delete, and otherwise manage through the FreeRTOS API. The kernel's scheduler decides which task runs when, based on priority and time-slicing, creating the illusion (or reality, on multicore) of things happening simultaneously.

### 1.1 Task States

A FreeRTOS task is just a C function, usually written with an infinite loop so it keeps running for the life of the application. At any moment, a task is in one of four states:

- **Running** — actively executing on a CPU core right now.
- **Ready** — able to run, just waiting for a core to become free.
- **Blocked** — waiting on something (a timeout, a peripheral event, a semaphore) and not consuming CPU time while it waits.
- **Suspended** — parked indefinitely until something explicitly resumes it.

### 1.2 How Scheduling Works

At its core, FreeRTOS's scheduler is **preemptive**, **priority-based**, and uses **time-slicing** among equal-priority tasks. On a single core, that means: always run the highest-priority Ready task, share CPU time round-robin among ties at that priority, and immediately switch over the moment a higher-priority task becomes Ready.

On ESP32's dual-core chips, IDF FreeRTOS's SMP scheduling adds some extra nuance:

- **Core affinity** — each task can be pinned to Core 0, Core 1, or left free to run on either. Each core runs its own scheduling pass independently, picking the highest-priority task that's both allowed to run there (matching affinity) and not already running on the other core. Because of this, it's possible for two equally-highest-priority tasks to exist without both cores actually being able to run one each.
- **Time-slicing under constraints** — since affinity can block a "perfect" round robin, the scheduler instead rotates a just-run task to the back of its ready list and always searches from the front. This search can skip over blocked candidates, and in some cases even hands a core to a lower-priority runnable task rather than leaving it idle. The net effect: same-priority tasks still get their fair share of CPU time, just not in perfectly strict rotation.
- **Preemption across cores** — when a higher-priority task becomes ready and could run on more than one core, only one core gets preempted for it — specifically the core where the triggering event happened.

---

## 2. Example: Creating, Suspending, Resuming, and Deleting Tasks

:::warning

This example requires a multi-core ESP32 chip (such as ESP32-S3) to run as written.

:::

This example creates two tasks, pins each to a different core, and shows one task controlling the lifecycle of the other — suspending itself, getting resumed, then deleting itself.

### 2.1 Example Code

Create a new project (see [Section 3](./create-project#2-create-a-project-from-scratch) for a refresher), and replace `main/main.c` with:

```c
#include <stdio.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

TaskHandle_t myTaskHandleA = NULL;
TaskHandle_t myTaskHandleB = NULL;

void Demo_Task_A(void *arg)
{
    int count = 0;
    while (1)
    {
        count++;
        printf("Demo_Task_A printing...%d\n", count);
        if (count == 10)
        {
            printf("Demo_Task_A resumed Demo_Task_B!\n");
            vTaskResume(myTaskHandleB);
        }
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}

void Demo_Task_B(void *arg)
{
    int count = 0;
    while (1)
    {
        count++;
        printf("Demo_Task_B printing...%d\n", count);
        if (count == 5)
        {
            printf("Demo_Task_B is suspended itself!\n");
            vTaskSuspend(NULL);
        }
        if (count == 10)
        {
            printf("Demo_Task_B is deleted itself!\n");
            vTaskDelete(NULL);
        }
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}

void app_main(void)
{
    // Pin Task A to core 0 and Task B to core 1, both with 4096-byte stacks and priority 10,
    // so they can run in parallel on a dual-core chip.
    xTaskCreatePinnedToCore(Demo_Task_A, "Demo_Task_A", 4096, NULL, 10, &myTaskHandleA, 0);
    xTaskCreatePinnedToCore(Demo_Task_B, "Demo_Task_B", 4096, NULL, 10, &myTaskHandleB, 1);
}
```

### 2.2 Build, Flash, and Observe

Set your target, port, and flash method (see [Section 2](./run-example#13-configure-target-port-and-flash-method)), then build, flash, and monitor.

:::note

With two tasks printing concurrently, their output naturally interleaves — that's expected, not a bug.

:::

You should see output following this general pattern: both tasks print roughly once a second; once Task B hits its 5th print, it suspends itself and stops appearing; once Task A hits its 10th print, it resumes Task B, which then picks back up counting from where it left off; once Task B's count reaches 10, it deletes itself and disappears from the log for good, while Task A keeps running on its own afterward.

### 2.3 How the Code Works

**Task handles**

```c
TaskHandle_t myTaskHandleA = NULL;
TaskHandle_t myTaskHandleB = NULL;
```

`TaskHandle_t` uniquely identifies a task once it's created. Making these global lets one task act on another — here, Task A needs Task B's handle to resume it.

**Task A**

Task A just counts and prints once a second. Once its counter hits 10, it calls:

```c
vTaskResume(myTaskHandleB);
```

which wakes Task B back up if it's currently suspended.

**Task B**

Task B counts and prints the same way, but has two special milestones:

- At count 5, it calls `vTaskSuspend(NULL)` — passing `NULL` means "suspend myself." Once suspended, the scheduler stops giving this task any CPU time until something else explicitly resumes it.
- At count 10 (after being resumed), it calls `vTaskDelete(NULL)` — again, `NULL` means "delete myself." This tears the task down and frees its stack and control block.

:::note

A FreeRTOS task function should never just `return`. If a task needs to end, it must call `vTaskDelete(NULL)` explicitly.

:::

**Creating and pinning the tasks**

```c
xTaskCreatePinnedToCore(Demo_Task_A, "Demo_Task_A", 4096, NULL, 10, &myTaskHandleA, 0);
xTaskCreatePinnedToCore(Demo_Task_B, "Demo_Task_B", 4096, NULL, 10, &myTaskHandleB, 1);
```

`app_main` is the entry point ESP-IDF calls automatically once FreeRTOS is up and running. `xTaskCreatePinnedToCore` creates a task and locks it to a specific core. Its arguments, in order:

- the task function to run
- a human-readable name (useful in logs and debuggers)
- stack size in bytes (4096 here)
- an optional argument passed into the task function (unused here, hence `NULL`)
- priority (higher numbers run first; capped at `configMAX_PRIORITIES - 1`)
- a pointer to store the resulting task handle
- which core to pin the task to (`0` or `1` here; pass `tskNO_AFFINITY` to let the scheduler choose freely)

---

## 3. Reference Links

* [ESP-IDF FreeRTOS Overview](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-reference/system/freertos.html)
* [ESP-IDF FreeRTOS (IDF) API Reference](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-reference/system/freertos_idf.html)
* [What is FreeRTOS?](https://www.freertos.org/Why-FreeRTOS/What-is-FreeRTOS)
* [FreeRTOS Beginner's Guide](https://www.freertos.org/Documentation/01-FreeRTOS-quick-start/01-Beginners-guide/00-Overview)

