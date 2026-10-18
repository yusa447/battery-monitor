#include "BatteryCore.h"
namespace Battery {
int estimatePercent(float voltage) {
  // GÖREV 3 TODO: Yaklaşık 1S Li-ion eğrisi, enterpolasyon ve 0..100 sınırı.
  // Geçersiz girişte -1. Henüz hesap yapılmadığını gösteriyoruz.
  (void)voltage; return -1;
}
Charge classifyCharge(const Signals& signals) {
  // TODO: Aktif sinyaller, çelişkiler ve bilinmeyen girişler.
  (void)signals; return Charge::Unknown;
}
const char* chargeName(Charge value) {
  switch(value) {
    case Charge::Charging:return "charging";
    case Charge::Full:return "full";
    case Charge::NotCharging:return "not_charging";
    case Charge::Fault:return "fault";
    default:return "unknown";
  }
}
const char* errorName(Error value) {
  switch(value) {
    case Error::None:return "none";
    case Error::NoBattery:return "no_battery";
    case Error::InvalidAdc:return "invalid_adc";
    case Error::BelowRange:return "below_range";
    case Error::AboveRange:return "above_range";
    default:return "not_sampled";
  }
}
const Reading& Monitor::update(float voltage,bool adcOk,const Signals& signals,uint32_t now,
                               float alpha,uint32_t debounceMs) {
  // TODO: Hata kontrolleri, EMA, yüzde, kararlı durum, sayaç ve zaman.
  // Gerçek ölçüm kodu tamamlanana kadar varsayılan geçersiz Reading kalır.
  (void)voltage;(void)adcOk;(void)signals;(void)now;(void)alpha;(void)debounceMs;
  return reading_;
}
}

