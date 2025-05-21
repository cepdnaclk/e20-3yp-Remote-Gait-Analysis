Absolutely. I’ll now generate a comprehensive, full-length README.md-style backend documentation — covering every relevant component you’ve implemented, including:

* Roles, entities, services
* Test session lifecycle
* MQTT, WebSocket, FastAPI integration
* Real-time flow
* Frontend interactions
* Security and design principles

This document will follow a **narrative style** and be detailed enough for new developers or reviewers to understand the complete system end-to-end.

---

### ✅ Starting…

This may take a few minutes to compile completely — I’ll respond again shortly with the full document.


Here is your comprehensive backend documentation in README format, covering the full system with a narrative flow:

---

# 🧠 GaitMate Backend (Spring Boot) — Comprehensive System Overview

## 📌 Overview

**GaitMate** is a full-stack, role-based remote physiotherapy and gait analysis system. It combines wearable IoT sensors (ESP32), a secure Spring Boot backend, FastAPI for post-test data processing, and a WebSocket-powered frontend for real-time feedback.

This document describes the **backend component** in detail: its architecture, entity model, MQTT-WebSocket integration, authentication flow, test lifecycle, data processing, and frontend-facing API endpoints.

---

## 🔧 Technology Stack

* **Spring Boot 3** (REST APIs, JPA, Security)
* **PostgreSQL** (Relational DB)
* **AWS IoT Core** (MQTT broker for ESP32 devices)
* **STOMP over WebSocket** (WebSocket messaging to frontend)
* **JWT Security** (role-based access control)
* **Python FastAPI** (external data processing microservice)

---

## 👥 Roles & Permissions

The system defines four core user roles, each with limited and structured access:

| Role      | Description                         | Can Perform                           |
| --------- | ----------------------------------- | ------------------------------------- |
| `ADMIN`   | Central manager                     | Manage clinics, sensor kits           |
| `CLINIC`  | Manages doctors and patients        | Add doctors/patients, assign devices  |
| `DOCTOR`  | Views and manages assigned patients | Review results, give feedback         |
| `PATIENT` | Test participant                    | Start/stop sessions, view own results |

JWT-based authentication is implemented with Spring Security, and access to all endpoints is controlled with `@PreAuthorize` annotations.

---

## 🧱 Core Entities & Relationships

```text
Clinic 1 ────< Doctors >──── 1 Clinic
Clinic 1 ────< Patients >─── 1 Clinic
Doctor 1 ────< Patients >─── 0..N
Patient 1 ─── 1 SensorKit ─── 1 Patient
Patient 1 ───< TestSessions >─── N
TestSession 1 ── 0..1 ProcessedTestResults
            └─ 0..1 Feedback
            └─ 0..1 RawSensorData
```

### ✅ Entity Highlights:

* **Clinic**: Registers doctors and patients; owns sensor kits.
* **Doctor**: Manages patients under a clinic.
* **Patient**: Assigned to a doctor and clinic; operates a SensorKit.
* **SensorKit**: A physical IoT device (ESP32) with firmware, calibration status, and association to a patient.
* **TestSession**: A single session of gait recording; has a `status` (ACTIVE, PROCESSING, COMPLETED, FAILED).
* **ProcessedTestResults**: Metrics calculated after test using raw sensor data.
* **Feedback**: Textual comments by physiotherapist.
* **RawSensorData**: Link to file (e.g., S3 or Supabase) with raw readings.

---

## 🧪 Test Session Lifecycle (Narrative)

### 1. **START TEST**

* Triggered from frontend via:
  `POST /api/test-sessions { action: "START", timestamp: <local time> }`
* Validates:

    * Session doesn’t already exist
    * SensorKit is calibrated and `IN_USE`
    * Timestamp is within ±2 seconds of server
* On success:

    * A new `TestSession` is created with status `ACTIVE`
    * The sessionId is returned and stored in frontend

### 2. **STOP TEST**

* Triggered from frontend via:
  `POST /api/test-sessions/{sessionId} { action: "STOP", timestamp: <local time> }`
* Validates:

    * Session exists and is `ACTIVE`
    * Logged-in user owns the session
    * Stop time > start time
* Updates:

    * `endTime` is saved
    * `status` is changed to `PROCESSING`
