import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';
import { Bar, Button, Card, colors, s } from './ui';

type SignKind='stop'|'yield'|'noEntry'|'speed'|'noPark'|'noStop'|'roundabout'|'right'|'left'|'straight'|'noLeft'|'noUTurn'|'pedestrian'|'school'|'work'|'trafficLight'|'slippery'|'bump'|'twoWay'|'narrow'|'parking'|'hospital'|'busStop'|'oneWay'|'deadEnd'|'firstAid';
type Category='Tümü'|'Tanzim'|'Tehlike'|'Bilgi';
type Sign={id:string;kind:SignKind;name:string;category:Exclude<Category,'Tümü'>;meaning:string};

export const trafficSigns:Sign[]=[
 {id:'stop',kind:'stop',name:'Dur',category:'Tanzim',meaning:'Dur çizgisinden önce tamamen dur; yol güvenliyse geç.'},
 {id:'yield',kind:'yield',name:'Yol ver',category:'Tanzim',meaning:'Öncelikli yoldaki araçlara geçiş hakkı ver.'},
 {id:'no-entry',kind:'noEntry',name:'Girişi olmayan yol',category:'Tanzim',meaning:'Bu yönden taşıt girişi yasaktır.'},
 {id:'speed',kind:'speed',name:'Azami hız sınırlaması',category:'Tanzim',meaning:'Belirtilen hız değerinin üzerine çıkma.'},
 {id:'no-park',kind:'noPark',name:'Park etmek yasaktır',category:'Tanzim',meaning:'Bu kesimde park edemezsin.'},
 {id:'no-stop',kind:'noStop',name:'Duraklamak ve park etmek yasaktır',category:'Tanzim',meaning:'Zorunlu hâller dışında duraklama ve park etme yasaktır.'},
 {id:'roundabout',kind:'roundabout',name:'Ada etrafında dönünüz',category:'Tanzim',meaning:'Dönel kavşakta levhadaki okların gösterdiği seyir yönünü izle.'},
 {id:'right',kind:'right',name:'Sağa mecburi yön',category:'Tanzim',meaning:'Bu noktada yalnız sağa, belirtilen yönde ilerle.'},
 {id:'left',kind:'left',name:'Sola mecburi yön',category:'Tanzim',meaning:'Bu noktada yalnız sola, belirtilen yönde ilerle.'},
 {id:'straight',kind:'straight',name:'İleri mecburi yön',category:'Tanzim',meaning:'Yalnız ileri yönde devam et.'},
 {id:'no-left',kind:'noLeft',name:'Sola dönülmez',category:'Tanzim',meaning:'Bu noktada sola dönüş yapmak yasaktır.'},
 {id:'no-u-turn',kind:'noUTurn',name:'U dönüşü yapılmaz',category:'Tanzim',meaning:'Bu kesimde U dönüşü yapmak yasaktır.'},
 {id:'pedestrian',kind:'pedestrian',name:'Yaya geçidi',category:'Tehlike',meaning:'Yaya geçidine yaklaşırken hızını azalt ve geçiş hakkına dikkat et.'},
 {id:'school',kind:'school',name:'Okul geçidi',category:'Tehlike',meaning:'Çocukların yola çıkabileceği bölgeye yaklaşıyorsun; hızını azalt.'},
 {id:'work',kind:'work',name:'Yolda çalışma',category:'Tehlike',meaning:'İleride yol çalışması var; geçici işaretlere ve görevlilere uy.'},
 {id:'traffic-light',kind:'trafficLight',name:'Işıklı işaret cihazı',category:'Tehlike',meaning:'İleride trafik ışıkları bulunur; durmaya hazır ol.'},
 {id:'slippery',kind:'slippery',name:'Kaygan yol',category:'Tehlike',meaning:'Yol yüzeyi kaygan olabilir; ani fren ve yön değişikliğinden kaçın.'},
 {id:'bump',kind:'bump',name:'Kasisli yol',category:'Tehlike',meaning:'İleride kasis veya tümsek bulunur; hızını azalt.'},
 {id:'two-way',kind:'twoWay',name:'İki yönlü trafik',category:'Tehlike',meaning:'Tek yönlü yol sona erer veya karşı yönden trafik gelir.'},
 {id:'narrow',kind:'narrow',name:'İki taraftan daralan kaplama',category:'Tehlike',meaning:'Yol iki taraftan daralır; karşılaşma ve geçişlere dikkat et.'},
 {id:'parking',kind:'parking',name:'Park yeri',category:'Bilgi',meaning:'Araçların park edebileceği alanı bildirir.'},
 {id:'hospital',kind:'hospital',name:'Hastane',category:'Bilgi',meaning:'Yakında hastane bulunduğunu bildirir; gereksiz sesli ikazdan kaçın.'},
 {id:'bus-stop',kind:'busStop',name:'Durak',category:'Bilgi',meaning:'Toplu taşıma araçlarının yolcu indirip bindirdiği durağı bildirir.'},
 {id:'one-way',kind:'oneWay',name:'Tek yönlü yol',category:'Bilgi',meaning:'Trafiğin yalnız okun gösterdiği yönde aktığını bildirir.'},
 {id:'dead-end',kind:'deadEnd',name:'İleri çıkmaz yol',category:'Bilgi',meaning:'Yolun ileride taşıt geçişine kapalı olduğunu bildirir.'},
 {id:'first-aid',kind:'firstAid',name:'İlk yardım',category:'Bilgi',meaning:'Yakında ilk yardım hizmeti bulunan bir yer olduğunu bildirir.'},
];

