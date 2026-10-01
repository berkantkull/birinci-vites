import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';
import { Bar, Button, Card, colors, s } from './ui';

type Scene = 'stop' | 'right' | 'roundabout' | 'left' | 'pedestrian';
type Junction = { id: string; scene: Scene; question: string; answers: string[]; correct: number; explanation: string };

export const junctions: Junction[] = [
 { id:'stop', scene:'stop', question:'Mavi araç kavşağa yaklaşırken ilk ne yapmalı?', answers:['Yavaşlamadan geçmeli','Dur çizgisinde tamamen durmalı','Sadece korna çalmalı'], correct:1, explanation:'DUR levhasında araç dur çizgisinden önce tamamen durur. Yol güvenliyse geçiş yapılır.' },
 { id:'stop-line', scene:'stop', question:'DUR levhasının yanında dur çizgisi varsa mavi araç nerede durmalı?', answers:['Kavşağın ortasında','Dur çizgisinden önce','Levhanın metrelerce gerisinde'], correct:1, explanation:'DUR levhasında dur çizgisi bulunuyorsa araç çizgiyi geçmeden tamamen durur; görüşü kontrol ederek güvenliyse ilerler.' },
 { id:'stop-empty', scene:'stop', question:'Kavşak boş görünse bile DUR levhasında ne yapılır?', answers:['Tamamen durulur','Yalnızca hız azaltılır','Selektör yapılıp geçilir'], correct:0, explanation:'Kavşağın boş görünmesi DUR yükümlülüğünü kaldırmaz. Araç tamamen durduktan sonra kontrollü biçimde ilerler.' },
 { id:'right', scene:'right', question:'İşaretsiz ve eş değer bu kavşakta önce kim geçmeli?', answers:['Mavi araç','Sağdan gelen sarı araç','Kavşağa hızlı yaklaşan araç'], correct:1, explanation:'Geçiş üstünlüğü veya farklı bir işaret yoksa motorlu araç sürücüsü sağından gelen araca geçiş hakkı verir.' },
 { id:'right-speed', scene:'right', question:'Mavi araç kavşağa sarı araçtan önce ulaştı. İşaret yoksa doğru karar nedir?', answers:['Önce gelen mutlaka geçer','Sağdan gelen sarı araca yol verir','Kornaya basıp geçer'], correct:1, explanation:'Eş değer ve işaretsiz kavşakta önce ulaşmak tek başına öncelik sağlamaz; sağdan gelen araca geçiş hakkı verilir.' },
 { id:'right-clear', scene:'right', question:'Sağdan gelen sarı araç durdu. Mavi araç ne zaman ilerlemeli?', answers:['Sarı aracın niyetinden emin olmadan hemen','Gözlemleyip geçişin güvenli olduğundan emin olunca','Kavşağın içinde bekleyerek'], correct:1, explanation:'Geçiş hakkı olsa bile sürücü diğer yol kullanıcısının hareketini gözlemlemeli ve kavşağa güvenli olduğundan emin olunca girmelidir.' },
 { id:'roundabout', scene:'roundabout', question:'Mavi araç dönel kavşağa girmeden önce kime yol vermeli?', answers:['Kavşakta dolaşan sarı araca','Arkasındaki araca','Hiç kimseye'], correct:0, explanation:'Girişteki YOL VER levhası nedeniyle mavi araç, dönel kavşak içindeki araca yol verir.' },
 { id:'roundabout-gap', scene:'roundabout', question:'Kavşakta dolaşan sarı araç geçtikten sonra mavi araç ne yapmalı?', answers:['Güvenli boşluk oluşunca kavşağa girmeli','Ters yönde kavşağa girmeli','Kavşakta geri gitmeli'], correct:0, explanation:'Mavi araç kavşak içindeki trafiği geçirdikten ve güvenli bir boşluk gördükten sonra levhanın gösterdiği yönde ilerler.' },
 { id:'roundabout-exit', scene:'roundabout', question:'Mavi araç dönel kavşaktan çıkmaya hazırlanıyor. Hangisi doğrudur?', answers:['Çıkışını zamanında belli etmek','Son anda şerit değiştirmek','Kavşak içinde durmak'], correct:0, explanation:'Sürücü çıkışını zamanında belli eder, çevresini kontrol eder ve ani yön değişikliğinden kaçınır.' },
 { id:'left', scene:'left', question:'Mavi araç sola dönecek. Önce hangi araç geçmeli?', answers:['Sola dönen mavi araç','Karşıdan düz gelen sarı araç','İkisi aynı anda'], correct:1, explanation:'Sola dönen sürücü, karşı yönden gelip düz geçen araca geçiş hakkı verir.' },
 { id:'left-turning', scene:'left', question:'Karşıdaki sarı araç düz gidiyor, mavi araç sola dönüyor. Mavi araç nerede beklemeli?', answers:['Sarı aracın yolunu kapatmadan','Karşı şeridin ortasında','Yaya geçidinin üzerinde'], correct:0, explanation:'Sola dönecek araç karşıdan düz gelen araca yol verirken onun geçiş yolunu ve yaya geçidini kapatmaz.' },
 { id:'left-clear', scene:'left', question:'Karşıdan gelen araç geçtikten sonra sola dönüş nasıl tamamlanmalı?', answers:['Çevre ve yaya kontrolüyle uygun şeride','En uzak şeride savrularak','Dönüş sırasında hızlanarak'], correct:0, explanation:'Geçiş hakkı verildikten sonra dönüş düşük ve kontrollü hızla, çevre kontrol edilerek uygun şeride tamamlanır.' },
 { id:'pedestrian', scene:'pedestrian', question:'Mavi araç sağa dönerken yaya geçitte. Doğru davranış nedir?', answers:['Yayaya geçiş hakkı vermek','Yayadan önce hızlanmak','Korna çalıp devam etmek'], correct:0, explanation:'Dönüş yapan sürücü, geçmekte olan yayaya yol verir ve geçit boşalmadan ilerlemez.' },
 { id:'pedestrian-waiting', scene:'pedestrian', question:'Yaya geçide adım atmak üzere bekliyor. Mavi araç nasıl yaklaşmalı?', answers:['Hızını azaltıp durmaya hazır olmalı','Geçidi hızla geçmeli','Yayayı selektörle uyarmalı'], correct:0, explanation:'Sürücü yaya geçidine kontrollü yaklaşır, geçiş yapacak yayayı gözler ve gerektiğinde durur.' },
 { id:'pedestrian-block', scene:'pedestrian', question:'Kavşağın devamında trafik sıkışık. Mavi araç yaya geçidinin üstünde bekleyebilir mi?', answers:['Evet, kısa süreliyse','Hayır, geçidi boş bırakmalı','Yalnız dörtlüler açıksa'], correct:1, explanation:'İleride yer yoksa sürücü yaya geçidini kapatacak biçimde ilerlememeli; geçidi boş bırakmalıdır.' },
];

