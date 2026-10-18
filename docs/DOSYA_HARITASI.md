# Dosya haritası ve sahiplik

Dosyalar main ve üç görev branch'inde aynı başlangıç yapısıyla bulunur. Branch'lerde yalnız kendi sorumluluğunu geliştir; diğer görevlerin dosyalarını silme. TODO açıklamaları yapılacak işi gösterir.

| Dosya | Sorumlu | Yazılacak kod / amaç |
|---|---|---|
| web/index.html | 1 | Tek web sayfası; sabit DOM kimlikleri, kartlar ve script sırası |
| web/style.css | 1 | Responsive düzen, pil dolgusu, şarj/düşük pil görünümleri |
| web/ui.js | 1 | BatteryUI.render(data), BatteryUI.offline(message) |
| web/model.js | 2 | BatteryModel.validate(data); tip, aralık ve şema doğrulama |
| web/app.js | 2 | startApp(), pollBattery(); fetch, zaman aşımı, sayaç, yeniden deneme |
| firmware/platformio.ini | Ortak / 2 | Sabit ESP32 derleme profili, pre-build gömme adımı |
| firmware/include/config.h | 2 + 3 + EE | Ağ ayarları 2; ölçüm/pin/kalibrasyon 3 ve EE |
| firmware/include/network.h | 2 | beginNetwork(), handleNetwork() bildirimleri |
| firmware/src/network.cpp | 2 | Wi-Fi AP ve HTTP yolları; Reading verisini sunma |
| firmware/include/measurement.h | 3 | Ölçüm arayüzü; görev 2 bu arayüzü kullanır |
| firmware/src/measurement.cpp | 3 | ADC, bölücü, durum GPIO'ları ve Monitor güncelleme |
| firmware/src/main.cpp | Ortak | setup/loop; 500 ms ölçüm ve HTTP işleme omurgası |
| firmware/lib/BatteryCore/src/BatteryCore.h | 3 / ortak sözleşme | Signals, Reading, enum ve Monitor imzaları |
| firmware/lib/BatteryCore/src/BatteryCore.cpp | 3 | estimatePercent, classifyCharge ve Monitor::update |
| firmware/lib/BatteryCore/src/BatteryJson.h | 2 | toJson(...) bildirimi |
| firmware/lib/BatteryCore/src/BatteryJson.cpp | 2 | Güvenli JSON, null ve eski veri kuralları |
| firmware/scripts/embed_web.py | 2 / hazır altyapı | 5 web dosyasını firmware'e gömer |
| firmware/include/web_assets.h | Otomatik / git dışı | Derlemede üretilir; elle oluşturulmaz/değiştirilmez |
| scripts/check_structure.py | Ortak / hazır altyapı | Beklenen dosyalar ve temel bağlantı imzalarını kontrol eder |
| tests/README.md ve eklenecek testler | Herkes | Görevine ait otomatik kontroller |
| docs/API.md | 2 / ortak onay | JSON alanları ve HTTP kuralları |
| docs/FONKSIYON_SOZLESMESI.md | Ortak | Modüllerin çağrı ve bağlantı sözleşmesi |
| docs/DONANIM_VE_IO.md | 3 + EE | Ölçüm ve durum girişlerinin onayı |
| docs/GITHUB_CALISMA.md | Ortak | Branch ve PR düzeni |
| docs/gorevler/Gorev_1_Web_Arayuzu.pdf | 1 için belge | Dosyalar, beklenen kod, bağlantılar ve kabul koşulları |
| docs/gorevler/Gorev_2_WiFi_ve_Web_Sunucusu.pdf | 2 için belge | Dosyalar, beklenen kod, bağlantılar ve kabul koşulları |
| docs/gorevler/Gorev_3_Pil_Olcumu.pdf | 3 için belge | Dosyalar, beklenen kod, bağlantılar ve kabul koşulları |
| docs/gorevler/01_web_arayuzu.md | 1 | Kısa görev özeti |
| docs/gorevler/02_wifi_ve_web_sunucusu.md | 2 | Kısa görev özeti |
| docs/gorevler/03_pil_olcumu.md | 3 | Kısa görev özeti |
| docs/test-kayitlari/ | Herkes | Gerçek test sonuçları, koşullar ve kalibrasyon kayıtları |
| .github/pull_request_template.md | Ortak | Teslimde doldurulacak PR şablonu |

Yeni sayfa açılması gerekmiyor; web/index.html tek ekran. app.js iletişimi, ui.js görünümü yönetir. Böylece iki kişi aynı JS dosyasının farklı parçalarında çalışmak zorunda kalmaz.

