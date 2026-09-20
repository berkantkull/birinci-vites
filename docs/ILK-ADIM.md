# İlk ders: Bir sorunun ekrana yolculuğu

C# ile çalıştığın için sıfırdan başlamıyoruz. Tanıdığın kavramları yeni araçlarla eşleştirelim:

| C# tarafı | Bu projede |
| --- | --- |
| DTO / model | TypeScript `type Question` |
| `List<Question>` | `Question[]` |
| LINQ `Where` | Dizide `.filter(...)` |
| LINQ `Select` | Dizide `.map(...)` |
| `async` / `await` | JavaScript'te aynı anahtar kelimeler, `Promise` |
| UI olay işleyicisi | `onPress` |

## 1. Veri

`src/questions.ts` içindeki ilk nesne bir sorudur. `correct: 2`, sıfırdan başlayan dizide üçüncü seçeneğin doğru olduğunu söyler. `Question` tipi, örneğin `correct` alanına yanlışlıkla metin vermeni engeller. TypeScript tipleri uygulama çalışırken bulunmaz; diskten gelen veriyi ayrıca `parseHistory` ile denetlememizin nedeni budur.

## 2. Ekran

React bileşeni, ekranda ne gösterileceğini tarif eden bir fonksiyondur. `Text` yazı, `View` düzen, `Pressable` dokunulabilir alan üretir. Bunlar React Native bileşenleridir; tarayıcının HTML etiketleri değildir.

## 3. Durum

`useState`, ekranın hatırlaması gereken bilgiyi tutar. `session.selections` seçilen cevapları saklar. Cevaba dokununca `setSession(...)` ile yeni durum verilir; React ekranı günceller. Nesneyi yerinde değiştirmek yerine `{ ...session }` ile yeni nesne üretiriz.

## 4. Kalıcılık

`useState` uygulama belleğidir. AsyncStorage ise tamamlanmış sonuçları cihazda saklar. Kaydetme asenkron olduğu için sonucu bekleriz ve başarısızlığı kullanıcıya gösteririz.

## İlk küçük görevin

1. `src/questions.ts` dosyasında bir sorunun açıklamasını kendi cümlelerinle yeniden yaz.
2. `npm run web` ile ekranı aç ve ilgili konuyu seç.
3. Cevabı işaretleyip “Cevabı kontrol et” düğmesine bas.
4. Yazdığın açıklamanın ekranda nereden geldiğini takip et.

Sonra birlikte yeni soru eklerken soru sayısı ve mini deneme süresi gibi sabit metinleri veriden türetmeyi ele alabiliriz. Böylece bir veri değişikliğinin arayüzü nasıl etkilediğini göreceksin.
