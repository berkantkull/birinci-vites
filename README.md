# Ehliyet Yolu

Türkiye'de B sınıfı sürücü belgesine hazırlanan adaylar için geliştirilmiş Expo ve React Native tabanlı mobil çalışma uygulaması.

## v0.1.0 kapsamı

- 163 soruluk havuzdan MEB konu dağılımına göre hazırlanan 50 soruluk sınav provası
- 45 dakikalık sayaç, ara verme ve kaldığın yerden devam etme
- Açıklamalı konu çalışmaları ve kişiye özel Bugünün Rotası
- Hatalarım Defteri, konu başarıları ve çalışma geçmişi
- 15 senaryoluk havuzdan değişen Kavşak Laboratuvarı turları
- 26 levhalık Trafik İşaretleri keşif alanı ve hızlı test
- Kaput altı, bagaj, kokpit, göstergeler, pedallar ve lastikler için araç tanıma çalışması
- Direksiyon sınavı öncesi araç bilgisi provası ve sürüş hazırlık listesi
- Uygulama içinden okunabilen 2026 MEB e-Sınav kılavuzu
- iOS 26 ve üzerindeki desteklenen cihazlarda Liquid Glass görünümü

## Kurulum

Node.js 22.13 veya üzeri ve npm gerekir.

```sh
npm install
npm start
```

Terminaldeki QR kodunu Expo SDK 57 ile uyumlu Expo Go uygulamasında okut. Telefon ve bilgisayarın aynı ağda olması gerekir. Web önizlemesi `http://localhost:8081` adresinde açılır.

```sh
npm run web
npm run android
npm run ios
```

Windows üzerinde yerel iOS derlemesi yapılamaz. iOS için Expo Go, development build veya EAS Build kullanılabilir.

## Doğrulama

```sh
npm run typecheck
npm test
npx expo export --platform web
```

## Teknik yapı

- Expo SDK 57
- React Native ve TypeScript
- AsyncStorage ile cihaz içi kayıt
- React Native SVG ile uygulama içi çizimler
- `expo-glass-effect` ile desteklenen iOS cihazlarında Liquid Glass

Ana ekran akışı [App.tsx](App.tsx), sınav motoru [src/examEngine.ts](src/examEngine.ts), soru modeli [src/domain.ts](src/domain.ts) ve araç tanıma içeriği [src/carLesson.ts](src/carLesson.ts) dosyalarındadır. Ayrıntılı karar ve kaynak notları [docs](docs) klasöründe bulunur.

## Kapsam ve sorumluluk

Ehliyet Yolu, Millî Eğitim Bakanlığına bağlı veya MEB tarafından onaylanmış bir uygulama değildir. İçerikler eğitim ve prova amacı taşır; güncel sınavda aynı soruların çıkacağını veya sınav başarısını garanti etmez. Mevzuat ve sınav uygulamaları değişebileceği için resmî kaynaklar ayrıca kontrol edilmelidir.

Çalışma geçmişi cihazda saklanır. Hesap ve bulut yedeği henüz bulunmaz; uygulama verileri silinirse kayıtlar da silinir.

Resmî kılavuz görselleri ve üçüncü taraf kaynak içerikleri kendi hak sahiplerine aittir; MIT lisansı yalnızca bu projeye ait kaynak kodunu kapsar.

## Lisans

Projeye ait kaynak kodu [MIT Lisansı](LICENSE) ile yayımlanır.
