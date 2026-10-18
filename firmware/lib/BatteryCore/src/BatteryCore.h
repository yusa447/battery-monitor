#pragma once
#include <cstdint>

namespace Battery {
enum class Presence { Unknown, Absent, Present };
enum class Charge { Unknown, Charging, Full, NotCharging, Fault };
enum class Error { None, NotSampled, NoBattery, InvalidAdc, BelowRange, AboveRange };
struct Signals {
  Presence presence=Presence::Unknown;
  bool chargeKnown=false, charging=false;
  bool fullKnown=false, full=false;
  bool usbKnown=false, usbPresent=false;
};
struct Reading {
  bool measurementOk=false;
  float voltage=0;
  int percentage=-1;
  Presence presence=Presence::Unknown;
  Charge charge=Charge::Unknown;
  Error error=Error::NotSampled;
  uint32_t sampleId=0, sampledAt=0;
};
// GÖREV 3: Arduino bağımsız çekirdek; hata halinde percentage=-1 içeride tutulur.
// Görev 2 API'ye -1 değil null yazar.
int estimatePercent(float voltage);
Charge classifyCharge(const Signals& signals);
const char* chargeName(Charge value);
const char* errorName(Error value);
class Monitor {
  Reading reading_;
  // TODO: Filtre ve durum kararlılığı için gerekli özel alanları ekle.
 public:
  const Reading& reading() const { return reading_; }
  const Reading& update(float voltage,bool adcOk,const Signals& signals,uint32_t now,
                        float alpha=0.25f,uint32_t debounceMs=1500);
};
}

