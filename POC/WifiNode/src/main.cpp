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
//const char* mqtt_server = "a18e6b70jffugd-ats.iot.eu-north-1.amazonaws.com";
const char* mqtt_server = "aku8nka5mp21i-ats.iot.us-east-1.amazonaws.com";
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
MIIDWTCCAkGgAwIBAgIUTvi5CUrmnjPuQ11WxHS9NXb7Yi0wDQYJKoZIhvcNAQEL
BQAwTTFLMEkGA1UECwxCQW1hem9uIFdlYiBTZXJ2aWNlcyBPPUFtYXpvbi5jb20g
SW5jLiBMPVNlYXR0bGUgU1Q9V2FzaGluZ3RvbiBDPVVTMB4XDTI1MDkxNTE5NDcx
NVoXDTQ5MTIzMTIzNTk1OVowHjEcMBoGA1UEAwwTQVdTIElvVCBDZXJ0aWZpY2F0
ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANMJW+NHjf0jhFF9G8+f
bkbN++CGQissyxMo3ZmDILwcYDuTg2lRTd7b3dXWfu9o728mANutdUFuEhdPP3FR
7Tk37LQbw/qoLaussSeJYcR6uzdAUMfCsXU9Q2P/GLpq4vZpwNiz/CgkhgUC1DO8
b/7dM1j1ODto4hr9P0KP6kvKETBpYGzWGXmGCtdVILtVGV4dtj4GIwlRxG//x8Yk
8vsY10/NTgpvF+TDQpUGIMnrM9VZCFHFCt8vzc4lBdLJRemakqLtn9sYLu2H9EVo
y31wwbpdMx/nfaRnp1Zy+V1rJhlC6sVwk+htaCSpEHdtWM8RiBjviYk4XNbNSOGs
DX0CAwEAAaNgMF4wHwYDVR0jBBgwFoAUZsUwPW9e/4lxHLTrL72NcKlCEZswHQYD
VR0OBBYEFCV4JZavrVqHFUcUImaHGlfwFLGPMAwGA1UdEwEB/wQCMAAwDgYDVR0P
AQH/BAQDAgeAMA0GCSqGSIb3DQEBCwUAA4IBAQAzbB1ZgYZNio0JWguFfecs1MHm
T0jhbNQYNwKFuoqE9w4rxPORPgw8C8hLrKyzC1LjloEzxjTlD3q0xT/Fnr5r6yig
ozjofHnQBzKOQij1u4ks67cUX8wxHsZ3Kv9LtoR0G8aGAejGkEX24MsRvlE4xY/l
QFlfNh9Ur3bevMeyZNyZwxN1iNVNKljP6Gp+7p81NI8jl95QOvfFWW0CdCwXmJhf
Y2KBHuB5d3aAYlRIZrPO2PtN1k3I2UXN8wd87vbciGGm5AXlZ8KeeHWo7W7aPabN
KR20ycWbse1CeEUxmOJfXepwxMgU27tc8jMreXRIa78OPXkPDLJnNiFeLefh
-----END CERTIFICATE-----
)EOF";

