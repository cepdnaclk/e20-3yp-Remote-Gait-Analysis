#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <Arduino.h>
#include <WiFiManager.h>  // https://github.com/tzapu/WiFiManager
#include <Preferences.h>

// Configuration
// const char* ssid = "Yohan's Galaxy A52";
// const char* password = "11111111";
const char* mqtt_server = "a18e6b70jffugd-ats.iot.eu-north-1.amazonaws.com";
const String DEVICE_ID = "601";

bool stopStreaming = true;
bool calibrationComplete = false;
bool streamingActive = false;

// Time settings
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 0, 60000);
const unsigned long TIME_SYNC_INTERVAL_MS = 5000;
const unsigned long SENSOR_INTERVAL_MS = 100;
const unsigned long DEVICE_ALIVE_INTERVAL_MS = 30000;

unsigned long lastTimeSync = 0;
unsigned long lastSensorRequest = 0;
unsigned long lastAliveSent = 0;

WiFiClientSecure espClient;
PubSubClient client(espClient);

// To save wifi credentials
Preferences preferences;

// AWS IoT Certificates
const char AWS_CERT_CA[] = R"EOF(
-----BEGIN CERTIFICATE-----
MIIDQTCCAimgAwIBAgITBmyfz5m/jAo54vB4ikPmljZbyjANBgkqhkiG9w0BAQsF
ADA5MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRkwFwYDVQQDExBBbWF6
b24gUm9vdCBDQSAxMB4XDTE1MDUyNjAwMDAwMFoXDTM4MDExNzAwMDAwMFowOTEL
MAkGA1UEBhMCVVMxDzANBgNVBAoTBkFtYXpvbjEZMBcGA1UEAxMQQW1hem9uIFJv
b3QgQ0EgMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALJ4gHHKeNXj
ca9HgFB0fW7Y14h29Jlo91ghYPl0hAEvrAIthtOgQ3pOsqTQNroBvo3bSMgHFzZM
9O6II8c+6zf1tRn4SWiw3te5djgdYZ6k/oI2peVKVuRF4fn9tBb6dNqcmzU5L/qw
IFAGbHrQgLKm+a/sRxmPUDgH3KKHOVj4utWp+UhnMJbulHheb4mjUcAwhmahRWa6
VOujw5H5SNz/0egwLX0tdHA114gk957EWW67c4cX8jJGKLhD+rcdqsq08p8kDi1L
93FcXmn/6pUCyziKrlA4b9v7LWIbxcceVOF34GfID5yHI9Y/QCB/IIDEgEw+OyQm
jgSubJrIqg0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMC
AYYwHQYDVR0OBBYEFIQYzIU07LwMlJQuCFmcx7IQTgoIMA0GCSqGSIb3DQEBCwUA
A4IBAQCY8jdaQZChGsV2USggNiMOruYou6r4lK5IpDB/G/wkjUu0yKGX9rbxenDI
U5PMCCjjmCXPI6T53iHTfIUJrU6adTrCC2qJeHZERxhlbI1Bjjt/msv0tadQ1wUs
N+gDS63pYaACbvXy8MWy7Vu33PqUXHeeE6V/Uq2V8viTO96LXFvKWlJbYK8U90vv
o/ufQJVtMVT8QtPHRh8jrdkPSHCa2XV4cdFyQzR1bldZwgJcJmApzyMZFo6IQ6XU
5MsI+yMRQ+hDKXJioaldXgjUkK642M4UwtBV8ob2xJNDd2ZhwLnoQdeXeGADbkpy
rqXRfboQnoZsG4q5WTP468SQvvG5
-----END CERTIFICATE-----
)EOF";