const red='#E30613',blue='#0054A6',black='#111111',yellow='#F8E500';
function WarningFrame({children}:{children:ReactNode}){return <><Polygon points="50,3 98,91 2,91" fill={red}/><Polygon points="50,16 87,83 13,83" fill="white"/>{children}</>}
function Prohibition({children}:{children:ReactNode}){return <><Circle cx="50" cy="50" r="46" fill={red}/><Circle cx="50" cy="50" r="36" fill="white"/>{children}</>}

function SignArt({kind,size=88}:{kind:SignKind;size?:number}){
 return <Svg width={size} height={size} viewBox="0 0 100 100" accessible={false}>
  {kind==='stop'&&<><Polygon points="31,4 69,4 96,31 96,69 69,96 31,96 4,69 4,31" fill={red}/><Polygon points="33,9 67,9 91,33 91,67 67,91 33,91 9,67 9,33" fill="none" stroke="white" strokeWidth="2.5"/><SvgText x="50" y="61" textAnchor="middle" fontSize="29" fontWeight="700" fill="white">DUR</SvgText></>}
  {kind==='yield'&&<><Polygon points="50,96 3,12 97,12" fill={red}/><Polygon points="50,78 19,22 81,22" fill="white"/></>}
  {kind==='noEntry'&&<><Circle cx="50" cy="50" r="46" fill={red}/><Rect x="15" y="41" width="70" height="18" fill="white"/></>}
  {kind==='speed'&&<Prohibition><SvgText x="50" y="64" textAnchor="middle" fontSize="40" fontWeight="600" fill={black}>50</SvgText></Prohibition>}
  {kind==='noPark'&&<><Circle cx="50" cy="50" r="46" fill={blue}/><Circle cx="50" cy="50" r="41" fill="none" stroke={red} strokeWidth="9"/><Line x1="22" y1="22" x2="78" y2="78" stroke={red} strokeWidth="9"/></>}
  {kind==='noStop'&&<><Circle cx="50" cy="50" r="46" fill={blue}/><Circle cx="50" cy="50" r="41" fill="none" stroke={red} strokeWidth="9"/><Line x1="22" y1="22" x2="78" y2="78" stroke={red} strokeWidth="8"/><Line x1="78" y1="22" x2="22" y2="78" stroke={red} strokeWidth="8"/></>}
  {kind==='roundabout'&&<><Circle cx="50" cy="50" r="46" fill={blue}/>{[0,120,240].map(angle=><Path key={angle} transform={`rotate(${angle} 50 50)`} d="M49 13 C67 13 80 23 86 38 L75 42 C71 32 63 26 52 25 L52 33 L37 20 L52 7 Z" fill="white"/>)}</>}
  {(['right','left','straight'] as SignKind[]).includes(kind)&&<><Circle cx="50" cy="50" r="46" fill={blue}/>{kind==='right'&&<Path d="M18 42 H57 V29 L84 50 L57 71 V58 H18 Z" fill="white"/>}{kind==='left'&&<Path d="M82 42 H43 V29 L16 50 L43 71 V58 H82 Z" fill="white"/>}{kind==='straight'&&<Path d="M42 82 V43 H29 L50 16 L71 43 H58 V82 Z" fill="white"/>}</>}
  {kind==='noLeft'&&<Prohibition><Path d="M69 68 V52 Q69 38 55 38 H42 V27 L22 45 L42 63 V51 H53 Q57 51 57 56 V68 Z" fill={black}/><Line x1="20" y1="20" x2="80" y2="80" stroke={red} strokeWidth="8"/></Prohibition>}
  {kind==='noUTurn'&&<Prohibition><Path d="M69 72 V48 Q69 30 51 30 Q33 30 33 48 V54 H22 L39 72 L56 54 H45 V48 Q45 42 51 42 Q57 42 57 48 V72 Z" fill={black}/><Line x1="20" y1="20" x2="80" y2="80" stroke={red} strokeWidth="8"/></Prohibition>}
  {kind==='pedestrian'&&<WarningFrame><G fill={black}><Circle cx="52" cy="31" r="5"/><Path d="M49 38 L43 53 L51 58 L57 44 L63 48 L66 43 L56 36 Z"/><Path d="M43 51 L34 67 L40 70 L50 56 Z"/><Path d="M50 56 L57 71 L63 68 L56 53 Z"/>{[25,36,47,58,69].map(x=><Polygon key={x} points={`${x},76 ${x+6},76 ${x+12},66 ${x+6},66`}/>)}</G></WarningFrame>}
  {kind==='school'&&<WarningFrame><G fill={black}><Circle cx="42" cy="32" r="5"/><Path d="M38 38 L33 54 L41 57 L48 42 L55 48 L59 43 L48 36 Z"/><Path d="M34 52 L25 67 L31 70 L41 56 Z"/><Path d="M41 55 L48 70 L54 67 L47 52 Z"/><Circle cx="63" cy="39" r="4"/><Path d="M60 44 L55 57 L62 60 L68 48 L74 53 L77 49 L68 43 Z"/><Path d="M56 56 L50 68 L55 71 L63 59 Z"/><Path d="M63 59 L69 70 L74 67 L68 56 Z"/></G></WarningFrame>}
  {kind==='work'&&<><Rect x="2" y="2" width="96" height="96" fill={yellow} stroke={black} strokeWidth="2"/><Polygon points="50,10 89,82 11,82" fill={red}/><Polygon points="50,23 77,74 23,74" fill="white"/><G fill={black}><Circle cx="44" cy="37" r="5"/><Path d="M40 42 L50 47 L57 58 L51 62 L45 54 L40 66 L32 66 L39 48 Z"/><Path d="M53 48 L58 45 L73 68 L68 71 Z"/><Path d="M59 69 Q69 62 78 73 H58 Z"/><Rect x="25" y="72" width="55" height="4"/></G></>}
  {kind==='trafficLight'&&<WarningFrame><Rect x="39" y="27" width="22" height="48" rx="4" fill={black}/><Circle cx="50" cy="37" r="6" fill={red}/><Circle cx="50" cy="51" r="6" fill="#F5C400"/><Circle cx="50" cy="65" r="6" fill="#169447"/></WarningFrame>}
  {kind==='slippery'&&<WarningFrame><Path d="M37 38 H61 L67 53 H31 Z" fill={black}/><Circle cx="38" cy="56" r="4" fill={black}/><Circle cx="60" cy="56" r="4" fill={black}/><Path d="M31 66 Q40 57 48 66 T66 66 M29 75 Q38 66 46 75 T64 75" stroke={black} strokeWidth="3" fill="none"/></WarningFrame>}
  {kind==='bump'&&<WarningFrame><Path d="M23 70 H32 Q35 45 50 45 Q65 45 68 70 H77" stroke={black} strokeWidth="7" fill="none"/></WarningFrame>}
  {kind==='twoWay'&&<WarningFrame><Path d="M39 73 V39 H30 L43 24 L56 39 H47 V73 Z M61 27 V61 H70 L57 76 L44 61 H53 V27 Z" fill={black}/></WarningFrame>}
  {kind==='narrow'&&<WarningFrame><Path d="M28 71 L40 30 H48 L43 71 Z M72 71 L60 30 H52 L57 71 Z" fill={black}/></WarningFrame>}
  {(['parking','hospital','busStop','oneWay','deadEnd'] as SignKind[]).includes(kind)&&<><Rect x="4" y="4" width="92" height="92" fill={blue}/>{kind==='parking'&&<SvgText x="50" y="78" textAnchor="middle" fontSize="76" fontWeight="700" fill="white">P</SvgText>}{kind==='hospital'&&<SvgText x="50" y="76" textAnchor="middle" fontSize="70" fontWeight="700" fill="white">H</SvgText>}{kind==='busStop'&&<><Rect x="18" y="18" width="64" height="64" fill="white"/><SvgText x="50" y="70" textAnchor="middle" fontSize="57" fontWeight="700" fill={black}>D</SvgText></>}{kind==='oneWay'&&<Path d="M13 41 H60 V27 L88 50 L60 73 V59 H13 Z" fill="white"/>}{kind==='deadEnd'&&<><Rect x="43" y="18" width="14" height="64" fill="white"/><Rect x="28" y="60" width="44" height="22" fill="white"/><Rect x="43" y="18" width="14" height="18" fill={red}/></>}</>}
  {kind==='firstAid'&&<><Rect x="19" y="2" width="62" height="96" rx="3" fill={blue}/><Rect x="29" y="10" width="42" height="47" fill="white"/><Circle cx="47" cy="33" r="13" fill={red}/><Circle cx="52" cy="29" r="11" fill="white"/><Path d="M58 28 L61 34 L68 34 L63 38 L65 45 L58 41 L52 45 L54 38 L48 34 L55 34 Z" fill={red}/><Path d="M29 73 Q34 65 41 70 L46 75 Q49 78 53 74 L58 69 Q64 64 70 72" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/><SvgText x="50" y="92" textAnchor="middle" fontSize="17" fontWeight="800" fill="white">112</SvgText></>}
 </Svg>;
}

