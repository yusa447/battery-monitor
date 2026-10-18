#include <Arduino.h>
#include "config.h"
#include "measurement.h"

namespace { Battery::Monitor monitor; }
void beginMeasurement() {
  // GÖREV 3 TODO: ADC1/12 bit/attenuation ve etkin durum girişlerini hazırla.
}
void sampleBattery(uint32_t now) {
  // TODO: Gerçek ADC, 32 örnek, bölücü, kalibrasyon; Signals ile monitor.update().
  // -1 olan dijital pin okunmaz. Pil varlığı voltajdan kesinleştirilmez.
  (void)now;
}
const Battery::Reading& batteryReading() { return monitor.reading(); }
float lastAdcMilliVolts() {
  // TODO: Son gerçek ADC ortalamasını döndür.
  return NAN;
}
float lastUnfilteredVoltage() {
  // TODO: Bölücü/kalibrasyon sonrası, EMA öncesi gerçek voltajı döndür.
  return NAN;
}

