#include <Wire.h>
#include <Arduino.h>
#include "I2Cdev.h"
#include "MPU6050_6Axis_MotionApps20.h"



#define UART_BAUD_RATE 115200

MPU6050 mpu;
bool dmpReady = false;
uint8_t devStatus;
uint16_t packetSize;
uint8_t fifoBuffer[64];
float ypr[3];
Quaternion q;
VectorInt16 aa;      // Raw acceleration
VectorInt16 aaReal;  // Linear acceleration (gravity-free)
VectorFloat gravity; // Gravity vector


// Define GPIO pins for 16 FSR sensors
const int fsrPins[16] = {36, 39, 34, 35, 32, 33, 25, 26, 27, 14, 12, 13, 4, 0, 2, 15};
//const int fsrPins[16] = {15, 2, 0, 4, 13, 12, 14, 27, 26, 25, 33, 32, 35, 34, 39, 36};


unsigned long syncedTime = 0;
unsigned long lastSyncTime = 0;


void setup() {
    Serial.begin(UART_BAUD_RATE);
    Serial2.begin(UART_BAUD_RATE, SERIAL_8N1, 16, 17); // UART TX=17, RX=16
    Wire.begin();

    Serial.println("Initializing MPU6050...");
    mpu.initialize();
    devStatus = mpu.dmpInitialize();

    if (devStatus == 0) {
        Serial.println("Running calibration...");

        // Run calibration every time
        mpu.CalibrateAccel(6);
        mpu.CalibrateGyro(6);

        // Get new offsets
        int16_t xGyroOffset = mpu.getXGyroOffset();
        int16_t yGyroOffset = mpu.getYGyroOffset();
        int16_t zGyroOffset = mpu.getZGyroOffset();
        int16_t zAccelOffset = mpu.getZAccelOffset();

        Serial.printf("Calibrated Offsets -> XGyro: %d, YGyro: %d, ZGyro: %d, ZAccel: %d\n", 
                      xGyroOffset, yGyroOffset, zGyroOffset, zAccelOffset);

        // Apply calibration offsets directly
        mpu.setXGyroOffset(xGyroOffset);
        mpu.setYGyroOffset(yGyroOffset);
        mpu.setZGyroOffset(zGyroOffset);
        mpu.setZAccelOffset(zAccelOffset);

        // Enable DMP
        mpu.setDMPEnabled(true);
        dmpReady = true;
        packetSize = mpu.dmpGetFIFOPacketSize();
    } else {
        Serial.println("MPU6050 DMP Initialization Failed!");
    }

    Serial.println("ESP32 Sensor Node Ready!");
}




int readFSR(int pin) {
    //int sum = 0;
    // for (int i = 0; i < 5; i++) {
    //     sum += analogRead(pin);
    //     delay(10);
    // }
    //return sum / 5;
    int value = analogRead(pin);
    delay(10);
    return value;
}

void loop() {
    if (Serial2.available()) {
        Serial.println("Data Available on Serial2... Reading...");
        
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


            if (dmpReady && mpu.dmpGetCurrentFIFOPacket(fifoBuffer)) {
                mpu.dmpGetQuaternion(&q, fifoBuffer);
                mpu.dmpGetGravity(&gravity, &q);
                mpu.dmpGetYawPitchRoll(ypr, &q, &gravity);
                mpu.dmpGetAccel(&aa, fifoBuffer);
                mpu.dmpGetLinearAccel(&aaReal, &aa, &gravity); // Get gravity-free acceleration
            }


            // Construct JSON with all 16 FSR sensor readings
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
                                ", \"yaw\": " + String(ypr[0] * 180 / M_PI) +
                                ", \"pitch\": " + String(ypr[1] * 180 / M_PI) +
                                ", \"roll\": " + String(ypr[2] * 180 / M_PI) +
                                ", \"q0\": " + String(q.w) +
                                ", \"q1\": " + String(q.x) +
                                ", \"q2\": " + String(q.y) +
                                ", \"q3\": " + String(q.z) +
                                ", \"ax\": " + String(aaReal.x) +
                                ", \"ay\": " + String(aaReal.y) +
                                ", \"az\": " + String(aaReal.z) +
                                ", \"gx\": " + String(gravity.x) +
                                ", \"gy\": " + String(gravity.y) +
                                ", \"gz\": " + String(gravity.z) + " }";

            Serial.println("Sending Sensor Data: " + sensorData);
            Serial2.println(sensorData);
        } else {
            Serial.println("Unrecognized command received!");
        }
    }
}
