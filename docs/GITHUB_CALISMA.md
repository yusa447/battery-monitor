# GitHub çalışma düzeni

Repo: https://github.com/yusa447/battery-monitor

Repo private. Yönetici Settings → Collaborators → Add people ile arkadaşların doğru GitHub kullanıcı adını davet eder. Her kişi daveti kendi hesabıyla kabul eder. Branch'e göre ayrı davet yapılmaz; repo erişimi verilir, görev branch'i seçilir.

## İlk kez

```sh
git clone https://github.com/yusa447/battery-monitor.git
cd battery-monitor
git fetch origin
```

Sonra yalnız kendi görev satırını çalıştır:

```sh
git switch gorev/web-arayuzu
```

veya `git switch gorev/wifi-ve-web-sunucusu` / `git switch gorev/pil-olcumu`.

Zaten klonlayanlar önce `git status` ile yerel değişikliklere baksın. Değişiklik yoksa kendi branch'inde `git pull --ff-only` ile yeni başlangıcı alsın. Kaydedilmemiş işi silmek için reset/force kullanmayın.

GitHub Desktop'ta: Clone repository → Current branch → kendi görev branch'i → Open in Visual Studio Code. Yalnız ZIP indirmek ortak commit/PR akışını kurmaz.

## İş teslimi

1. Kendi dosyalarını tamamla; ortak sözleşmeyi değiştireceksen ekipçe paylaş.
2. Derleme ve görev kontrollerini çalıştır, donanımda yapılamayan testi açıkça yaz.
3. Değişiklikleri gözden geçirip commit ve push yap.
4. GitHub'da Pull requests → New pull request; base=main, compare=kendi branch'in.
5. PR açıklamasına değişiklik, test ve bekleyenleri yaz; başka ekip üyesi inceleyince birleştir.
6. Diğer görevler yeni main değişikliklerini kendi branch'lerine alır.

Klasör yapısının bütün branch'lerde aynı olması, herkesin kendi bölümünü geliştirmesine engel değildir. Branch'ler bağımsız kalıcı ürünler değil, ortak main'e dönecek çalışma alanlarıdır.

