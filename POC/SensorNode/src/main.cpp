#include <Wire.h>
#include <Arduino.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BNO055.h>
#include <utility/imumaths.h>

#define UART_BAUD_RATE 115200
#define DEVICE_ID "601"

Adafruit_BNO055 bno = Adafruit_BNO055();

const int fsrPins[16] = {36, 39, 34, 35, 32, 33, 25, 26, 27, 14, 12, 13, 4, 0, 2, 15};

unsigned long syncedTime = 0;
unsigned long lastSyncTime = 0;
bool calibrated = false;
bool waitingForCalibration = true;

imu::Quaternion initialQuat;
float initialYaw = 0, initialPitch = 0, initialRoll = 0;

void sendCalibrationStatus() {
  uint8_t sysCal, gyroCal, accelCal, magCal;
  bno.getCalibration(&sysCal, &gyroCal, &accelCal, &magCal);
  bool complete = (sysCal > 0 && gyroCal == 3 && accelCal > 0 && magCal == 3);

  unsigned long ts = syncedTime + (millis() - lastSyncTime) / 1000;

  String calJSON = "{ \"type\": \"cal_status\", " +
                   String("\"device_id\": \"") + DEVICE_ID + "\", " +
                   "\"timestamp\": " + String(ts) +
                   ", \"sys\": " + sysCal +
                   ", \"gyro\": " + gyroCal +
                   ", \"accel\": " + accelCal +
                   ", \"mag\": " + magCal +
                   ", \"status\": " + (complete ? "true" : "false") + " }";

  Serial2.println(calJSON);
  Serial.println("Sent calibration status: " + calJSON);
}

void captureOrientationAndRespond() {
  initialQuat = bno.getQuat();
  imu::Vector<3> euler = bno.getVector(Adafruit_BNO055::VECTOR_EULER);
  initialYaw = euler.x();
  initialPitch = euler.y();
  initialRoll = euler.z();

  unsigned long ts = syncedTime + (millis() - lastSyncTime) / 1000;

  String msg = "{ \"type\": \"orientation_captured\", " +
               String("\"device_id\": \"") + DEVICE_ID + "\", " +
               "\"timestamp\": " + String(ts) +
               ", \"status\": true }";

  Serial2.println(msg);
  Serial.println("Captured initial orientation and sent confirmation.");
}

void startCalibration() {
  uint8_t sysCal, gyroCal, accelCal, magCal;

  Serial.println("Starting calibration...");

  while (true) {
    bno.getCalibration(&sysCal, &gyroCal, &accelCal, &magCal);
    bool complete = (sysCal = 3 && gyroCal == 3 && accelCal > 0 && magCal == 3);

    unsigned long ts = syncedTime + (millis() - lastSyncTime) / 1000;

    String calJSON = "{ \"type\": \"cal_status\", " +
                     String("\"device_id\": \"") + DEVICE_ID + "\", " +
                     "\"timestamp\": " + String(ts) +
                     ", \"sys\": " + sysCal +
                     ", \"gyro\": " + gyroCal +
                     ", \"accel\": " + accelCal +
                     ", \"mag\": " + magCal +
                     ", \"status\": " + (complete ? "true" : "false") + " }";

    Serial2.println(calJSON);
    Serial.println(calJSON);

    if (complete) {
      delay(3000);
      Serial.println("Calibration complete. Waiting for CAPTURE_ORIENTATION...");
      delay(2000);
      calibrated = true;
      waitingForCalibration = false;
      break;
    }

    delay(500);
  }
}

int readFSR(int pin) {
  return analogRead(pin);
}

String generateSensorData(unsigned long timestamp) {
  int fsrValues[16];
  for (int i = 0; i < 16; i++) fsrValues[i] = readFSR(fsrPins[i]);

  imu::Quaternion currentQuat = bno.getQuat();
  imu::Quaternion relQuat = initialQuat.conjugate() * currentQuat;

  imu::Vector<3> euler = bno.getVector(Adafruit_BNO055::VECTOR_EULER);
  float rYaw = euler.x() - initialYaw;
  float rPitch = euler.y() - initialPitch;
  float rRoll = euler.z() - initialRoll;

  imu::Vector<3> accel = bno.getVector(Adafruit_BNO055::VECTOR_LINEARACCEL);
  imu::Vector<3> gyro = bno.getVector(Adafruit_BNO055::VECTOR_GYROSCOPE);

  uint8_t sysCal, gyroCal, accelCal, magCal;
  bno.getCalibration(&sysCal, &gyroCal, &accelCal, &magCal);

  String json = "{ \"type\": \"sensor_data\", \"device_id\": \"" + String(DEVICE_ID) + "\", \"timestamp\": " + String(timestamp);
  for (int i = 0; i < 16; i++) json += ", \"FSR_" + String(i + 1) + "\": " + String(fsrValues[i]);

  json += ", \"yaw\": " + String(rYaw) +
          ", \"pitch\": " + String(rPitch) +
          ", \"roll\": " + String(rRoll) +
          ", \"q0\": " + String(relQuat.w()) +
          ", \"q1\": " + String(relQuat.x()) +
          ", \"q2\": " + String(relQuat.y()) +
          ", \"q3\": " + String(relQuat.z()) +
          ", \"ax\": " + String(accel.x()) +
          ", \"ay\": " + String(accel.y()) +
          ", \"az\": " + String(accel.z()) +
          ", \"gx\": " + String(gyro.x()) +
          ", \"gy\": " + String(gyro.y()) +
          ", \"gz\": " + String(gyro.z()) +
          ", \"sys_cal\": " + String(sysCal) +
          ", \"gyro_cal\": " + String(gyroCal) +
          ", \"accel_cal\": " + String(accelCal) +
          ", \"mag_cal\": " + String(magCal) + " }";

  return json;
}

void setup() {
  Serial.begin(UART_BAUD_RATE);
  Serial2.begin(UART_BAUD_RATE, SERIAL_8N1, 16, 17);
  Wire.begin();

  Serial.println("Initializing BNO055...");
  if (!bno.begin()) {
    Serial.println("BNO055 init failed.");
    while (1);
  }

  bno.setMode(OPERATION_MODE_NDOF);
  bno.setExtCrystalUse(true);
  Serial.println("Waiting for commands...");
}

void loop() {
  if (Serial2.available()) {
    String command = Serial2.readStringUntil('\n');
    command.trim();
    Serial.println("Received: " + command);

    if (command == "PING") {
      Serial2.println("ACK");
    } else if (command.startsWith("SYNC_TIME:")) {
      String ts = command.substring(command.indexOf(":") + 1);
      syncedTime = ts.toInt();
      lastSyncTime = millis();
      Serial.printf("Time synced: %lu\n", syncedTime);
    } else if (command == "START_CALIBRATION") {
      calibrated = false;
      waitingForCalibration = true;
      startCalibration();
    } else if (command == "REQ_CAL_STATUS") {
      sendCalibrationStatus();
    } else if (command == "CAPTURE_ORIENTATION") {
      captureOrientationAndRespond();
    } else if (command == "REQ_DATA") {
      if (!calibrated) {
        Serial2.println("{ \"error\": \"NotCalibrated\" }");
        return;
      }

      unsigned long currentTime = syncedTime + (millis() - lastSyncTime) / 1000;
      String payload = generateSensorData(currentTime);
      Serial2.println(payload);
    } else {
      Serial.println("Unknown command.");
    }
  }
}
