# Testlerin kapsamı

Başlangıçta işlevsel testler henüz yazılmadı. Derlemenin veya yapı kontrolünün geçmesi ürünün bittiğini göstermez.

| Görev | Eklenecek kontroller |
|---|---|
| 1 | Telefon/PC taşma, doğru pil doluluğu, bilinmeyen durumlar, ölçüm yok ve offline görünümü |
| 2 | JSON şeması, null/NaN, eski ölçüm, HTTP hatası, zaman aşımı, yeniden bağlanma, tek eşzamanlı istek |
| 3 | Yüzde eğrisi, sınırlar, filtre, geçersiz ölçüm, durum kararlılığı, millis taşması |

Her kişi kendi test dosyalarını bu klasöre ekler. Gerçek devre sonuçlarını docs/test-kayitlari/ içinde tarih ve koşulla kaydeder. Pil yüzdesi ve şarj davranışı fiziksel devre olmadan doğrulanmış sayılmaz.