const char AWS_CERT_CRT[] = R"EOF(
-----BEGIN CERTIFICATE-----
MIIDWTCCAkGgAwIBAgIUM2xti76vd4XX3NFM/RIJQv0hpeIwDQYJKoZIhvcNAQEL
BQAwTTFLMEkGA1UECwxCQW1hem9uIFdlYiBTZXJ2aWNlcyBPPUFtYXpvbi5jb20g
SW5jLiBMPVNlYXR0bGUgU1Q9V2FzaGluZ3RvbiBDPVVTMB4XDTI1MDIxODE5NDMw
M1oXDTQ5MTIzMTIzNTk1OVowHjEcMBoGA1UEAwwTQVdTIElvVCBDZXJ0aWZpY2F0
ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMl0ETrsr7IQ2Hc3fyti
xOCqsWifmRLiPsE8PGUlXiM4h5ux4dKOOa8ZH5s8JmNHW80vozEfFwc9GdxL77Aa
SIYXUcxO8tU/xthADOZR2qKmJuOPQ5dl89aTso+e+dD7rK1cnmCuCE98UoeOqMtN
fEo5d40zgTwZLJjzQflEMtNL6UVuuPW7CjeRju3ZKh30aEU+yii51siAgHUkc00T
vCSUKEytDCS5zphYSYU9TkBj+nn0RiFZN2npptooZBiXFoL/RUSmxPks0cPp23R6
FQwUATn8iR1cAZpopLkgDr9CMkmTnApKt2lFpK6qqoHH+Zh35qJXXSdm5uiI22nb
RGsCAwEAAaNgMF4wHwYDVR0jBBgwFoAUY3ZiKGoC7f7MLKaAgd26cyOsYV8wHQYD
VR0OBBYEFGOCZmowo7eqROIY3TUfPjtELsNLMAwGA1UdEwEB/wQCMAAwDgYDVR0P
AQH/BAQDAgeAMA0GCSqGSIb3DQEBCwUAA4IBAQCoNwvxpQvKY7jVsoZq8favAd6F
TW19dsy0k3RVGYMQQAxziIhrUfcq2X/bOxKutjegW9SGHlkX4V1/Wz3YcriU0/Mc
sz83NYGbxR3Ojznvma0Wn8Wvz9yLo881QyqrVAyu+yAEywUcl979Z5pWuQqUj3us
tHXIi2btyek2KzKOErOmmn4K621iXLgLc3jKqpsFeeN7qkSLgNTxfxBN1ZEo8nQk
QSV3FDaJFT2eg89KL5p6kbENBmpXsLoFeKhWHYz8Irg5xM6pp4qdmk7RbJUTuO5C
Xg8Yn/XlsIBL9xSi+x39zNRJyFUISi281+9X/8lKk3ojvxcwM9He3lUY9WaY
-----END CERTIFICATE-----
)EOF";

const char AWS_CERT_PRIVATE[] = R"EOF(
-----BEGIN RSA PRIVATE KEY-----
MIIEpgIBAAKCAQEAyXQROuyvshDYdzd/K2LE4KqxaJ+ZEuI+wTw8ZSVeIziHm7Hh
0o45rxkfmzwmY0dbzS+jMR8XBz0Z3EvvsBpIhhdRzE7y1T/G2EAM5lHaoqYm449D
l2Xz1pOyj5750PusrVyeYK4IT3xSh46oy018Sjl3jTOBPBksmPNB+UQy00vpRW64
9bsKN5GO7dkqHfRoRT7KKLnWyICAdSRzTRO8JJQoTK0MJLnOmFhJhT1OQGP6efRG
IVk3aemm2ihkGJcWgv9FRKbE+SzRw+nbdHoVDBQBOfyJHVwBmmikuSAOv0IySZOc
Ckq3aUWkrqqqgcf5mHfmolddJ2bm6IjbadtEawIDAQABAoIBAQCyqeCaHM3Zo70H
Rk3foZIwGtKKknkE2WiEojKCFfj+TaVfPQylW4PnOeXhHCCDjgbp3CTkbMlUnyjv
St2Bll3ZppbiFuagoBZvNab7IX9BHxCAY0+z1zTBim4jl//BC2PiwLCp188BB6Z+
GNS0sbzYa00PCq3EKiN2Zs+NDaHx59y2abBAlNRRqj0PxLu97zHFlm508hA59szl
zTHq4iyvdT/a90KDZ3ZMT3/YtHWUDO3yGDXsJIC/EK0JaIb6qGGfFlQgK9Sqtond
xR9QjvP1m6PYcbA9ZTjcFAJrzt4j4zIxlMSR3LsiVg3mZtG5187dlvnHqZOATtNg
H7hHnDyBAoGBAP7RFtj4NJ9A33iPbpLjIrt96vOHPc7ikUN0ryJWq+D6Cu2BgQjK
XtuBBYePZQlhwTP1hGctCwvf3udBzjTCjQ1ozR/Zl0IpJCbRYSWwLp655h2uktON
9H8zNEj+H+OFi13C+C9xVreoZvc6nkBBFcgfG/IFVQfnTpiagEUrSQfBAoGBAMpj
ivxXMej37St/N5yB/IkzTmBuZjyjEOXRQV3yTgM/kC2ywM1dWbRVQ5RH5f327JXV
tjAb9O6UP+ji8ZBx1GfcsBuw45PI9Ztt3PeCUJz1dD5a72dDCJMfAd9ONHsTKRgz
giw9wfJk9zfW1lLKrAhf1gp5ZcWImX+pTVxTDLcrAoGBAKbq7F6AaGgRpNFik3og
03WiDDAuXSySebmIS9jgkYK0CEiAVrgdaHm9UJP2OKcmo9qXb33uoZfLtEYkcyFY
d/Fav1Onw0+Rh57t9QctG7zZ5YV3/7IZARn5vrw5y0XNCvgGaXEae0WfSKOWgGdy
uwP2bOXi3EprGK8aNgAZVKOBAoGBAIq8U+EI8Kivk3/2tCtwG6n9ZqPJ6gF1ErdH
i5SX7gxh/TamS247qKtqq2mxI6LFKobHuh0efPcy3uCI+Wi37w/Hg11oE4kR//Mt
C4ULarE9vRKliWjy1aTsY38s/+LCTrBNVtV2/EVqGuHHPqIAVo9jCrmhYDdZnUea
yfIY6CWDAoGBAJFBa+9L1ORf1mivb9+z+qj9pwKJV78UpTH/EEATlhL43LDjPWUo
g1fZUCJtDRE4QbW2bYATuURTfugtDF1dJbIGLcbm9LA8Ydv0J9zzsH65tBmEqb2o
mYFN+v2f6ri4+C7mXZTX49RLmA5OCaZyh0YK/onQ7hX7cUcJBdpMEDtH
-----END RSA PRIVATE KEY-----
)EOF";

