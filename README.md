<div align="center">
  <img src="/docs/images/logo1.png" alt="Rehab Gait Logo" width="100">
  <h1 style="display: inline-block; margin-left: 20px;">RehabGait | Remote Gait Analysis System</h1>
</div>

___

<div align="center">

[![Contributors][contributors-shield]](https://github.com/cepdnaclk/e20-3yp-Remote-Gait-Analysis/graphs/contributors)&ensp;
[![Network Graph][forks-shield]](https://github.com/cepdnaclk/e20-3yp-Remote-Gait-Analysis/network)&ensp;
[![Stargazers][stars-shield]](https://github.com/cepdnaclk/e20-3yp-Remote-Gait-Analysis/stargazers)&ensp;
[![Issues][issues-shield]](https://github.com/cepdnaclk/e20-3yp-Remote-Gait-Analysis/issues)

</div>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/cepdnaclk/e20-3yp-Remote-Gait-Analysis.svg?style=for-the-badge
[forks-shield]: https://img.shields.io/github/forks/cepdnaclk/e20-3yp-Remote-Gait-Analysis.svg?style=for-the-badge
[stars-shield]: https://img.shields.io/github/stars/cepdnaclk/e20-3yp-Remote-Gait-Analysis.svg?style=for-the-badge
[issues-shield]: https://img.shields.io/github/issues/cepdnaclk/e20-3yp-Remote-Gait-Analysis.svg?style=for-the-badge

---

## 🧠 Introduction

<img src="/docs/images/remote-healthcare.jpg" width="300" height="200" align="right">

**RehabGait** is an advanced remote gait analysis system designed to revolutionize physiotherapy and rehabilitation using modern wearable technology and cloud-based data processing. Traditional methods are subjective, localized, and often impractical for regular monitoring.

Our system solves these limitations by using:
- 🦶 Pressure-sensitive insoles
- 🧭 Inertial Measurement Units (IMUs)
- ☁️ Real-time cloud data processing
- 💻 An intuitive web platform for clinics, doctors, and patients

---

## 💡 Solution

We offer a complete end-to-end solution:
- Wearable insole and IMU-based sensors capture biomechanical data
- ESP32 microcontrollers transmit data over MQTT (AWS IoT Core)
- Real-time visualization (heatmaps, gait parameters, angles)
- Secure backend architecture using Spring Boot and PostgreSQL
- Python microservices generate analytics and reports
- Users access reports via a responsive web interface (React + MUI)

---

## 🚀 Features

- 👣 **Real-time Plantar Pressure Heatmap**  
  View live pressure distribution for each step on the foot sole.

- 🔍 **Comprehensive Gait Analysis**  
  Includes stride length, step duration, ankle/hip/knee angles, cadence, and more.

- 📋 **Auto-Generated Reports**  
  Includes plots, feedback summaries, and patient-specific diagnostics.

- 👥 **Role-Based Multi-User Platform**  
  Supports Admin, Clinic Manager, Doctor, and Patient roles.

- 🧪 **Calibration & Session Launch**  
  Device calibration, test session controls, and real-time streaming.

- 🔐 **Secure & Scalable Backend**  
  TLS, JWT, X.509 certificates, and microservices for modular deployment.

---

## 📦 Sensor Hardware

| Component              | Description |
|------------------------|-------------|
| **Insole Sensor**      | FS-INS-16Z Pressure Array with 3.3V logic and FPC connector |
| **IMU Sensor**         | BN0055 – 9DOF with sensor fusion and orientation tracking |
| **Microcontroller**    | ESP32-WROOM with UART communication |
| **Other**              | Custom PCB, battery-powered, NTP time sync, WiFi-enabled |

---

## 📐 System Architecture

```mermaid
graph TD
A[Sensor Node (ESP32)] --> B[AWS IoT Core (MQTT)]
B --> C[Lambda Functions]
C --> D[DynamoDB]
C --> E[Python Analytics Service]
E --> F[S3 + PostgreSQL]
F --> G[Web App (React + Spring Boot)]
