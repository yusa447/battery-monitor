# API sözleşmesi - sürüm 1

Görev 3 Reading üretir, görev 2 JSON'a çevirir, görev 1 yalnız gösterir. Alan adlarını ekipçe anlaşmadan değiştirmeyin.

| Alan | Tür / beklenen |
|---|---|
| schema_version | 1 |
| voltage | Geçerli ölçümde filtreli V, aksi halde null |
| percentage | Geçerli ölçümde 0-100 tam sayı tahmin, aksi halde null |
| charge_state | unknown / charging / full / not_charging / fault |
| battery_present | Ayrı fiziksel giriş varsa true/false, yoksa null |
| measurement_ok | Boolean; güncel ve geçerli ADC ölçümü |
| error | none / not_sampled / no_battery / invalid_adc / below_range / above_range / stale |
| sample_id | Her gerçek örnekte artan uint32; 0 = örnek yok |
| age_ms | uint32(now - sampledAt); son ölçümün yaşı |
| adc_mv | Son kalibre edilmiş ADC ortalaması mV veya null |
| unfiltered_voltage | Bölücü/kalibrasyon sonrası EMA öncesi V veya null |
| estimated | true |

- GET `/api/battery`: bu şema. İletişim çalışırken ölçüm geçersizse HTTP 200 + measurement_ok=false.
- GET `/api/info`: sürüm, kart ve etkin girişler; şifre döndürülmez.
- GET `/health`: ağ/sunucu cevabı; pil sağlığını kanıtlamaz.
- Statik yollar: `/`, `/style.css`, `/model.js`, `/ui.js`, `/app.js`.
- Bilinmeyen yol HTTP 404. İç serileştirme hatası HTTP 500.

Ölçüm yok veya age_ms > 3000 ise voltage/percentage null, charge_state unknown, battery_present null; error stale. Tarayıcı da bu veriyi güncel ölçüm gibi çizmez. Sayaç 4 saniyeden uzun ilerlemiyorsa bağlantı/veri uyarısı verir. İstek 3 saniyede zaman aşımına uğrar; yaklaşık saniyede bir ve çakışmadan tekrarlanır.

Durum girişleri kapalıysa unknown. İki şarj çıkışı aynı anda aktifse fault. USB algısı etkin ve besleme yoksa, çelişkili sinyal de yoksa not_charging. İki durum çıkışının pasif olması tek başına boşalıyor demek değildir. full sinyali yüzdeyi zorla 100 yapmaz.

measurementOk=false iken C++ içindeki percentage=-1 değerini API'ye -1 olarak yazmayın; null kullanın. NaN/Infinity JSON'a yazılmaz. Cache-Control: no-store, aynı köken üzerinden erişim; CORS ve internet gerekmez.

