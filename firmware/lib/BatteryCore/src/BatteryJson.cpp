#include "BatteryJson.h"
namespace Battery {
bool toJson(char* out,std::size_t size,const Reading& reading,uint32_t now,
            float adcMv,float unfilteredV) {
  // GÖREV 2 TODO: docs/API.md şemasını üret. NaN/sonsuzluğu JSON'a yazma.
  // Geçersiz/eski ölçümde voltage ve percentage null. Örnek yoksa stale.
  (void)reading;(void)now;(void)adcMv;(void)unfilteredV;
  if (out && size) out[0]='\0';
  return false; // Henüz uygulanmadı; çalışan JSON varmış gibi davranma.
}
}

