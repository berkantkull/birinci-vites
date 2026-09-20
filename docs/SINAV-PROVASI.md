# Denemeler ve soru havuzu

14 Eylül 2026: Kullanıcının tercihi doğrultusunda katı salon kuralları kaldırıldı.

- Her deneme 50 soru / 45 dakika; dağılım 23 trafik, 12 ilk yardım, 9 araç tekniği, 6 trafik adabı.
- Giriş gecikmesi, ilk 15 dakika bitirme kilidi ve iki aşamalı onay yok.
- İstenildiğinde tek onayla bitirme; hiç cevap yoksa uyarı korunur.
- Ara ver butonu ana sayfaya döndürür; süre ve cevaplar korunur. Arka plana geçiş de molaya alır. Devam et ile sayaç kaldığı yerden işler.
- Süre dolunca otomatik sonuçlandırılır. Molalar sonuçtaki çalışma süresine eklenmez.
- Aynı anda tek açık çalışma tutulur. Mola sırasında rehber ve gelişim sayfaları kullanılabilir; başka çalışma için mevcut çalışma bitirilmelidir.

## Havuz

163 soru: 113 seçilmiş PDF sorusu + 50 özgün alıştırma.
Konu toplamları: trafik 63, ilk yardım 35, araç tekniği 42, trafik adabı 23.
Her denemede önce daha az karşılaşılan sorular seçilir, eşit sıklıkta olanlar rastgele karıştırılır. Geçmişteki denemelerin tüm soru kimlikleri (boşlar dahil) seçim sıklığına katılır. Yeni geçmişte ilk iki tam deneme farklı kimliklerden oluşabilir; havuz tükendikçe tekrar beklenir. Aynı kavrama yönelik farklı sorular bulunur.

`src/pdfQuestions.ts` kaynak URL'sini ve PDF soru numarasını korur. Kullanıcı kullanım izninin bu aktarmayı kapsadığını bildirdi. Yedi PDF incelendi, altısından seçki alındı; `PDF-indir-1` dosyasında güvenilir eşleşen cevap anahtarı çıkarılamadığı için bu dosyadan aktarım yapılmadı. Şekle/haritaya bağlı eksik görselli sorular, eski mevzuat riski taşıyan sorular, tekrarlar ve çelişkili anahtarlar seçkiye alınmadı. Örnek çelişkiler: PDF-2 soru 5; PDF-4 soru 45; PDF-5 soru 32 ve 47. Bunlar sessizce düzeltilmiş cevaplar olarak yayımlanmadı.

PDF satır bölünmeleri, sayfa numaraları ve başlık kalıntıları temizlendi; bozuk iki cümlenin dizgisi düzeltildi. PDF sorularında açıklama alanı yalnızca kaynak anahtarındaki doğru cevabı belirtir; ayrıntılı öğretici açıklamalar henüz eklenmedi. Görselli sorular ve video soruları bu seçkide yok. Tam uzman incelemesi veya MEB onayı iddia edilmez.

## Kayıt ve kontrol

Geçmiş ve açık oturum AsyncStorage içinde tek JSON olarak, sıraya alınmış yazmalarla saklanır. Mola anı, bitiş zamanı ve cevaplar kalıcıdır. Kayıt hatası görünürdür. Kaydetme tamamlanmadan zorla kapatma son değişikliği kaybettirebilir; işletim sistemi arka plan bildirimi vermeden uygulamayı öldürürse otomatik mola garantisi yoktur.

10 test geçti: puanlama, geçmiş doğrulama, konu istatistikleri, büyük havuzdan seçim ve kotalar, ilk iki denemede farklı sorular, havuz bitince dengeli tekrar, 45 dakika sınırı, mola/yeniden yükleme, yetersiz havuz ve kaynak bütünlüğü. TypeScript kontrolü geçti.
Tarayıcıda 45:00 başlangıç, 1 cevap sonrası mola, yenileme sonrası aynı 44:54 süresi, cevabın korunması ve ilk dakika içinde tek onayla bitirme doğrulandı. Gerçek iOS/Android arka plan geçişi ayrıca cihazda denenmelidir.

Resmî soru sayısı, süre ve dağılım için MEB 2026 kılavuzu:
https://www.meb.gov.tr/meb_iys_dosyalar/2026_07/6a6b50c06daf3993652350_MTSK_e-Sinav_Kilavuzu_2026.pdf