// void connectWiFi() {
//   Serial.print("Connecting to WiFi...");
//   WiFi.begin(ssid, password);
//   while (WiFi.status() != WL_CONNECTED) {
//     Serial.print(".");
//     delay(1000);
//   }
//   Serial.println("\nWiFi Connected!");
// }

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFiManager wm;

  // Optional timeout to auto start AP if can't connect
  //wm.setTimeout(30); // 30s timeout

  // Load previously saved credentials from NVS (Preferences)
  preferences.begin("wifi", true);
  String savedSSID = preferences.getString("ssid", "");
  String savedPASS = preferences.getString("pass", "");
  preferences.end();

  bool res;
  if (savedSSID != "" && savedPASS != "") {
    // Attempt saved connection first
    WiFi.begin(savedSSID.c_str(), savedPASS.c_str());
    Serial.print("Trying saved credentials...");
    unsigned long start = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - start < 10000) {
      delay(500);
      Serial.print(".");
    }
    res = WiFi.status() == WL_CONNECTED;
  } else {
    res = false;
  }

  // If failed, start AP mode for config
  if (!res) {
    Serial.println("\nStarting config portal...");
    if (wm.autoConnect("RehabGait_WifiConfig")) {
      Serial.println("WiFi Connected.");
      
      // Save newly connected credentials to NVS
      preferences.begin("wifi", false);
      preferences.putString("ssid", WiFi.SSID());
      preferences.putString("pass", WiFi.psk());
      preferences.end();
    } else {
      Serial.println("Failed to connect and no config done.");
      ESP.restart();  // optional fallback
    }
  } else {
    Serial.println("\nWiFi Connected with saved credentials.");
  }
}


void connectAWS() {
  espClient.setCACert(AWS_CERT_CA);
  espClient.setCertificate(AWS_CERT_CRT);
  espClient.setPrivateKey(AWS_CERT_PRIVATE);
  client.setServer(mqtt_server, 8883);

  while (!client.connected()) {
    Serial.print("Connecting to AWS IoT...");
    if (client.connect("ESP32_Insole_Sensor")) {
      Serial.println("Connected to AWS!");
    } else {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Retrying in 5s...");
      delay(5000);
    }
  }
}

