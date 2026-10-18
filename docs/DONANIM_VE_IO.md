# Donanım ve I/O varsayımları

Fotoğraftaki klasik ESP32 geliştirme kartı, TP4056 tipi şarj modülü, standart tek hücre 4,2 V Li-ion pil esas alınır. Kesin pil modeli, şarj akımı ve şarj sinyali arayüzleri EE tarafından onaylanır. Bu dosya onaylanmış son devre şeması değildir.

| Giriş / ayar | Başlangıç |
|---|---|
| ADC | GPIO34 / ADC1; 12 bit, ADC_2_5db, analogReadMilliVolts() |
| Üst / alt direnç | 100 kΩ / 27 kΩ |
| Kondansatör | Ölçüm noktası ile doğrulanmış referans GND arasına 100 nF |
| Ölçüm periyodu / örnek sayısı | 500 ms / 32 |
| EMA / durum kararlılığı | alpha=0,25 / 1500 ms |
| ChargingPin / ChargeCompletePin | -1; arayüz onaylanana kadar kapalı |
| UsbPresentPin / BatteryPresentPin | -1; isteğe bağlı, kapalı |

Pil/korumalı çıkış + → 100k → ölçüm noktası → 27k → ölçüm referansı. GPIO34 ölçüm noktasına; 100 nF de bu nokta ile referans arasına bağlanır. ESP32 GND'nin doğru referansa bağlanmasını EE doğrular. B- ile OUT- aynı varsayılmaz, koruma etrafından USB/toprak köprüsü oluşturulmaz.

Pil gerilimini GPIO34 veya 3V3'e doğrudan vermeyin. TP4056 LED hatları 5 V'a bağlı olabilir; doğrudan GPIO'ya bağlanmaz. CHRG/STDBY için kararlı 0-3,3 V arayüz ve polarite doğrulanınca config.h pinleri etkinleştirilir. 5 V şarj girişi de doğrudan GPIO'ya verilmez.

ESP32 ilk sürümde yalnız kendi USB girişinden beslenir; TP4056 ayrı 5 V girişinden pili şarj eder. ESP32 izlenen pilin yükü değildir. Azalış göstermek için uygun yük devresi ayrıca EE ile planlanır. Şarjı ve korumayı yazılım yönetmez.

Yüzde yaklaşık gerilim eğrisinden hesaplanır; şarj takma/çıkarma anındaki voltaj değişimi gerçek enerji değişimine eşit değildir. Ayrı fiziksel algılayıcı yoksa pil varlığı null kalır; şarj kartı pil yokken de gerilim gösterebilir.

İlk devre testleri: USB ile yazılım/ağ, bölücü voltajının multimetreyle doğrulanması, kalibrasyon, ardından onaylı şarj durum girişleri. Yazılımdaki ölçüm aralıkları pil koruma sınırı yerine geçmez.

