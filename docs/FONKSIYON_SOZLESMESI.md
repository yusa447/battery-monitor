# Oluşturulacak fonksiyonlar ve modüllerin bağlantısı

Aşağıdaki kaynak kod dosyaları henüz oluşturulmadı. İmzalar ekip için tasarım sözleşmesidir; her kişi kendi dosyalarını sıfırdan yazacaktır.

## Tarayıcı

index.html dosyasında `defer` ile sıra: **model.js → ui.js → app.js**. Harici bağımlılık yok.

| Fonksiyon | Dosya | Sözleşme |
|---|---|---|
| BatteryModel.validate(data) | web/model.js | Geçerli veri nesnesini döndürür, geçersizse Error fırlatır |
| BatteryUI.render(data) | web/ui.js | Doğrulanmış API verisini çizer; sayı uydurmaz |
| BatteryUI.offline(message) | web/ui.js | Eski ölçümleri temizler; bağlantı uyarısı ve son veri zamanı |
| pollBattery() | web/app.js | Fetch → validate → render; hata → offline |
| startApp() | web/app.js | İlk istek, zamanlama ve refresh düğmesini bağlar |

Ortak DOM kimlikleri: `connection-text`, `battery`, `battery-fill`, `percentage`, `percent-unit`, `voltage`, `charge-state`, `presence`, `updated`, `notice-text`, `refresh`, `adc`, `unfiltered`, `sample`, `error`. Bunları değiştirmek gerekiyorsa görev 1 ve 2 birlikte günceller. Pil dolgusu güncel yüzdeyle; düşük pil rengi yaklaşık %15 ve altında; animasyon yalnız charging durumunda. Geçersiz veri %0 olarak gösterilmez.

## ESP32

| Fonksiyon | Görev | Beklenen |
|---|---|---|
| void beginMeasurement() | 3 | ADC ve etkin dijital girişleri hazırlar |
| void sampleBattery(uint32_t now) | 3 | Gerçek ölçümü alıp Monitor'ü günceller |
| const Battery::Reading& batteryReading() | 3 → 2 | Son sonucu döndürür; HTTP isteğinde ölçüm tekrarlanmaz |
| float lastAdcMilliVolts() | 3 → 2 | Son ADC noktasının ortalama mV değeri |
| float lastUnfilteredVoltage() | 3 → 2 | EMA öncesi kalibre edilmiş pil V değeri |
| bool beginNetwork() | 2 | AP ve HTTP sunucusu; başarı true, hata false |
| void handleNetwork() | 2 | HTTP isteklerini işler; ana döngüden sık çağrılır |
| bool Battery::toJson(...) | 2 | Reading'i buffer'a yazar; alan yetmezse false |

`Battery::toJson(char* out, std::size_t size, const Reading& reading, uint32_t now, float adcMv, float unfilteredV)` imzası görev 2 tarafından BatteryJson.h içinde tanımlanır. Başarıda buffer null sonlandırılır. Sunucu false sonucunda HTTP 500 verir.

## Ölçüm çekirdeği

BatteryCore.h Arduino bağımsız kalır. Görev 3, gerekli filtre/debounce alanlarını Monitor sınıfının private bölümüne ekler.

- `estimatePercent(float voltage)`: 0-100 tam sayı tahmin, geçersiz girişte -1.
- `classifyCharge(const Signals&)`: mantıksal şarj durumu; kararlılık filtresi Monitor içinde uygulanır.
- `Monitor::update(float voltage, bool adcOk, const Signals&, uint32_t now, float alpha, uint32_t debounceMs)`: filtreli voltaj, hata, yüzde, durum, sampleId ve sampledAt günceller.
- `Monitor::reading()`: güncel Reading'e const referans.

Reading alan eşlemesi: measurementOk→measurement_ok, voltage→voltage, percentage→percentage, presence→battery_present, charge→charge_state, error→error, sampleId→sample_id, sampledAt→age_ms hesabı. sampledAt doğrudan saat/tarih değildir; millis sayacıdır.

## Tam akış

1. main.cpp setup: beginMeasurement(), beginNetwork().
2. main.cpp loop: 500 ms'de sampleBattery(now); her döngüde handleNetwork().
3. GET /api/battery: batteryReading() + teşhis değerleri → toJson().
4. app.js: yanıtı alır → model.js doğrular → ui.js çizer.
5. embed_web.py: index/style/model/ui/app dosyalarını WEB_INDEX, WEB_STYLE, WEB_MODEL, WEB_UI, WEB_APP sembollerine dönüştürür.

