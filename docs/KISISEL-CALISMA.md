Güncel araç tanıma kapsamı: [36 adımlık araç tanıma](ARAC-TANIMA.md). Aşağıdaki araç sahnesi notları ilk altı adımlık sürümü anlatır.

# Kişisel tekrar ve araç tanıma

- Ana sayfadaki kısa çalışma en fazla 5 soru seçer. Yanlışlar ve pekiştirilecek sorular önceliklidir. Yanlış yoksa cevaplanmamış sorulardan konuları çeşitlendiren bir başlangıç turu oluşturur. Günlük takvim kilidi yoktur.
- Hatalarım defteri mevcut tamamlanmış çalışma geçmişinden türetilir. Boş cevaplar yanlış sayılmaz. Yanlış sonrası bir doğru Pekiştir, iki ardışık doğru Öğrendim durumunu oluşturur; yeni yanlış tekrar açar. Bu basit öğrenme göstergesi uzman yeterlilik değerlendirmesi değildir.
- Açıklama açmak durumu değiştirmez. Tek soru veya en fazla 5 soruyla tekrar başlatılabilir. Çalışma tamamlandığında defter ve öneri güncellenir.
- Araç sahnesi: dörtlü ikaz, iç dikiz aynası, korna, hız göstergesi, manuel vites kolu, mekanik park freni. Ölçeklenen SVG kokpit üzerinde erişilebilir dokunma hedefleri vardır. Doğru hedef ve yanlış seçim çerçeveyle ayrılır, açıklama metni de gösterilir.
- Araç tanıma turunda ilk seçim puanlanır; tamamlama sırasında sonuç ayrı AsyncStorage anahtarında tutulur. Son ve en iyi tur gösterilir. Son 100 tur saklanır. Yazma hatasında aynı sonuç tekrar denenir; okuma hatasında eski kayıtların üzerine yazılmaz. Yarım araç turundan ayrılınca tur yeniden başlar; bu ilk sahnede yarım tur kaydı yoktur.
- Bu örnek kokpit bir markanın birebir kopyası veya resmî direksiyon sınavının eksiksiz simülasyonu değildir. Parça yerleri araca göre değişir.

Doğrulama: TypeScript, 14 otomatik test ve web/iOS/Android export geçti. Tarayıcıda geçmişten defter oluşturma, tek soruluk tekrar sonrasında Pekiştir durumuna geçiş ve altı parçalık kokpit turunun sonucu kaydetmesi doğrulandı. Native cihazda dokunma ve ekran okuyucu testi ayrıca yapılmalıdır.