export function createJunctionTour(random:()=>number=Math.random, count=5) {
 const mixed=[...junctions];
 for(let i=mixed.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[mixed[i],mixed[j]]=[mixed[j],mixed[i]];}
 return mixed.slice(0,Math.min(count,mixed.length));
}

function Car({x,y,color,rotate=0,label}:{x:number;y:number;color:string;rotate?:number;label:string}) {
 return <View style={{position:'absolute',left:`${x}%`,top:`${y}%`,width:'18%',height:'12%',transform:[{rotate:`${rotate}deg`}]}}><Svg viewBox="0 0 80 42"><Rect x="5" y="5" width="70" height="32" rx="13" fill={color}/><Rect x="20" y="9" width="40" height="24" rx="8" fill="#DDE9E8"/><Rect x="25" y="12" width="30" height="18" rx="6" fill="#7C9696"/><Circle cx="17" cy="38" r="4" fill="#172522"/><Circle cx="63" cy="38" r="4" fill="#172522"/><SvgText x="40" y="27" fontSize="13" fontWeight="700" textAnchor="middle" fill="#162D28">{label}</SvgText></Svg></View>;
}
function JunctionArt({scene}:{scene:Scene}) {
 const round=scene==='roundabout';
 return <View style={js.art} accessible accessibilityLabel="Kavşak durumunun yukarıdan görünümü">
  <Svg width="100%" height="100%" viewBox="0 0 320 300">
   <Rect width="320" height="300" fill="#91AD81"/>
   {round ? <><Circle cx="160" cy="150" r="105" fill="#525A58"/><Circle cx="160" cy="150" r="51" fill="#AFC48A"/><Circle cx="160" cy="150" r="67" fill="none" stroke="#F2EAB8" strokeWidth="2" strokeDasharray="12 10"/><Rect x="135" y="0" width="50" height="75" fill="#525A58"/><Rect x="135" y="225" width="50" height="75" fill="#525A58"/></> : <><Rect x="0" y="105" width="320" height="90" fill="#525A58"/><Rect x="115" y="0" width="90" height="300" fill="#525A58"/><Path d="M0 150 H320 M160 0 V300" stroke="#F2EAB8" strokeWidth="2" strokeDasharray="13 10"/></>}
   {scene==='stop' && <><Path d="M121 223 H199" stroke="white" strokeWidth="7"/><Polygon points="221,219 249,219 263,243 249,267 221,267 207,243" fill="#C84E45" stroke="white" strokeWidth="3"/><SvgText x="235" y="248" textAnchor="middle" fontSize="10" fontWeight="800" fill="white">DUR</SvgText></>}
   {scene==='roundabout' && <Polygon points="207,234 238,234 222,261" fill="white" stroke="#C84E45" strokeWidth="4"/>}
   {scene==='pedestrian' && [122,134,146,158,170,182].map(x=><Rect key={x} x={x} y="96" width="7" height="108" fill="#F4F0D9"/>)}
   {scene==='left' && <Path d="M159 230 V160 Q159 143 140 143 H75 M82 136 L72 143 L82 150" stroke="#9CC6EB" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>}
  </Svg>
  {scene==='stop' && <Car x={42} y={69} color="#77A9D8" rotate={-90} label="A"/>}
  {scene==='right' && <><Car x={42} y={69} color="#77A9D8" rotate={-90} label="A"/><Car x={70} y={42} color="#E8C662" rotate={180} label="B"/></>}
  {scene==='roundabout' && <><Car x={43} y={72} color="#77A9D8" rotate={-90} label="A"/><Car x={62} y={34} color="#E8C662" rotate={40} label="B"/></>}
  {scene==='left' && <><Car x={42} y={70} color="#77A9D8" rotate={-90} label="A"/><Car x={42} y={12} color="#E8C662" rotate={90} label="B"/></>}
  {scene==='pedestrian' && <><Car x={42} y={68} color="#77A9D8" rotate={-90} label="A"/><View style={js.person}><View style={js.head}/><View style={js.body}/></View></>}
 </View>;
}

