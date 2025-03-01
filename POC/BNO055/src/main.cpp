#include <Wire.h>
#include <Arduino.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BNO055.h>
#include <utility/imumaths.h>

#define BNO055_SAMPLERATE_DELAY_MS (100)
#define SERIAL_BAUD_RATE 115200

Adafruit_BNO055 bno = Adafruit_BNO055();

void setup() {
    Serial.begin(SERIAL_BAUD_RATE);
    if(!bno.begin()){
      Serial.println("BNO055 failed");
      while(1);
    }
    delay(200);
    int8_t temp = bno.getTemp();
    bno.setExtCrystalUse(true);

}

void loop() {
  // put your main code here, to run repeatedly:
  imu::Vector<3> acc = bno.getVector(Adafruit_BNO055::VECTOR_GRAVITY);
  Serial.print(">x:");
  Serial.println(acc.x());

  //Serial.print(",");
  Serial.print(">Y:");
  Serial.println(acc.y());

  //Serial.print(",");
  Serial.print(">Z:");
  Serial.println(acc.z());

  delay(BNO055_SAMPLERATE_DELAY_MS);
  
}