* Also:

    * Sends `STOP` command to ESP32 via MQTT
    * Sends processing request to FastAPI microservice **asynchronously**

---

## ⚙️ MQTT Integration

### ✅ Topics

**Commands (published by Spring Boot to AWS IoT Core):**

* `device/{deviceId}/command`

    * Payload: `{ "command": "stop_streaming" }`, `{ "command": "check_calibration" }`, etc.

**Status Updates (published by ESP32 to IoT Core → received in backend):**

* `device/{deviceId}/status/calibration`
* `device/{deviceId}/status/orientation`
* `device/{deviceId}/status/alive`

### ✅ Topic Listeners

Each topic uses a dedicated `@Component` listener class that extends `AbstractTopicListener`. These listeners:

* Parse the payload using Jackson
* Extract `deviceId`, `status`, and `type`
* Update DB or trigger downstream logic
* Send real-time updates via WebSocket

Example:

```json
{ "type": "cal_status", "status": true, "device_id": 5 }
```

---

## 🔔 WebSocket Notification System

### ✅ Features

* STOMP-based WebSocket endpoint: `/ws`
* JWT-authenticated WebSocket connection
* Messages are sent to: `/user/topic`

### ✅ Sent NotificationMessage Format

```json
{
  "type": "cal_status",
  "deviceId": 42,
  "status": true,
  "timestamp": "2025-05-20T14:03:05"
}
```

### ✅ Events Sent:

* `cal_status`: result of calibration check
* `orientation_captured`: orientation capture status
* `device_alive`: device heartbeat
* `results_ready`: backend has stored processed results

All messages are sent via `NotificationService.sendToUser(username, message)`.

---

## ⚙️ FastAPI Integration (External Processing)

### Purpose:

Process raw sensor data and calculate gait metrics after a test finishes.

### Flow:

1. Spring Boot sends POST to FastAPI:
   `/process-session` with `sensorId`, `startTime`, `endTime`, `sessionId`
2. FastAPI:

    * Simulates calculation
    * Sends back processed metrics to:
      `POST /api/results` in Spring Boot

### Response Payload from the data processing service:

```json
{
  "status": true,
  "sessionId": 1,
  "stepTime": 1.8,
  "cadence": 110,
  ...
}
```

### In Spring Boot:
* Looks at the status field of the response.
* If `status == false`, mark session as `FAILED`
* If `status == true`:

    * Save `ProcessedTestResults`
    * Update session to `COMPLETED`
* Send `"results_ready"` WebSocket notification

---

## 🧩 Frontend Interaction Summary

### 1. Patient logs in → starts WebSocket connection

### 2. Patient presses **Start Test**:

* POST `/test-sessions` → stores sessionId
* Button switches to **Stop**

### 3. Patient presses **Stop**:

* POST `/test-sessions/{id}`
* Frontend shows loading spinner

### 4. WebSocket receives `"results_ready"`

* Shows "Results Ready" UI
* On button click → GET `/test-sessions/{id}` → show result table

---

## 🛡️ Security & Error Handling

### ✅ Authentication

* JWT-based, issued at login
* Injected into WebSocket and REST calls
* Token parsed and validated in a security filter

### ✅ Role-based Access

* `@PreAuthorize(...)` on all controller methods
* `AuthUtil` used to get logged-in user or their entity

### ✅ Error Handling

* All exceptions wrapped by `GlobalExceptionHandler`
* 400 → validation or business logic error
* 401/403 → auth or role error
* Errors logged and wrapped into JSON response

---

## 🔄 Extensibility

This backend was built with extensibility in mind.

You can easily:

* Add new device types with topic listeners
* Introduce a physiotherapist review workflow
* Plug in a custom ML model for result classification
* Enable feedback form submission
* Add reporting dashboards (per clinic/doctor)

---

## ✅ Conclusion

The GaitMate backend is a highly modular, event-driven, real-time system built with production-ready practices. It bridges secure user management, device integration, and real-time data delivery — making it a robust base for remote physiotherapy and beyond.

> This README is intended to serve as the canonical technical reference for developers, testers, integrators, and new team members onboarding into the backend system.

---

Let me know if you'd like this exported to a `.md` file or integrated into Swagger/OpenAPI or internal Confluence docs.
