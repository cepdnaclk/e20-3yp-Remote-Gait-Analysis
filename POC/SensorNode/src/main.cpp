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

const int fsrPins[2] = {34, 32};  // Analog sensor pins
unsigned long syncedTime = 0;
unsigned long lastSyncTime = 0;

void setup() {
    Serial.begin(UART_BAUD_RATE);
    Serial2.begin(UART_BAUD_RATE, SERIAL_8N1, 16, 17); // UART TX=17, RX=16
    Wire.begin();
    
    mpu.initialize();
    devStatus = mpu.dmpInitialize();
    if (devStatus == 0) {
        mpu.CalibrateAccel(6);
        mpu.CalibrateGyro(6);
        mpu.setDMPEnabled(true);
        dmpReady = true;
        packetSize = mpu.dmpGetFIFOPacketSize();
    } else {
        Serial.println("MPU6050 DMP Initialization Failed!");
    }
    
    Serial.println("ESP32 Sensor Node Ready!");
}

int readFSR(int pin) {
    int sum = 0;
    for (int i = 0; i < 5; i++) {
        sum += analogRead(pin);
        delay(10);
    }
    return sum / 5;
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

            int fsr1 = readFSR(fsrPins[0]);
            int fsr2 = readFSR(fsrPins[1]);

            if (dmpReady && mpu.dmpGetCurrentFIFOPacket(fifoBuffer)) {
                Quaternion q;
                VectorFloat gravity;
                mpu.dmpGetQuaternion(&q, fifoBuffer);
                mpu.dmpGetGravity(&gravity, &q);
                mpu.dmpGetYawPitchRoll(ypr, &q, &gravity);
            }

            String sensorData = "{ \"timestamp\": " + String(currentTime) + 
                                ", \"FSR_1\": " + String(fsr1) +
                                ", \"FSR_2\": " + String(fsr2) +
                                ", \"yaw\": " + String(ypr[0] * 180 / M_PI) +
                                ", \"pitch\": " + String(ypr[1] * 180 / M_PI) +
                                ", \"roll\": " + String(ypr[2] * 180 / M_PI) + " }";

            Serial.println("Sending Sensor Data: " + sensorData);
            Serial2.println(sensorData);
        } else {
            Serial.println("Unrecognized command received!");
        }
    }
}