const char AWS_CERT_PRIVATE[] = R"EOF(
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA0wlb40eN/SOEUX0bz59uRs374IZCKyzLEyjdmYMgvBxgO5OD
aVFN3tvd1dZ+72jvbyYA2611QW4SF08/cVHtOTfstBvD+qgtq6yxJ4lhxHq7N0BQ
x8KxdT1DY/8Yumri9mnA2LP8KCSGBQLUM7xv/t0zWPU4O2jiGv0/Qo/qS8oRMGlg
bNYZeYYK11Ugu1UZXh22PgYjCVHEb//HxiTy+xjXT81OCm8X5MNClQYgyesz1VkI
UcUK3y/NziUF0slF6ZqSou2f2xgu7Yf0RWjLfXDBul0zH+d9pGenVnL5XWsmGULq
xXCT6G1oJKkQd21YzxGIGO+JiThc1s1I4awNfQIDAQABAoIBAEpOrVAlzdUoQFsB
Fl3Q4V+E//9axsm1B/xDE2QOS+RwiWHw2wCmZCjoef/leuSJqmUUmJDBTtwvCaez
e79G/aR8EJiKfkMwHISqVeZ59TbdkDYwK0FrSFjjrWr0U5ywLiJdsk2bclogIiB5
koZ0/2paMM5N6fLhR1wBd9jUG8d7RpO/rbACgFLihunAqnCt2hiZKEBvZROteWeq
fLShZvGwK6BanUDs8PgAe8oZUrGehkmZKoL3zv5pRP/XWrrtAq+F6u4jPOJ7Sy3J
4Z5l5nT4WV1AgmG+i+rj0+8M7XkUsTyVro4LI1A7PO2Uuv+hYgMmkqH6UKzv5Wip
cdArsoECgYEA/zHxlihCWbYd84qtjATRulXlBtQv3GFOJZQ+tIv6eY1qV7amaJBe
oF+Cphi2kYnzFx+6ElQdNYML3nCDUwS7PWIFwbtTg/f0BIJVj4igbCPmWM1d6lal
J2nvcicCGXelgCEg3HaZoCeJhO2T8ws7r2FrkNK9TNkEnqcycbyefskCgYEA07PC
dR2Rv51jz6FqbgwcCQGHcQx5yBB9PZ6x+8M3nTRyk9PV2YAp6svtAskzVAVWDicu
0uN+MBUXyGRfavsN1oNQijbrrmUR0gLyrWu298pxth7l/pxAodPgi/N7B9tz+O/C
FQL723Fi1PYwC1BHHwQ04NvRjwMtXwoe347e7xUCgYANSzbAkbxTHA+XXkQIJUAf
qtXRc0BDBLajcoOJuDkGF/3QL+2fSNYFGLSfnm30SvFk5Pw2dDdJUFhP8CCHNJnk
arTOEMoa99G4Ymm+nmls+LnJKnmX+YeE9BnLIokTdo4ijJc/pNX/589cI1wvrwge
7L5DvxapaCy7bw5Lqn2/MQKBgGUtsrB6k1/6/usLAGzcCMIdIvhauBFwIAtFP1dO
M9REbsZMJhavdFktYXdFZeywKDLXcz+DTpn4WseBgUEF/9UYKXQFT5qn31553jYY
FvhSnwoltlJ7p0AwnU8F7TUSI1lEbYPRS0HT7SJPDyM5GOSwA/270WoCYLrdgWfj
RpUJAoGBAO6pFAirDe+6ubspZ7ABNKLu6N4VnEfCf1Q/o1aS4wr1C+7Z9nnH6kPC
i8aizEQg1IEKM7YO/pvYwi6mDlh40Hk6Jmix2XK0AfwSC7BycSa69RNH0fH9vqPb
KELkivA1Lh8M8BCOuPyH6ekYUxK601p2Gf/4o/QMkMxLfhnXU4FV
-----END RSA PRIVATE KEY-----
)EOF";

// This is Oldd
// void connectWiFi() {
//   Serial.print("Connecting to WiFi...");
//   WiFi.begin(ssid, password);
//   while (WiFi.status() != WL_CONNECTED) {
//     Serial.print(".");
//     delay(1000);
//   }
//   Serial.println("\nWiFi Connected!");
// }

//This works
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

//New for configuring wifi every time
// void connectWiFi() {
//   WiFi.mode(WIFI_STA);

//   // (Optional) ensure nothing auto-reconnects before we show the portal
//   WiFi.disconnect(true, true);     // erase old STA config & stop WiFi
//   delay(100);
//   WiFi.persistent(false);          // don't auto-save creds silently

//   WiFiManager wm;

//   // Optional: make the portal exit after N seconds if no config is done
//   // wm.setConfigPortalTimeout(180); // 3 minutes

//   Serial.println("\nStarting WiFi config portal (forced)...");
//   // This ALWAYS starts the AP + captive portal, *without* trying saved APs first
//   bool ok = wm.startConfigPortal("RehabGait_WifiConfig"); // , "optionalAPpass"

//   if (ok) {
//     Serial.println("WiFi Connected via portal.");
//   } else {
//     Serial.println("No config done / failed. Restarting...");
//     ESP.restart();
//   }
// }


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
