#include <Wire.h>
#include <Arduino.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BNO055.h>
#include <utility/imumaths.h>

#define UART_BAUD_RATE 115200
#define BNO055_SAMPLERATE_DELAY_MS (100)

// BNO055 Sensor Object
Adafruit_BNO055 bno = Adafruit_BNO055(); // I2C Address 0x28 (default)

// Define GPIO pins for 16 FSR sensors
const int fsrPins[16] = {36, 39, 34, 35, 32, 33, 25, 26, 27, 14, 12, 13, 4, 0, 2, 15};

unsigned long syncedTime = 0;
unsigned long lastSyncTime = 0;

// Initial orientation storage
bool calibrated = false;
imu::Quaternion initialQuat;
float initialYaw = 0, initialPitch = 0, initialRoll = 0;

void setup() {
    Serial.begin(UART_BAUD_RATE);
    Serial2.begin(UART_BAUD_RATE, SERIAL_8N1, 16, 17); // UART TX=17, RX=16
    Wire.begin();

    Serial.println("Initializing BNO055...");
    if (!bno.begin()) {
        Serial.println("BNO055 initialization failed!");
        while (1);
    }
    
    // Set sensor to NDOF mode for absolute orientation
    bno.setMode(OPERATION_MODE_NDOF);
    
    // Use external crystal for stability
    bno.setExtCrystalUse(true);

    Serial.println("ESP32 Sensor Node Ready!");

    // **Wait for full calibration before proceeding**
    Serial.println("Waiting for sensor calibration...");
    uint8_t sysCal, gyroCal, accelCal, magCal;

    while (true) {
        bno.getCalibration(&sysCal, &gyroCal, &accelCal, &magCal);
        Serial.printf("Calibration - Sys: %d, Gyro: %d, Accel: %d, Mag: %d\n", 
                      sysCal, gyroCal, accelCal, magCal);

        if (sysCal > 0 && gyroCal == 3 && accelCal > 0 && magCal == 3) {
            delay(3000);
            Serial.println("Calibration complete! Storing initial orientation...");
            delay(5000);
            // Store initial absolute quaternion
            initialQuat = bno.getQuat();

            // Store initial Euler angles (Yaw, Pitch, Roll)
            imu::Vector<3> euler = bno.getVector(Adafruit_BNO055::VECTOR_EULER);
            initialYaw = euler.x();
            initialPitch = euler.y();
            initialRoll = euler.z();

            calibrated = true;

            Serial.printf("Initial Yaw: %.2f, Pitch: %.2f, Roll: %.2f\n", 
                          initialYaw, initialPitch, initialRoll);
            Serial.printf("Initial Quaternion: q0=%.2f, q1=%.2f, q2=%.2f, q3=%.2f\n",
                          initialQuat.w(), initialQuat.x(), initialQuat.y(), initialQuat.z());
            break;
        }
        delay(500); // Check calibration status every 500ms
    }
}

int readFSR(int pin) {
    int value = analogRead(pin);
    delay(10);
    return value;
}

