# Araç tanıma: manuel otomobil

14 Eylül 2026 güncellemesi. Eski 6 adımlık sahnenin yerini 6 bölüm ve 36 alıştırma aldı:
Kaput altı 7, bagaj 6, kokpit 12, göstergeler 7, pedallar 3, lastikler 1.

Serbest çalışma, bölüm seçimi ve anlık doğru parça/açıklama sunar. Bilmiyorum seçeneği ilk cevapta yanlış olarak değerlendirilir. Aynı soruda cevabı değiştirerek puanı yükseltme yoktur. Hata sınırı serbest çalışmayı durdurmaz.

Araç bilgisi provası manuel içten yanmalı araca uygun 16 EK-4 başlığını 31 alt adımda çalıştırır. Tam resmî sınavın soru sayısı veya birebir komisyon sırası olarak sunulmaz. Her alt adım resmî I. bölüm madde numarasıyla eşleştirilir; bir madde içindeki birden fazla yanlış yalnız bir mavi hata sayılır. Beş farklı maddeye ulaşıldığında sonraki soru sunulmaz ve sonuç ekranına geçilir. Uygulanmamış sorular yanlış sayılmaz. Açıklamalar prova sonunda sunulur.

Resmî 20 maddeden otomatik vites P/R/N/D ve elektrikli araca özgü 3 madde bu örneğe dahil değildir. Dörtlü, klima, fren hidroliği, vites kolunun yerini gösterme ve akü şarj lambası ek alıştırmaları bağımsız mavi madde olarak sayılmaz. Yağ uyarısının anlamını sorgulayan adım madde 8 altında gruplanır.

Kaynak: ÖÖKGM'nin 09/01/2025'ten sonra geçerli formlar duyurusu ve EK-4 PDF'si. Son sayfanın notlarında 5 mavi, 2 sarı (aynı madde iki kez veya iki farklı madde) ve 1 kırmızı ihlal için sonlandırma yazılıdır.
https://ookgm.meb.gov.tr/meb_iys_dosyalar/2024_12/10103638_direksiyonegitimdersisinavdegerlendirmeformuek4.pdf
https://corum.meb.gov.tr/membis/direksiyon/direksiyon_otm

Kaputu açma, bagajı açma ve lambayı kumanda etme bu sürümde parçayı seçme ile temsil edilir. Gerçek mekanik hareket becerisi ölçülmez. Çizimler örnektir; üreticiye özgü konum garantisi yoktur. Lastik kontrolü ve yağ uyarısında davranış metin seçimleriyle çalışılır. Sürüş hazırlığı, yokuş, park/L dönüş, dar alanda geri dönüş ve trafik konuları öz kontrol listesidir; fizik tabanlı sürüş simülatörü değildir.

Sonuç kaydı aynı AsyncStorage anahtarında sürüm 2 olarak yazılır. Eski sürüm 1 sonuçlarında payda 6 korunur. Yeni sonuçlarda uygulanan soru sayısı, mod, bölüm ve mavi hata sayısı saklanır. Tamamlanmadan çıkılan tur kaydedilmez; son 100 sonuç tutulur. Kaydetme hatasında aynı sonuç yeniden denenir. En iyi sonuç sadece aynı kapsamda tamamlanan turlarla karşılaştırılır.

17 test: önceki testlere ek olarak 16 başlık kapsamı, aynı madde altında hataları birleştirme, ek soruların mavi sayılmaması, 4/5 sınırı ve kayıt uyumluluğu kontrol edildi. Tarayıcı testi hata sayacının 1,2,3,3,4,5 ilerleyişini ve 5'te prova bitişini doğruladı. Gerçek cihazla dokunma/erişilebilirlik testi ayrıca yapılmalıdır.
