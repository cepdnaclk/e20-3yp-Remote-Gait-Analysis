# ESP32 Gait Sensor System – Command Protocol Reference

This document defines the complete command protocol for the ESP32-based Wi-Fi Node and Sensor Node system, including UART and MQTT message types.

---

## 🟦 Commands: Wi-Fi Node → Sensor Node (UART)

| Command               | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| `PING`                | Health check sent on boot                                       |
| `SYNC_TIME:<epoch>`   | Send epoch time to sync clocks (every 5s)                       |
| `START_CALIBRATION`   | Instruct sensor node to begin calibration                       |
| `REQ_CAL_STATUS`      | Request current calibration status                              |
| `CAPTURE_ORIENTATION` | Request to capture initial orientation after wearing the device |
| `REQ_DATA`            | Request a single sample of sensor data                          |
| `STOP_STREAMING`      | Signal to stop polling; sensor can idle                         |

---

## 🟩 Messages: Sensor Node → Wi-Fi Node (UART)

| Message Type           | Format / Example                                                                      | Description                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `ACK`                  | `"ACK"`                                                                               | Response to `PING`                                                             |
| `cal_status`           | `{ "type": "cal_status", "status": true, "sys": 3, "gyro": 3, "accel": 3, "mag": 3 }` | Sent every 500ms during calibration and also as a response to `REQ_CAL_STATUS` |
| `sensor_data`          | `{ "timestamp": ..., "FSR_1": ..., "yaw": ..., ... }`                                 | Single sensor reading on `REQ_DATA`                                            |
| `orientation_captured` | `{ "type": "orientation_captured", "status": true }`                                  | Confirmation after capturing orientation                                       |

---

## 🟪 MQTT Commands: Backend → Wi-Fi Node

Topic: `device/{DEVICE_ID}/command`

| Command Payload                        | Description                                |
| -------------------------------------- | ------------------------------------------ |
| `{ "command": "check_calibration" }`   | Triggers `REQ_CAL_STATUS` to the sensor    |
| `{ "command": "start_calibration" }`   | Sends `START_CALIBRATION` to sensor        |
| `{ "command": "capture_orientation" }` | Sends `CAPTURE_ORIENTATION` to sensor      |
| `{ "command": "start_streaming" }`                  | Starts REQ loop and begins data streaming  |
| `{ "command": "stop_streaming" }`      | Stops data loop and sends `STOP_STREAMING` |

---

## 🟨 MQTT Status Updates: Wi-Fi Node → Cloud

| Topic                                    | Triggered By                          | Payload Type                                                   |
| ---------------------------------------- | ------------------------------------- | -------------------------------------------------------------- |
| `device/{DEVICE_ID}/status/alive`        | Periodically every 30s, and on boot   | `{ "type": "device_alive", "status": true, "timestamp": ... }` |
| `device/{DEVICE_ID}/status/calibration`  | From calibration updates              | `{ "type": "cal_status", ... }`                                |
| `device/{DEVICE_ID}/status/orientation`  | From orientation capture response     | `{ "type": "orientation_captured", ... }`                      |
| `device/{DEVICE_ID}/status` *(optional)* | General mixed messages (if used)      | JSON variants                                                  |
| `device/{DEVICE_ID}/sensor_data`         | After each sensor `REQ_DATA` response | JSON sensor reading                                            |

---

## ✅ Session Flow Summary

1. **Boot**

   * Wi-Fi Node connects to Wi-Fi and AWS
   * Sends `PING` to sensor → expects `ACK`
   * Sends `device_ready` MQTT status (optional)

2. **Start Session** (UI → Backend)

   * Backend sends `check_calibration`
   * If not calibrated → send `start_calibration`
   * Sensor sends `cal_status` periodically until complete

3. **Wear Phase**

   * UI shows "I'm Ready" → backend sends `capture_orientation`
   * Sensor captures orientation → sends `orientation_captured`

4. **GO Phase**

   * Backend sends `go` → Wi-Fi Node starts REQ loop
   * Publishes sensor data to `sensor_data` topic every 100ms

5. **Stop Phase**

   * UI sends stop → backend sends `stop_streaming`
   * Wi-Fi Node stops polling; system idles

6. **Repeat**

   * When new session starts → backend sends `check_calibration` again
   * No calibration state stored on backend; sensor is source of truth