void loop() {
    if (Serial2.available()) {
        String command = "";
        while (Serial2.available()) {
            char receivedChar = Serial2.read();
            command += receivedChar;
            delay(1);
        }
        command.trim();
        Serial.print("Received Command: ");
        Serial.println(command);

        if (command == "PING") {
            Serial.println("Received PING, sending ACK...");
            Serial2.println("ACK");
            return;
        }

        if (command.startsWith("SYNC_TIME:")) {
            int index = command.indexOf(":") + 1;
            if (index > 0) {
                String timeStr = command.substring(index);
                timeStr.trim();
                syncedTime = timeStr.toInt();
                lastSyncTime = millis();
                Serial.printf("Time Synced: %lu\n", syncedTime);
            } else {
                Serial.println("Invalid SYNC_TIME message received!");
            }
            return;
        }

        if (command == "REQ_DATA") {
            Serial.println("Received REQ_DATA, sending sensor readings...");
            unsigned long currentTime = syncedTime + (millis() - lastSyncTime) / 1000;

            // Read all 16 FSR sensors
            int fsrValues[16];
            for (int i = 0; i < 16; i++) {
                fsrValues[i] = readFSR(fsrPins[i]);
            }

            // Get Current Quaternion
            imu::Quaternion currentQuat = bno.getQuat();

            // Compute Relative Quaternion
            imu::Quaternion initialQuatInv = initialQuat.conjugate(); // Get inverse of initial quaternion
            imu::Quaternion relativeQuat = initialQuatInv * currentQuat;

            // Get Current Euler Angles
            imu::Vector<3> euler = bno.getVector(Adafruit_BNO055::VECTOR_EULER);

            // Compute Relative Euler Angles
            float relativeYaw = euler.x() - initialYaw;
            float relativePitch = euler.y() - initialPitch;
            float relativeRoll = euler.z() - initialRoll;

            // Get IMU Data
            imu::Vector<3> accel = bno.getVector(Adafruit_BNO055::VECTOR_LINEARACCEL);
            imu::Vector<3> gyro = bno.getVector(Adafruit_BNO055::VECTOR_GYROSCOPE);

            // Get Calibration status
            uint8_t sysCal, gyroCal, accelCal, magCal;
            bno.getCalibration(&sysCal, &gyroCal, &accelCal, &magCal);

            // Construct JSON with all sensor readings
            String sensorData = "{ \"timestamp\": " + String(currentTime) +
                                ", \"FSR_1\": " + String(fsrValues[0]) +
                                ", \"FSR_2\": " + String(fsrValues[1]) +
                                ", \"FSR_3\": " + String(fsrValues[2]) +
                                ", \"FSR_4\": " + String(fsrValues[3]) +
                                ", \"FSR_5\": " + String(fsrValues[4]) +
                                ", \"FSR_6\": " + String(fsrValues[5]) +
                                ", \"FSR_7\": " + String(fsrValues[6]) +
                                ", \"FSR_8\": " + String(fsrValues[7]) +
                                ", \"FSR_9\": " + String(fsrValues[8]) +
                                ", \"FSR_10\": " + String(fsrValues[9]) +
                                ", \"FSR_11\": " + String(fsrValues[10]) +
                                ", \"FSR_12\": " + String(fsrValues[11]) +
                                ", \"FSR_13\": " + String(fsrValues[12]) +
                                ", \"FSR_14\": " + String(fsrValues[13]) +
                                ", \"FSR_15\": " + String(fsrValues[14]) +
                                ", \"FSR_16\": " + String(fsrValues[15]) +
                                ", \"yaw\": " + String(relativeYaw) +
                                ", \"pitch\": " + String(relativePitch) +
                                ", \"roll\": " + String(relativeRoll) +
                                ", \"q0\": " + String(relativeQuat.w()) +
                                ", \"q1\": " + String(relativeQuat.x()) +
                                ", \"q2\": " + String(relativeQuat.y()) +
                                ", \"q3\": " + String(relativeQuat.z()) +
                                ", \"ax\": " + String(accel.x()) +
                                ", \"ay\": " + String(accel.y()) +
                                ", \"az\": " + String(accel.z()) +
                                ", \"gx\": " + String(gyro.x()) +
                                ", \"gy\": " + String(gyro.y()) +
                                ", \"gz\": " + String(gyro.z()) +
                                ", \"sys_cal\": " + String(sysCal) +
                                ", \"gyro_cal\": " + String(gyroCal) +
                                ", \"accel_cal\": " + String(accelCal) +
                                ", \"mag_cal\": " + String(magCal) +
                                " }";

            Serial.println("Sending Sensor Data: " + sensorData);
            Serial2.println(sensorData);
        } else {
            Serial.println("Unrecognized command received!");
        }
    }
}