void publishDeviceAlive() {
  unsigned long ts = timeClient.getEpochTime();
  String topic = "device/" + DEVICE_ID + "/status/alive";
  String payload = "{ \"type\": \"device_alive\", \"device_id\": \"" + DEVICE_ID + "\", \"status\": true, \"timestamp\": " + String(ts) + " }";
  client.publish(topic.c_str(), payload.c_str());
  Serial.println("Published device_alive heartbeat.");
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) message += (char)payload[i];

  Serial.println("MQTT Command Received: " + message);

  if (message.indexOf("\"command\":") != -1) {
    if (message.indexOf("check_calibration") != -1) {
      Serial2.println("REQ_CAL_STATUS");
      Serial.println("requesting cal status");
    } else if (message.indexOf("start_calibration") != -1) {
      Serial2.println("START_CALIBRATION");
      calibrationComplete = false;
    } else if (message.indexOf("capture_orientation") != -1) {
      Serial2.println("CAPTURE_ORIENTATION");
    } else if (message.indexOf("start_streaming") != -1) {
      Serial.println("Start streaming session...");
      stopStreaming = false;
      streamingActive = true;
    } else if (message.indexOf("stop_streaming") != -1) {
      Serial.println("Stop streaming session...");
      stopStreaming = true;
      streamingActive = false;
    }
  }
}

void setup() {
  Serial.begin(115200);
  Serial2.begin(115200, SERIAL_8N1, 16, 17);

  connectWiFi();
  timeClient.begin();
  connectAWS();
  client.setBufferSize(1024);
  client.setCallback(mqttCallback);

  String commandTopic = "device/" + DEVICE_ID + "/command";
  client.subscribe(commandTopic.c_str());
  Serial.println("Subscribed to command topic: " + commandTopic);

  // Sensor Node Handshake
  bool sensorNodeReady = false;
  for (int i = 0; i < 20; i++) {
    Serial2.println("PING");
    delay(500);
    if (Serial2.available()) {
      String response = Serial2.readStringUntil('\n');
      response.trim();
      if (response == "ACK") {
        sensorNodeReady = true;
        break;
      }
    }
  }

  if (!sensorNodeReady) {
    Serial.println("Sensor Node not responding to PING.");
    while (true) delay(1000);
  }

  publishDeviceAlive();  // First heartbeat
  lastAliveSent = millis();
}

void loop() {
  if (!client.connected()) connectAWS();
  client.loop();

  unsigned long now = millis();

  // Time sync
  if (now - lastTimeSync >= TIME_SYNC_INTERVAL_MS) {
    timeClient.update();
    // unsigned long epoch = timeClient.getEpochTime();
    // Serial2.printf("SYNC_TIME:%lu\n", epoch);
    // unsigned long epoch_ms = timeClient.getEpochTime() * 1000 + (millis() % 1000);  // sync in milliseconds
    // Serial2.printf("SYNC_TIME_MS:%lu\n", epoch_ms);
    uint64_t epoch_ms = static_cast<uint64_t>(timeClient.getEpochTime()) * 1000 + (millis() % 1000);
    Serial2.printf("SYNC_TIME_MS:%llu\n", epoch_ms);


    lastTimeSync = now;
    Serial.println("Time Synced");
  }

  // Periodic device_alive status
  if (now - lastAliveSent >= DEVICE_ALIVE_INTERVAL_MS) {
    publishDeviceAlive();
    lastAliveSent = now;
  }

  // Read sensor messages and publish without modification
  if (Serial2.available()) {
    String line = Serial2.readStringUntil('\n');
    line.trim();

    if (line.startsWith("{") && line.indexOf("\"type\":") != -1) {
      if (line.indexOf("\"type\": \"cal_status\"") != -1) {
        client.publish(("device/" + DEVICE_ID + "/status/calibration").c_str(), line.c_str());
      } else if (line.indexOf("\"type\": \"orientation_captured\"") != -1) {
        client.publish(("device/" + DEVICE_ID + "/status/orientation").c_str(), line.c_str());
      } else {
        Serial.println("Received unknown typed message: " + line);
      }
    }
  }

  // Sensor data request loop
  if (!stopStreaming && streamingActive && (millis() - lastSensorRequest >= SENSOR_INTERVAL_MS)) {
    lastSensorRequest = millis();
    Serial2.println("REQ_DATA");

    String sensorData = "";
    unsigned long startWait = millis();
    while (millis() - startWait < 100) {
      if (Serial2.available()) {
        sensorData = Serial2.readStringUntil('\n');
        sensorData.trim();
        break;
      }
    }

    if (sensorData.startsWith("{") && sensorData.indexOf("timestamp") != -1) {
      // Just forward it directly (sensor already embeds device_id & timestamp)
      String topic = "device/" + DEVICE_ID + "/sensor_data";
      client.publish(topic.c_str(), sensorData.c_str());
    }
  }
}
