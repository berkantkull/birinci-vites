# İlk sürüm doğrulaması — 14 Eylül 2026

- TypeScript tip kontrolü geçti.
- Üç otomatik test geçti: doğru/yanlış/boş puanlama; tekrarların farklı soru sayısını artırmaması; geçerli kayıtları okuma ve bozuk veriyi reddetme.
- Expo web üretim çıktısı başarıyla üretildi.
- Tarayıcıda konu çalışması: cevap seçme, anlık açıklama, cevabın kilitlenmesi, boş soru uyarısı ve sonuç doğrulandı.
- Tarayıcı yeniden yüklenince tamamlanan çalışma geçmişi korundu.
- Mini denemede sayaç ilerledi; cevap açıklamaları sonuçtan önce gösterilmedi. 1 doğru, 1 yanlış, 6 boş sonucu yuvarlanmış %13 olarak kaydedildi; tekrar/ilk karşılaşma ayrımı görüldü.
- 390 × 844 görünümünde ana ekran görsel olarak kontrol edildi.

Fiziksel Android/iOS cihaz testi ve sayacın sıfıra ulaşmasını bekleyen uçtan uca test yapılmadı. Arka plan dönüşünde sayaç bitiş zamanından hesaplanıyor; cihaz davranışı ayrıca denenmeli.

`npm audit` 10 orta seviye bağımlılık uyarısı bildirdi. Bunlar Expo araç zincirindeki uuid/xcode bağımlılık ağacına uzanıyor; doğrudan uygulama kodunda uuid kullanılmıyor. Önerilen otomatik zorunlu düzeltme Expo 46'ya gerilettiği için uygulanmadı. Yayın öncesi uyumlu araç zinciri güncellemesiyle yeniden incelenmeli.

Tarayıcı önizlemesinde iki test çalışması bulunur; telefonun kaydı ayrı başlayacaktır.
