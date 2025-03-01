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

void setup() {
    Serial.begin(UART_BAUD_RATE);
    Serial2.begin(UART_BAUD_RATE, SERIAL_8N1, 16, 17); // UART TX=17, RX=16
    Wire.begin();

    Serial.println("Initializing BNO055...");
    if (!bno.begin()) {
        Serial.println("BNO055 initialization failed!");
        while (1);
    }
    
    // Set sensor to NDOF mode for proper Euler angle output
    bno.setMode(OPERATION_MODE_NDOF);
    
    // Get temperature for initial debug
    int8_t temp = bno.getTemp();
    Serial.print("Sensor Temperature: ");
    Serial.println(temp);

    // Use external crystal for stability
    bno.setExtCrystalUse(true);

    Serial.println("ESP32 Sensor Node Ready!");

    // Check initial calibration status
    uint8_t sysCal, gyroCal, accelCal, magCal;
    bno.getCalibration(&sysCal, &gyroCal, &accelCal, &magCal);
    Serial.printf("Initial Calibration - System: %d, Gyro: %d, Accel: %d, Mag: %d\n", 
                  sysCal, gyroCal, accelCal, magCal);
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

            // Get IMU Data
            imu::Quaternion q = bno.getQuat();
            imu::Vector<3> euler = bno.getVector(Adafruit_BNO055::VECTOR_EULER);
            imu::Vector<3> accel = bno.getVector(Adafruit_BNO055::VECTOR_LINEARACCEL);
            imu::Vector<3> gyro = bno.getVector(Adafruit_BNO055::VECTOR_GYROSCOPE);

            // Get Calibration status
            uint8_t sysCal, gyroCal, accelCal, magCal;
            bno.getCalibration(&sysCal, &gyroCal, &accelCal, &magCal);

            // Construct JSON with all 16 FSR sensor readings and IMU data
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
                                ", \"yaw\": " + String(euler.x()) +
                                ", \"pitch\": " + String(euler.y()) +
                                ", \"roll\": " + String(euler.z()) +
                                ", \"q0\": " + String(q.w()) +
                                ", \"q1\": " + String(q.x()) +
                                ", \"q2\": " + String(q.y()) +
                                ", \"q3\": " + String(q.z()) +
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
