# ESP32 Gait Sensor System: UART Communication Protocol & Behavior

## Overview

This document defines the UART-based communication protocol between two ESP32 nodes:

* **Sensor Node**: Collects data from 16 FSR sensors and a BNO055 IMU.
* **Wi-Fi Node**: Connects to AWS IoT Core via MQTT, acts as a gateway for cloud interaction, session control, and time synchronization.

Device identity is **owned by the Wi-Fi Node** and used to publish to appropriate MQTT topics. The Sensor Node remains agnostic of `device_id` and does not include it in the raw data payloads.

---

## UART Communication Messages

### 🟦 Messages from Wi-Fi Node → Sensor Node

| Message             | Purpose                                   | Format                 |
| ------------------- | ----------------------------------------- | ---------------------- |
| `PING`              | Handshake/health check                    | `PING`                 |
| `SYNC_TIME:<epoch>` | Time synchronization (every 5–10s)        | `SYNC_TIME:1715771234` |
| `START_CALIBRATION` | Instruct Sensor Node to begin calibration | `START_CALIBRATION`    |
| `REQ_DATA`          | Request one sensor reading (every 100ms)  | `REQ_DATA`             |
| `STOP_STREAMING`    | Stop the session loop                     | `STOP_STREAMING`       |

### 🟩 Messages from Sensor Node → Wi-Fi Node

| Message       | Purpose                                  | Format                  |
| ------------- | ---------------------------------------- | ----------------------- |
| `ACK`         | Response to `PING`                       | `ACK`                   |
| `cal_status`  | Periodic JSON calibration status         | JSON object (see below) |
| `sensor_data` | Single sample of sensor data (after REQ) | JSON object (see below) |

---

## JSON Message Structures

### 🔹 Calibration Status (`type = cal_status`)

```json
{
  "type": "cal_status",
  "device_id": "esp-001",
  "sys": 3,
  "gyro": 3,
  "accel": 3,
  "mag": 3,
  "completed": true
}
```

* Sent every 500ms during calibration.
* `completed: true` indicates calibration is complete.

### 🔹 Sensor Data (one reading)

```json
{
  "timestamp": 1715771300,
  "FSR_1": 40,
  ...
  "FSR_16": 55,
  "yaw": 0.25,
  "pitch": 1.5,
  "roll": 0.4,
  "q0": 0.99,
  "q1": 0.01,
  "q2": 0.02,
  "q3": 0.01,
  "ax": 0.02,
  "ay": -0.03,
  "az": 0.98,
  "gx": 0.01,
  "gy": 0.02,
  "gz": 0.01,
  "sys_cal": 3,
  "gyro_cal": 3,
  "accel_cal": 3,
  "mag_cal": 3
}
```

---

## Wi-Fi Node Behavior (Option A: Request-Driven Streaming)

1. **Startup**

   * Connect to Wi-Fi and AWS IoT Core
   * Send `PING` to Sensor Node → expect `ACK`
   * Send `START_CALIBRATION`

2. **Calibration Phase**

   * Listen to `cal_status` JSON from Sensor Node
   * Forward `cal_status` to topic: `device/{device_id}/status`
   * When `completed == true`, begin streaming loop

3. **Streaming Phase (every 100ms)**

   * Check for MQTT stop command → if received, send `STOP_STREAMING`, end loop
   * Every 5–10s → send `SYNC_TIME:<epoch>`
   * Send `REQ_DATA`
   * Wait (max 100ms) for sensor JSON

     * If received → prepend `device_id`, publish to `device/{device_id}/sensor_data`
     * If not received in time → log warning and continue

4. **Stop Phase**

   * On MQTT `stop_streaming` message → forward to Sensor Node
   * Exit data loop and reset session if needed

---

## Sensor Node Behavior

1. **Startup**

   * Wait for `START_CALIBRATION`
   * Enter calibration loop
   * Send `cal_status` JSON every 500ms
   * Once calibrated → store initial orientation and wait for `REQ_DATA`

2. **Command Handling**

   * `SYNC_TIME:<epoch>` → update clock
   * `REQ_DATA` → generate and send one JSON payload
   * `STOP_STREAMING` → optional flag for tracking (no effect unless extended)

3. **No internal streaming loop**

   * All data generation is on-demand only when `REQ_DATA` is received

---

## Design Notes

* `device_id` is hardcoded **only in Wi-Fi Node**.
* Sensor Node does not embed or use `device_id`.
* Wi-Fi Node adds `device_id` before publishing to MQTT.
* User ID is **not** embedded in payload; backend maps `device_id → user_id`.

---

## MQTT Topics Used

| Topic                            | Payload Source         | Payload Type     |
| -------------------------------- | ---------------------- | ---------------- |
| `device/{device_id}/status`      | Wi-Fi Node (from UART) | Calibration JSON |
| `device/{device_id}/sensor_data` | Wi-Fi Node (from UART) | Sensor JSON      |
| `device/{device_id}/command`     | AWS → Wi-Fi Node       | `stop_streaming` |

---

## Future Considerations

* Add retry and failover logic to handle lost packets
* Optimize UART parsing with delimiters + checksums (if needed)
* Add error reporting or battery status in `cal_status`
* Upgrade to stream batching or faster sampling (20–50Hz) if needed
