#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <BatteryJson.h>
#include "config.h"
#include "measurement.h"
#include "network.h"
#include "web_assets.h"

bool beginNetwork() {
  // GÖREV 2 TODO: Şifreli AP + 192.168.4.1 + WebServer(80).
  // Statik uçlar: /, /style.css, /model.js, /ui.js, /app.js.
  // Veri: /api/battery -> batteryReading() -> Battery::toJson().
  // Yardımcı: /api/info, /health; bilinmeyen adres 404.
  // Gerçek kurulum başarısına göre true/false döndür.
  return false;
}
void handleNetwork() {
  // TODO: server.handleClient(); ölçümü burada tekrar okuma.
}

