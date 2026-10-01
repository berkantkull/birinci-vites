export type CarSection = 'Kaput altı' | 'Bagaj' | 'Kokpit' | 'Göstergeler' | 'Pedallar' | 'Lastikler';
export type CarStep = { id: string; section: CarSection; target: string; label: string; prompt: string; explanation: string; criterion?: number; options?: string[] };
const rows: [CarSection,string,string,string,string,number?][] = [
['Kaput altı','hood','Kaput kilidi','Kaputu açmak için dış emniyet mandalının bulunduğu yeri göster.','Önce araç içindeki kaput açma kolu, ardından dış emniyet mandalı kullanılır. Kaput uygun biçimde sabitlenir. Bu çizim dış mandalı gösterir.',1],
['Kaput altı','battery','Akü','Akünün yerini göster.','Akü elektrik enerjisi sağlar. Kutup başlarına metal bir cisimle köprü yapılmaz.',2],
['Kaput altı','oil','Motor yağı kapağı','Motor yağının eklendiği kapağı göster.','Yağ ekleme kapağı ile yağ seviye çubuğu farklı parçalardır. Yağ türü ve miktarı araç kılavuzuna göre belirlenir.',3],
['Kaput altı','dipstick','Yağ ölçüm çubuğu','Motor yağının seviyesini kontrol etmek için kullanılan çubuğu göster.','Araç düz zemindeyken, motor durdurulup üreticinin belirttiği bekleme süresinden sonra ölçüm yapılır.',3],
['Kaput altı','coolant','Soğutma suyu deposu','Motor soğutma sıvısı deposunu göster.','Motor sıcakken soğutma sistemi kapağını açma. Basınçlı sıcak sıvı yanıklara neden olabilir.',4],
['Kaput altı','washer','Cam suyu deposu','Cam silecek suyunun eklendiği yeri göster.','Cam ve su püskürtme simgeli kapak cam suyu haznesine aittir; diğer sıvı depolarıyla karıştırılmamalıdır.',5],
['Kaput altı','fluid','Fren hidroliği deposu','Fren hidroliği deposunu göster.','Fren hidroliği haznesinin yeri ve uygun sıvı araç kılavuzundan kontrol edilir. Seviye düşüklüğü teknik kontrol gerektirebilir. Bu ek alıştırma ayrı bir mavi madde olarak sayılmaz.'],
['Bagaj','latch','Bagaj açma düğmesi','Bagajın dış açma düğmesini göster.','Bagaj açma yöntemi araca göre değişir. Bu örnekte düğme bagaj kapağının alt kenarındadır.',6],
['Bagaj','spare','Stepne','Yedek lastiği göster.','Stepne bu örnekte bagaj tabanındadır. Bazı araçlarda stepne yerine lastik onarım kiti bulunur.',6],
['Bagaj','jack','Kriko','Aracı kaldırmak için kullanılan krikoyu göster.','Kriko yalnız üreticinin belirlediği kaldırma noktalarında kullanılır. Yalnız krikoyla kaldırılmış aracın altına girilmez.',6],
['Bagaj','wrench','Bijon anahtarı','Bijonları söküp takmakta kullanılan anahtarı göster.','Bijon anahtarı lastiği sabitleyen bijonlar içindir; kriko aracı kaldırır.',6],
['Bagaj','reflector','Reflektör','Uyarı üçgenini göster.','Reflektör diğer sürücülere tehlikeyi bildirir. Yerleştirme mesafesi yol ve görüş koşullarına göre değerlendirilir.',6],
['Bagaj','aid','İlk yardım çantası','İlk yardım çantasını göster.','İlk yardım malzemelerini içeren çanta kolay ulaşılır ve kullanılabilir durumda tutulur.',6],
['Kokpit','hazard','Dörtlü ikaz','Dörtlü flaşör düğmesini göster.','İç içe üçgen simgeli düğme dörtlü ikaz lambalarını çalıştırır. Bu ek alıştırma ayrı bir mavi madde olarak sayılmaz.'],
['Kokpit','mirror','İç dikiz aynası','İç dikiz aynasının ayarlandığı bölgeyi göster.','Bu örnekte iç ayna elle ayarlanır; arka camı görecek şekilde sürücüye göre ayarlanmalıdır.',13],
['Kokpit','sideMirror','Dış ayna ayar düğmesi','Dış aynaların ayar düğmesini göster.','Bu örnekte dış ayna ayar düğmesi sürücü kapısındadır. Ayarlar sürüşten önce yapılır.',13],
['Kokpit','horn','Korna','Kornayı göster.','Bu örnekte korna direksiyon merkezindedir. Gereksiz yere kullanılmaz.',11],
['Kokpit','lights','Uzun / kısa far kolu','Uzun ve kısa far geçişini sağlayan kolu göster.','Uzun / kısa far kolunın yeri ve uzun/kısa far geçişi araca göre değişir. Bu örnekte sol kumanda bölgesindedir.',11],
['Kokpit','signal','Sinyal kolu','Sinyal kolunu göster.','Sinyal manevra niyetini bildirir; geçiş hakkı vermez.',11],
['Kokpit','wiper','Silecek kolu','Cam silecek kolunu göster.','Yağış koşullarına uygun silecek hızı ve gerektiğinde cam yıkama kullanılır.',11],
['Kokpit','cabinLight','İç aydınlatma','İç aydınlatmanın açma-kapama düğmesini göster.','Bu örnekte tavan lambasına dokunarak ışık açılır veya kapatılır. Gerçek araçta düğme düzenini öğrenmelisin.',12],
['Kokpit','climate','Klima ve buğu çözme','Klima ve cam buğu çözme düğmelerinin olduğu bölgeyi göster.','Görüşü korumak için uygun havalandırma ve buğu çözme kullanılır. Bu ek alıştırma ayrı bir mavi madde olarak sayılmaz.'],
['Kokpit','gear','Vites kolu','Manuel vites kolunu göster.','Bu örnek araç 5 ileri ve 1 geri vitese sahiptir. Gerçek araçta vites kolundaki şemaya bakılır.'],
['Kokpit','brake','Park freni','El freni kolunu göster.','Bu örnekte mekanik el freni kolu vardır; bazı araçlarda elektronik düğme bulunur.',14],
['Göstergeler','oilLamp','Yağ basıncı uyarısı','Yağ basıncı uyarı lambasını göster.','Kontak açık, motor kapalıyken yanabilir. Motor çalışırken sönmemesi veya yanması hâlinde güvenle durup motoru kapat ve teknik yardım iste.',8],
['Göstergeler','heat','Hararet göstergesi','Motor sıcaklığını gösteren hararet göstergesini seç.','Sıcaklığın tehlikeli düzeye yükselmesi durumunda güvenli yerde dur ve araç kılavuzunu izle; sıcak soğutma kapağını açma.',8],
['Göstergeler','fuel','Yakıt göstergesi','Depodaki yakıt miktarını gösteren göstergeyi seç.','Yakıt göstergesi depoda kalan yakıtı belirtir.',9],
['Göstergeler','speed','Hız göstergesi','Aracın anlık hızını gösteren göstergeyi seç.','km/h hız birimidir. Devir göstergesi motorun dönüş hızını belirtir.',10],
['Göstergeler','rpm','Devir göstergesi','Motorun dönüş hızını gösteren göstergeyi seç.','Devir göstergesinde genellikle x1000 r/min veya rpm yazısı bulunur.',10],
['Göstergeler','charge','Akü/şarj uyarısı','Akü simgeli şarj sistemi uyarısını göster.','Kontak açıkken kontrol amacıyla yanabilir. Motor çalışırken yanmaya devam ederse şarj sistemi kontrol edilmelidir. Bu ek alıştırma ayrı bir mavi madde olarak sayılmaz.'],
['Pedallar','footBrake','Ayak freni','Fren pedalını göster.','Bu manuel araçta fren ortadadır; sağ ayakla kullanılır.',14],
['Pedallar','gas','Gaz pedalı','Gaz pedalını göster.','Bu manuel araçta gaz pedalı sağdadır; sağ ayakla kullanılır.',15],
['Pedallar','clutch','Debriyaj pedalı','Debriyaj pedalını göster.','Bu manuel araçta debriyaj soldadır; sol ayakla kullanılır. Otomatik araçlarda bulunmaz.',15],
];
export const carSteps: CarStep[] = rows.map((r,i)=>({id:`technical-${i+1}`,section:r[0],target:r[1],label:r[2],prompt:r[3],explanation:r[4],criterion:r[5]}));
carSteps.push(
 {id:'tyre-check',section:'Lastikler',target:'Görünür hasar ve belirgin sönüklüğü kontrol ederim; basıncı uygun ölçüm cihazıyla doğrularım.',label:'Lastik kontrolü',prompt:'Sürüşten önce lastikleri nasıl kontrol edersin?',explanation:'Dişlerin aşınması, kesikler ve görünür hasarlar gözle kontrol edilir. Gözle kontrol ön kontroldür; doğru basınç değeri üretici etiketinden alınır ve ölçümle doğrulanır.',criterion:7,options:['Yalnız lastiğin rengine bakarım.','Görünür hasar ve belirgin sönüklüğü kontrol ederim; basıncı uygun ölçüm cihazıyla doğrularım.','Her lastiğe aynı sabit basıncı uygularım.']},
 {id:'oil-danger',section:'Göstergeler',target:'Güvenli yerde durur, motoru kapatır ve teknik yardım isterim.',label:'Yağ uyarısında davranış',prompt:'Motor çalışırken kırmızı yağ basıncı uyarısı sönmüyor. Ne yaparsın?',explanation:'Yağ basıncı sorunu motorun yağlanmasını etkileyebilir. Uyarıyı görmezden gelerek sürüşe devam edilmez.',criterion:8,options:['Hızlanıp uyarının sönmesini beklerim.','Güvenli yerde durur, motoru kapatır ve teknik yardım isterim.','Sadece yakıt eklerim.']},
 {id:'gear-count',section:'Kokpit',target:'5 ileri, 1 geri',label:'Vites sayısı',prompt:'Bu örnekte kol üzerindeki şema 1–2–3–4–5 ve R gösteriyor. Araç kaç vitese sahip?',explanation:'R geri vitestir. Bu örnekte 5 ileri ve 1 geri vites vardır; farklı bir araçta sayı değişebilir.',criterion:16,options:['6 ileri','5 ileri, 1 geri','4 ileri, 2 geri']}
);
export const carSections: CarSection[] = ['Kaput altı','Bagaj','Kokpit','Göstergeler','Pedallar','Lastikler'];
export function failedCriteria(steps: CarStep[],answers: string[]) { return [...new Set(answers.flatMap((a,i)=>steps[i]?.criterion && a!==steps[i].target ? [steps[i].criterion!] : []))]; }
export function createCommissionRound(count = 10, random = Math.random) {
 const groups = new Map<number, CarStep[]>();
 for (const step of carSteps) {
  if (step.criterion === undefined) continue;
  groups.set(step.criterion, [...(groups.get(step.criterion) ?? []), step]);
 }
 const selected = [...groups.values()].map(group => group[Math.floor(random() * group.length)]);
 for (let index = selected.length - 1; index > 0; index -= 1) {
  const swap = Math.floor(random() * (index + 1));
  [selected[index], selected[swap]] = [selected[swap], selected[index]];
 }
 return selected.slice(0, Math.max(1, Math.min(count, selected.length)));
}
export const drivingChecklist = [
 ['Hazırlık','Koltuk ve aynaları ayarla; emniyet kemerini tak. Kemer takmamak kırmızı, koltuk/ayna ayarını kontrol etmemek sarı maddelerdendir.'],
 ['Kalkış','Aynalarla trafiği ve omuz üstü bakışla kör noktayı kontrol et, doğru sinyali ver.'],
 ['Yokuşta kalkış','Kalkışta aracın geri kaymasını kontrol et. EK-4’te 50 cm’den fazla geri kaydırma sarı madde olarak yer alır.'],
 ['Geri park ve L dönüş','Çevreyi kontrol et; koni, kaldırım ve sınır çizgilerine dikkat et. Manevra koşulları ilgili EK-4 başlığına göre değerlendirilir.'],
 ['Dar alanda geri dönüş','B sınıfında ayrıca dar alanda geri dönüş uygulaması bulunur; belirlenen alanı ve hamle sınırını öğren.'],
 ['Trafik ve yayalar','İşaretlere, geçiş hakkına ve şerit kurallarına uy; yaya ve okul geçitlerinde gerekli geçiş hakkını ver.'],
] as const;
export type CarResult = { id: string; finishedAt: string; correct: number; total?: number; mode?: 'practice'|'exam'; section?: string; blueErrors?: number };
export function parseCarResults(raw: string | null): CarResult[] {
 if(!raw) return [];
 const data=JSON.parse(raw);
 if(!data || ![1,2].includes(data.version) || !Array.isArray(data.results) || data.results.some((r:CarResult)=>!r || typeof r.id!=='string' || !Number.isFinite(Date.parse(r.finishedAt)) || !Number.isInteger(r.correct) || r.correct<0 || (r.total!==undefined && (!Number.isInteger(r.total)||r.total<1)) || r.correct>(r.total??6) || (r.mode!==undefined && !['practice','exam'].includes(r.mode)) || (r.blueErrors!==undefined && (!Number.isInteger(r.blueErrors)||r.blueErrors<0||r.blueErrors>16)))) throw new Error('Geçersiz araç tanıma kaydı');
 return data.results;
}