function shuffled<T>(items:T[]){return [...items].sort(()=>Math.random()-.5);}
function makeQuiz(){return shuffled(trafficSigns).slice(0,5);}

export function TrafficSigns({onBack}:{onBack:()=>void}){
 const [category,setCategory]=useState<Category>('Tümü'),[open,setOpen]=useState<string|null>(null),[quiz,setQuiz]=useState(false),[quizSigns,setQuizSigns]=useState(makeQuiz),[index,setIndex]=useState(0),[selected,setSelected]=useState<number|null>(null),[score,setScore]=useState(0),[done,setDone]=useState(false);
 const current=quizSigns[index];
 const [alternatives,setAlternatives]=useState<Sign[]>(()=>shuffled([quizSigns[0],...shuffled(trafficSigns.filter(x=>x.id!==quizSigns[0].id)).slice(0,2)]));
 function choices(item:Sign){setAlternatives(shuffled([item,...shuffled(trafficSigns.filter(x=>x.id!==item.id)).slice(0,2)]));}
 function choose(i:number){if(selected!==null)return;setSelected(i);if(alternatives[i].id===current.id)setScore(value=>value+1);}
 function next(){if(index===quizSigns.length-1)setDone(true);else{const nextIndex=index+1;setIndex(nextIndex);setSelected(null);choices(quizSigns[nextIndex]);}}
 function startQuiz(){const nextQuiz=makeQuiz();setQuizSigns(nextQuiz);choices(nextQuiz[0]);setQuiz(true);setDone(false);setIndex(0);setSelected(null);setScore(0);}
 if(quiz)return <><Button title="← İşaretlere dön" secondary onPress={()=>setQuiz(false)}/><Text style={s.eyebrow}>HIZLI İŞARET TESTİ</Text><Text style={s.title}>Gör ve tanı.</Text>{done?<Card><Text style={s.big}>{score}/{quizSigns.length}</Text><Text style={s.h2}>{score===5?'Hepsi doğru.':'İşaretlere bir göz atıp tekrar deneyebilirsin.'}</Text><Button title="Yeni 5 işaret getir" onPress={startQuiz}/><Button title="İşaretleri keşfet" secondary onPress={()=>setQuiz(false)}/></Card>:<><View style={s.row}><Text style={s.badge}>{index+1}/5</Text><Text style={s.small}>26 işaretlik havuzdan seçildi</Text></View><Bar value={(index+1)*20}/><View style={ts.quizSign}><SignArt kind={current.kind} size={150}/></View><Text style={s.h2}>Bu işaretin anlamı nedir?</Text>{alternatives.map((item,i)=>{const answered=selected!==null,correct=answered&&item.id===current.id,wrong=answered&&i===selected&&!correct;return <Pressable key={item.id} accessibilityRole="radio" accessibilityState={{checked:selected===i,disabled:answered}} disabled={answered} onPress={()=>choose(i)} style={[s.option,correct&&ts.correct,wrong&&ts.wrong]}><Text style={[s.body,{flex:1,color:colors.ink,fontWeight:'600'}]}>{item.name}</Text></Pressable>})}{selected!==null&&<Card><Text style={s.h2}>{alternatives[selected].id===current.id?'Doğru':'Doğru cevap: '+current.name}</Text><Text style={s.body}>{current.meaning}</Text><Button title={index===4?'Sonucumu gör':'Sonraki işaret →'} onPress={next}/></Card>}</>}</>;
 const visible=trafficSigns.filter(x=>category==='Tümü'||x.category===category);
 return <><Button title="← Çalışma alanına dön" secondary onPress={onBack}/><Text style={s.eyebrow}>TRAFİK İŞARETLERİ</Text><Text style={s.title}>Görünce tanı.{`\n`}Yolda uygula.</Text><Button title="5 işaretlik hızlı test" onPress={startQuiz}/><View style={[s.row,{justifyContent:'flex-start'}]}>{(['Tümü','Tanzim','Tehlike','Bilgi'] as Category[]).map(c=><Pressable key={c} accessibilityRole="button" accessibilityState={{selected:category===c}} accessibilityLabel={`${c} işaretlerini göster`} onPress={()=>{setCategory(c);setOpen(null);}} style={[ts.chip,category===c&&ts.chipActive]}><Text style={[s.small,category===c&&{color:'white',fontWeight:'700'}]}>{c}</Text></Pressable>)}</View><Text style={s.small}>{visible.length} işaret gösteriliyor · Açıklaması için levhaya dokun.</Text><View style={ts.grid}>{visible.map(item=><Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`${item.name}. Açıklamayı ${open===item.id?'kapat':'aç'}.`} onPress={()=>setOpen(open===item.id?null:item.id)} style={[ts.signCard,open===item.id&&ts.open]}><SignArt kind={item.kind}/><Text style={[s.h2,{fontSize:16,lineHeight:21,textAlign:'center'}]}>{item.name}</Text>{open===item.id&&<Text style={[s.small,{textAlign:'center'}]}>{item.meaning}</Text>}</Pressable>)}</View><Text style={s.small}>İşaret adları ve anlamları KGM trafik işaretleme yayınları esas alınarak hazırlanmıştır.</Text></>;
}
const ts=StyleSheet.create({grid:{flexDirection:'row',flexWrap:'wrap',gap:12},signCard:{width:'48%',minWidth:140,flexGrow:1,backgroundColor:colors.white,borderWidth:1,borderColor:colors.border,borderRadius:20,padding:16,alignItems:'center',gap:10},open:{borderColor:colors.green,backgroundColor:'#F8FBF5'},chip:{paddingHorizontal:15,paddingVertical:9,borderRadius:18,backgroundColor:'#E7ECE4'},chipActive:{backgroundColor:colors.green},quizSign:{alignItems:'center',justifyContent:'center',backgroundColor:'white',borderRadius:24,padding:24},correct:{borderColor:colors.green,backgroundColor:'#EAF3E6'},wrong:{borderColor:'#B95D54',backgroundColor:'#FBEAE7'}});
