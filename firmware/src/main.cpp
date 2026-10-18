#include <Arduino.h>
#include "config.h"
#include "measurement.h"
#include "network.h"

// ORTAK entegrasyon omurgası. Görev sahipleri kendi modüllerini tamamlar.
void setup() {
  Serial.begin(115200);
  Serial.println("Pil Takip - gelistirme iskeleti, gorevler henuz tamamlanmadi.");
  beginMeasurement();
  if (!beginNetwork()) Serial.println("Ag baslatilmadi: network.cpp gorevini tamamlayin.");
}
void loop() {
  static uint32_t lastSample=0;
  const uint32_t now=millis();
  if (static_cast<uint32_t>(now-lastSample)>=Config::SamplePeriodMs) {
    lastSample=now;
    sampleBattery(now);
  }
  handleNetwork();
  delay(1);
}

