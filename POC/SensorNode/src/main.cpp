#include <Arduino.h>

// Sensor Node (ESP32 #2)
const int fsrPins[2] = {34, 32};  // Analog sensor pins
unsigned long syncedTime = 0;
unsigned long lastSyncTime = 0;

void setup() {
    Serial.begin(115200);
    Serial2.begin(115200, SERIAL_8N1, 16, 17); // UART TX=17, RX=16
    delay(100);
    Serial.println("ESP32 #2 Sensor Node Ready!");
}

// Function to read stable ADC values
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
        
        // Read incoming UART data byte-by-byte
        String command = "";
        while (Serial2.available()) {
            char receivedChar = Serial2.read();
            command += receivedChar;
            delay(1);  // Allow buffer to fill
        }

        command.trim(); // Remove spaces/newlines
        Serial.print("Received Command: ");
        Serial.println(command);

        // Handshake Response (PING/ACK)
        if (command == "PING") {
            Serial.println("Received PING, sending ACK...");
            Serial2.println("ACK");  // Ensure clean ACK message
            return;
        }

        // Time Sync Processing
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

        // Sensor Data Request Handling
        if (command == "REQ_DATA") {
            Serial.println("Received REQ_DATA, sending sensor readings...");
            unsigned long currentTime = syncedTime + (millis() - lastSyncTime) / 1000;

            // Read FSR Sensor Data
            int fsr1 = readFSR(fsrPins[0]);
            int fsr2 = readFSR(fsrPins[1]);

            // Format JSON-like message
            String sensorData = "{ \"timestamp\": " + String(currentTime) + 
                                ", \"FSR_1\": " + String(fsr1) +
                                ", \"FSR_2\": " + String(fsr2) + " }";

            Serial.println("Sending Sensor Data: " + sensorData);
            Serial2.println(sensorData);
        } else {
            Serial.println("Unrecognized command received!");
        }
    }
}
