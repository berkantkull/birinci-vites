import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { Button, Card, colors, s } from './ui';
import { carSteps, carSections, createCommissionRound, drivingChecklist, failedCriteria, parseCarResults, type CarResult, type CarStep } from './carLesson';
import { VehicleDiagram } from './VehicleDiagram';
import { CourseCar } from './CourseCar';

const KEY='birinci-vites.car.v1';
const LEGACY_KEY='ehliyet-yolu.car.v1';
async function readCarStore(){
 const current=await AsyncStorage.getItem(KEY);
 if(current!==null)return current;
 const legacy=await AsyncStorage.getItem(LEGACY_KEY);
 if(legacy!==null)await AsyncStorage.setItem(KEY,legacy);
 return legacy;
}
export function CarScene({onBack,onScreenChange}:{onBack:()=>void;onScreenChange:()=>void}) {
 const [scene,setScene]=useState<'menu'|'course-car'>('menu');
 const [steps,setSteps]=useState<CarStep[]>([]);
 const [mode,setMode]=useState<'practice'|'exam'>('practice');
 const [commissionStyle,setCommissionStyle]=useState<'coach'|'real'|'stress'>('real');
 const [seconds,setSeconds]=useState(0);
 const [index,setIndex]=useState(0);
 const [answers,setAnswers]=useState<string[]>([]);
 const [records,setRecords]=useState<CarResult[]>([]);
 const [loaded,setLoaded]=useState(false);
 const [loadError,setLoadError]=useState(false);
 const [error,setError]=useState('');
 const [saving,setSaving]=useState(false);
 const [done,setDone]=useState(false);
 const [checks,setChecks]=useState<number[]>([]);
 const [showRules,setShowRules]=useState(false);
 const pending=useRef<CarResult|null>(null);
 const busy=useRef(false);
 async function load() {
  try {setRecords(parseCarResults(await readCarStore()));setLoaded(true);setLoadError(false);setError('');}
  catch {setLoadError(true);setError('Araç tanıma kayıtları okunamadı. Tekrar deneyebilirsin.');}
 }
 useEffect(()=>{void load();},[]);
 function begin(next:CarStep[],nextMode:'practice'|'exam') {setSteps(next);setMode(nextMode);setIndex(0);setAnswers([]);setDone(false);pending.current=null;setError('');}
 function beginCommission(style:'coach'|'real'|'stress') {setCommissionStyle(style);setSeconds(style==='stress'?12:0);begin(createCommissionRound(10),'exam');}
 // Reset only between the section menu, a lesson and its result; keep the viewport between questions.
 useEffect(()=>{onScreenChange();},[steps.length,done]);
 const comparable=records.filter(r=>r.mode===mode && r.section===(mode==='exam'?'Komisyon provası':steps[0]?.section) && r.total===steps.length);
 const step=steps[index];
 const selected=answers[index];
 const blue=failedCriteria(steps,answers);
 const failed=mode==='exam' && blue.length>=5;
 const correct=answers.filter((a,i)=>a===steps[i]?.target).length;
 function speakStep() {
  if (!step) return;
  void Speech.stop().then(()=>Speech.speak(`Komisyon sorusu. ${step.prompt}`,{language:'tr-TR',rate:0.9,pitch:0.95}));
 }
 useEffect(()=>{
  if(mode!=='exam'||!step||done)return;
  speakStep();
  return ()=>{void Speech.stop();};
 },[mode,step?.id,done,commissionStyle]);
 useEffect(()=>{
  if(mode!=='exam'||commissionStyle!=='stress'||done||selected!==undefined)return;
  if(seconds<=0){setAnswers(current=>[...current,'unknown']);return;}
  const timer=setTimeout(()=>setSeconds(value=>value-1),1000);
  return ()=>clearTimeout(timer);
 },[mode,commissionStyle,done,selected,seconds]);
 async function complete() {
  if(busy.current)return;
  busy.current=true;setSaving(true);
  pending.current??={id:`${Date.now()}-${Math.random().toString(36).slice(2)}`,finishedAt:new Date().toISOString(),correct,total:answers.length,mode,section:mode==='exam'?'Komisyon provası':steps[0].section,blueErrors:blue.length};
  const next=[pending.current,...records].slice(0,100);
  try {await AsyncStorage.setItem(KEY,JSON.stringify({version:2,results:next}));setRecords(next);setDone(true);setError('');}
  catch {setError('Sonuç kaydedilemedi. Tekrar dene; aynı sonuç iki kez eklenmez.');}
  finally {busy.current=false;setSaving(false);}
 }
 if(scene==='course-car')return <CourseCar onBack={()=>setScene('menu')} onScreenChange={onScreenChange}/>;
 return <>
  <Button title="← Ana sayfa" secondary disabled={saving} onPress={onBack}/>
  <Text style={s.eyebrow}>DİREKSİYON SINAVINA HAZIRLIK</Text>
  <Text style={s.title}>Komisyon gelmeden{'\n'}sen hazır ol.</Text>
  {!steps.length && <Text style={s.body}>Sesli komisyon provasıyla sınav anını çalış veya Kurs Arabam'a gerçek eğitim aracını tanıt.</Text>}
  {!!error && <Card><Text accessibilityRole="alert" style={s.notice}>{error}</Text><Button title="Tekrar dene" disabled={saving} onPress={()=>{void(loadError?load():complete());}}/></Card>}
  {!loaded ? <Text style={s.body}>Kayıtların yükleniyor…</Text> : !steps.length ? <>
   <Card><Text style={s.eyebrow}>İMZA ÖZELLİK</Text><Text style={s.h2}>Komisyon Provası</Text><Text style={s.body}>Komisyon soruyu sesli sorar. Her turda 16 başlıktan rastgele 10 tanesi gelir; sırasını önceden bilemezsin. Beş farklı mavi maddede hata oluşursa prova sonlanır.</Text>
   <Button title="Gerçek sınav modu" onPress={()=>beginCommission('real')}/><Button title="Öğretici komisyon" secondary onPress={()=>beginCommission('coach')}/><Button title="12 saniyelik stres provası" secondary onPress={()=>beginCommission('stress')}/>
   <Button title={showRules?'Değerlendirme notunu gizle':'MEB değerlendirme notu'} secondary onPress={()=>setShowRules(!showRules)}/>
   {showRules && <Text style={s.small}>Kaynak: 9 Ocak 2025’ten itibaren kullanılan MEB EK-4 formu, I. bölüm ve son sayfa notları. Formda 20 araç bilgisi maddesi vardır; otomatik ve elektrikli araca özgü maddeler bu manuel örneğe dahil değildir. Beş mavi madde, iki sarı ihlal veya tek kırmızı ihlal gerçek sınavın sonlandırılmasına neden olur. Buradaki prova yalnız araç bilgisi bölümünü modeller; sürüş yeterliliği sonucu vermez.</Text>}</Card>
   <Card><Text style={s.eyebrow}>SENİN GERÇEK ARACIN</Text><Text style={s.h2}>Kurs Arabam</Text><Text style={s.body}>Kurs aracının kaput, bagaj ve kokpit fotoğraflarını ekle. Parçaları gerçek yerlerinde işaretle ve kendi aracına özel prova çöz.</Text><Button title="Kurs Arabam'ı aç →" onPress={()=>setScene('course-car')}/></Card>
   <Card><Text style={s.eyebrow}>TEMEL ARAÇ EĞİTİMİ</Text><Text style={s.h2}>Örnek araç üzerinde keşfet</Text><Text style={s.body}>Kurs aracını henüz eklemediysen parçaları çizim üzerinde öğrenebilirsin.</Text>
   {carSections.map(section=><Button key={section} title={`${section} · ${carSteps.filter(q=>q.section===section).length} adım`} secondary onPress={()=>begin(carSteps.filter(q=>q.section===section),'practice')}/>)}</Card>
   <Card><Text style={s.eyebrow}>SÜRÜŞE GEÇMEDEN</Text><Text style={s.h2}>Yola hazırlık listem</Text><Text style={s.small}>Kendin için işaretle. Bu liste uygulamalı sürüş sınavı veya geçme puanı değildir; işaretler bu ekranda kaldığın sürece tutulur.</Text>{drivingChecklist.map(([title,body],i)=><Pressable key={title} accessibilityRole="checkbox" accessibilityState={{checked:checks.includes(i)}} onPress={()=>setChecks(checks.includes(i)?checks.filter(n=>n!==i):[...checks,i])} style={[s.option,{alignItems:'flex-start'}]}><Text style={s.letter}>{checks.includes(i)?'✓':'○'}</Text><View style={{flex:1,gap:5}}><Text style={[s.h2,{fontSize:17}]}>{title}</Text><Text style={s.small}>{body}</Text></View></Pressable>)}</Card>
   {!!records.length && <Card><Text style={s.h2}>Son araç çalışmaları</Text>{records.slice(0,5).map(r=><View key={r.id} style={{gap:4}}><Text style={s.body}>{r.section??'Eski kokpit turu'} · {r.correct}/{r.total??6} doğru</Text><Text style={s.small}>{new Date(r.finishedAt).toLocaleString('tr-TR')}{r.mode==='exam'?` · ${r.blueErrors??0} mavi madde hatası`:''}</Text></View>)}</Card>}
  </> : done ? <>
   <Card><Text style={s.eyebrow}>{mode==='exam'?'KOMİSYON PROVASI SONUCU':'BÖLÜM TAMAMLANDI'}</Text><Text style={s.big}>{correct}/{answers.length}</Text><Text style={s.h2}>{mode==='exam'?(failed?'Beş mavi madde sınırına ulaştın.':'Bu turda beş mavi madde sınırının altında kaldın.'):'İlk seçimde doğru.'}</Text><Text style={s.body}>{mode==='exam'?`${blue.length} farklı mavi maddede hata. ${steps.length-answers.length} adım uygulanmadı. Bu sonuç gerçek sınav sonucu değildir.`:'Yanlışlarına aşağıdan tekrar bakabilirsin.'}</Text><Text style={s.small}>Sonucun cihazına kaydedildi.{comparable.length ? ` Tamamlanan aynı kapsamdaki en iyi turun: ${Math.max(...comparable.map(r=>r.correct))}/${steps.length}.` : ''}</Text><Button title="Bölümlere dön" onPress={()=>{setSteps([]);setDone(false);}}/><Button title={mode==='exam'?'Yeni komisyon turu':'Aynı bölümü yeniden çalış'} secondary onPress={()=>mode==='exam'?beginCommission(commissionStyle):begin(steps,mode)}/></Card>
   {steps.slice(0,answers.length).map((item,i)=><Card key={item.id}><Text style={s.eyebrow}>{answers[i]===item.target?'DOĞRU':answers[i]==='unknown'?'BİLMİYORUM':'TEKRAR BAK'} · {item.section}</Text><Text style={s.h2}>{item.label}</Text><Text style={s.body}>{item.explanation}</Text></Card>)}
  </> : <>
   <View style={s.row}><Text style={s.badge}>{step.section} · {index+1}/{steps.length}</Text><Text style={s.small}>{mode==='exam'?`Mavi hata: ${blue.length}/5${commissionStyle==='stress'?` · ${seconds} sn`:''}`:'Serbest çalışma'}</Text></View>
   <Card><Text style={s.eyebrow}>{mode==='exam'?'KOMİSYON SORUYOR':'BİRLİKTE KEŞFEDELİM'}</Text><Text style={s.h2}>{step.prompt}</Text><Text style={s.small}>{step.options?'Uygun cevabı seç.':'Çizimde ilgili parçaya dokun.'}</Text>{mode==='exam'&&<Button title="Soruyu tekrar dinle" secondary onPress={speakStep}/>}</Card>
   <VehicleDiagram section={step.section} target={step.target} selected={step.options ? 'static' : selected} reveal={(mode==='practice'||commissionStyle==='coach')&&selected!==undefined} onSelect={id=>setAnswers([...answers,id])}/>
   {step.options?.map(option=><Button key={option} title={option} secondary disabled={selected!==undefined} onPress={()=>setAnswers([...answers,option])}/>)}
   {selected===undefined?<Button title="Bilmiyorum" secondary onPress={()=>setAnswers([...answers,'unknown'])}/>:<Card>
    {mode==='practice'||commissionStyle==='coach'?<><Text accessibilityRole="alert" style={s.h2}>{selected===step.target?'Doğru.':`Birlikte bakalım: ${step.label}`}</Text><Text style={s.body}>{step.explanation}</Text>{!step.options&&<Text style={s.small}>Doğru parça açık yeşil çerçeveyle gösterildi.</Text>}</>:<Text accessibilityRole="alert" style={s.body}>{selected==='unknown'&&commissionStyle==='stress'?'Süre doldu; bu soru bilemedim olarak kaydedildi.':failed?'Beş farklı mavi maddede hata oluştu. Prova tamamlandı; sonuçlarını inceleyebilirsin.':'Cevabın kaydedildi. Açıklamayı tur sonunda görebilirsin.'}</Text>}
    <Button title={failed||index===steps.length-1?'Sonucu kaydet ve göster':'Sonraki adım →'} disabled={saving} onPress={()=>{if(failed||index===steps.length-1)void complete();else{if(commissionStyle==='stress')setSeconds(12);setIndex(index+1);}}}/>
   </Card>}
   <Button title="Bölümlere dön · bu turu bırak" secondary disabled={saving} onPress={()=>setSteps([])}/>
   <Text style={s.small}>Tur sonunda sonuç kaydedilir. Tamamlamadan ayrılırsan bu tur kaydedilmez.</Text>
  </>}
 </>;
}