export function JunctionLab({onBack}:{onBack:()=>void}) {
 const [tour,setTour]=useState(createJunctionTour), [index,setIndex]=useState(0), [selected,setSelected]=useState<number|null>(null), [score,setScore]=useState(0), [done,setDone]=useState(false);
 const item=tour[index];
 function choose(answer:number){ if(selected!==null)return; setSelected(answer); if(answer===item.correct)setScore(score+1); }
 function next(){ if(index===tour.length-1)setDone(true); else {setIndex(index+1);setSelected(null);} }
 function restart(){setTour(createJunctionTour());setIndex(0);setSelected(null);setScore(0);setDone(false);}
 return <>
  <Button title="← Çalışma alanına dön" secondary onPress={onBack}/>
  <Text style={s.eyebrow}>KAVŞAK LABORATUVARI</Text><Text style={s.title}>Kavşakta önce kim geçer?</Text>
  {done ? <Card><Text style={s.eyebrow}>TUR TAMAMLANDI</Text><Text style={s.big}>{score}/{tour.length}</Text><Text style={s.h2}>{score===tour.length?'Kavşaklar sende net.':score>=3?'İyi gidiyorsun.':'Bir tur daha çok iyi gelir.'}</Text><Text style={s.body}>Yeni turda 15 durumluk havuzdan farklı bir karışım gelir.</Text><Button title="Yeni 5 durum getir" onPress={restart}/><Button title="Ana sayfaya dön" secondary onPress={onBack}/></Card> : <>
   <View style={s.row}><Text style={s.badge}>{index+1}/{tour.length}</Text><Text style={s.small}>15 senaryodan seçildi · yaklaşık 2 dakika</Text></View><Bar value={(index+1)/tour.length*100}/>
   <JunctionArt scene={item.scene}/><Text style={s.h2}>{item.question}</Text>
   {item.answers.map((answer,i)=>{const answered=selected!==null; const correct=answered&&i===item.correct; const wrong=answered&&i===selected&&i!==item.correct; return <Pressable key={answer} accessibilityRole="radio" accessibilityState={{checked:selected===i,disabled:answered}} disabled={answered} onPress={()=>choose(i)} style={[s.option,correct&&js.correct,wrong&&js.wrong]}><View style={[s.optionLetter,correct&&{backgroundColor:colors.green},wrong&&{backgroundColor:'#B95D54'}]}><Text style={[s.letter,(correct||wrong)&&{color:'white'}]}>{'ABC'[i]}</Text></View><Text style={[s.body,{flex:1,color:colors.ink}]}>{answer}</Text></Pressable>})}
   {selected!==null && <Card><Text style={s.h2}>{selected===item.correct?'Doğru karar':'Birlikte bakalım'}</Text><Text style={s.body}>{item.explanation}</Text><Button title={index===tour.length-1?'Sonucumu gör':'Sonraki durum →'} onPress={next}/></Card>}
  </>}
 </>;
}
const js=StyleSheet.create({art:{width:'100%',aspectRatio:1.08,borderRadius:24,overflow:'hidden',backgroundColor:'#91AD81'},correct:{borderColor:colors.green,backgroundColor:'#EAF3E6'},wrong:{borderColor:'#B95D54',backgroundColor:'#FBEAE7'},person:{position:'absolute',left:'63%',top:'44%',alignItems:'center'},head:{width:15,height:15,borderRadius:8,backgroundColor:'#F0C39E'},body:{width:10,height:28,borderRadius:5,backgroundColor:'#7E4B78'}});
