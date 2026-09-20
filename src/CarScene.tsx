import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Card, colors, s } from './ui';
import { carSteps, carSections, drivingChecklist, failedCriteria, parseCarResults, type CarResult, type CarStep } from './carLesson';
import { VehicleDiagram } from './VehicleDiagram';

const KEY='ehliyet-yolu.car.v1';
export function CarScene({onBack,onScreenChange}:{onBack:()=>void;onScreenChange:()=>void}) {
 const [steps,setSteps]=useState<CarStep[]>([]);
 const [mode,setMode]=useState<'practice'|'exam'>('practice');
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
  try {setRecords(parseCarResults(await AsyncStorage.getItem(KEY)));setLoaded(true);setLoadError(false);setError('');}
  catch {setLoadError(true);setError('Araç tanıma kayıtları okunamadı. Tekrar deneyebilirsin.');}
 }
 useEffect(()=>{void load();},[]);
 function begin(next:CarStep[],nextMode:'practice'|'exam') {setSteps(next);setMode(nextMode);setIndex(0);setAnswers([]);setDone(false);pending.current=null;setError('');}
 // Reset only between the section menu, a lesson and its result; keep the viewport between questions.
 useEffect(()=>{onScreenChange();},[steps.length,done]);
 const comparable=records.filter(r=>r.mode===mode && r.section===(mode==='exam'?'Araç bilgisi provası':steps[0]?.section) && r.total===steps.length);
 const step=steps[index];
 const selected=answers[index];
 const blue=failedCriteria(steps,answers);
 const failed=mode==='exam' && blue.length>=5;
 const correct=answers.filter((a,i)=>a===steps[i]?.target).length;
 async function complete() {
  if(busy.current)return;
  busy.current=true;setSaving(true);
  pending.current??={id:`${Date.now()}-${Math.random().toString(36).slice(2)}`,finishedAt:new Date().toISOString(),correct,total:answers.length,mode,section:mode==='exam'?'Araç bilgisi provası':steps[0].section,blueErrors:blue.length};
  const next=[pending.current,...records].slice(0,100);
  try {await AsyncStorage.setItem(KEY,JSON.stringify({version:2,results:next}));setRecords(next);setDone(true);setError('');}
  catch {setError('Sonuç kaydedilemedi. Tekrar dene; aynı sonuç iki kez eklenmez.');}
  finally {busy.current=false;setSaving(false);}
 }
 return <>
  <Button title="← Ana sayfa" secondary disabled={saving} onPress={onBack}/>
  <Text style={s.eyebrow}>DİREKSİYON SINAVINA HAZIRLIK</Text>
  <Text style={s.title}>Aracını tanı.{'\n'}Güvenle başla.</Text>
  {!steps.length && <Text style={s.body}>Manuel, içten yanmalı bir otomobil üzerinden çalışıyoruz. Parça yerleri araca göre değişir; bu çizimler örnektir.</Text>}
  {!!error && <Card><Text accessibilityRole="alert" style={s.notice}>{error}</Text><Button title="Tekrar dene" disabled={saving} onPress={()=>{void(loadError?load():complete());}}/></Card>}
  {!loaded ? <Text style={s.body}>Kayıtların yükleniyor…</Text> : !steps.length ? <>
   <Card><Text style={s.eyebrow}>ÖNCE KEŞFET</Text><Text style={s.h2}>Hangi bölümü tanıyalım?</Text><Text style={s.body}>Parçaya dokun, açıklamasını oku. Yanlış yapsan da bölümün sonuna kadar devam edebilirsin.</Text>
   {carSections.map(section=><Button key={section} title={`${section} · ${carSteps.filter(q=>q.section===section).length} adım`} secondary onPress={()=>begin(carSteps.filter(q=>q.section===section),'practice')}/>)}</Card>
   <Card><Text style={s.eyebrow}>KOMİSYON PROVASI</Text><Text style={s.h2}>Araç bilgisi turu</Text><Text style={s.body}>Bu manuel araç için 16 değerlendirme başlığını çalış. Aynı başlıktaki birkaç yanlış tek mavi madde sayılır. Beş farklı mavi maddede hata olunca prova sonlanır. Açıklamalar tur sonunda gösterilir.</Text><Text style={s.small}>Dörtlü, klima ve fren hidroliği gibi ek çalışmalar serbest bölümlerde bulunur; prova için ayrı hata maddesi eklemezler.</Text><Button title="Araç bilgisi provasına başla" onPress={()=>begin(carSteps.filter(q=>q.criterion!==undefined).sort((a,b)=>a.criterion!-b.criterion!),'exam')}/>
   <Button title={showRules?'Değerlendirme notunu gizle':'MEB değerlendirme notu'} secondary onPress={()=>setShowRules(!showRules)}/>
   {showRules && <Text style={s.small}>Kaynak: 9 Ocak 2025’ten itibaren kullanılan MEB EK-4 formu, I. bölüm ve son sayfa notları. Formda 20 araç bilgisi maddesi vardır; otomatik ve elektrikli araca özgü maddeler bu manuel örneğe dahil değildir. Beş mavi madde, iki sarı ihlal veya tek kırmızı ihlal gerçek sınavın sonlandırılmasına neden olur. Buradaki prova yalnız araç bilgisi bölümünü modeller; sürüş yeterliliği sonucu vermez.</Text>}</Card>
   <Card><Text style={s.eyebrow}>SÜRÜŞE GEÇMEDEN</Text><Text style={s.h2}>Yola hazırlık listem</Text><Text style={s.small}>Kendin için işaretle. Bu liste uygulamalı sürüş sınavı veya geçme puanı değildir; işaretler bu ekranda kaldığın sürece tutulur.</Text>{drivingChecklist.map(([title,body],i)=><Pressable key={title} accessibilityRole="checkbox" accessibilityState={{checked:checks.includes(i)}} onPress={()=>setChecks(checks.includes(i)?checks.filter(n=>n!==i):[...checks,i])} style={[s.option,{alignItems:'flex-start'}]}><Text style={s.letter}>{checks.includes(i)?'✓':'○'}</Text><View style={{flex:1,gap:5}}><Text style={[s.h2,{fontSize:17}]}>{title}</Text><Text style={s.small}>{body}</Text></View></Pressable>)}</Card>
   {!!records.length && <Card><Text style={s.h2}>Son araç çalışmaları</Text>{records.slice(0,5).map(r=><View key={r.id} style={{gap:4}}><Text style={s.body}>{r.section??'Eski kokpit turu'} · {r.correct}/{r.total??6} doğru</Text><Text style={s.small}>{new Date(r.finishedAt).toLocaleString('tr-TR')}{r.mode==='exam'?` · ${r.blueErrors??0} mavi madde hatası`:''}</Text></View>)}</Card>}
  </> : done ? <>
   <Card><Text style={s.eyebrow}>{mode==='exam'?'ARAÇ BİLGİSİ PROVA SONUCU':'BÖLÜM TAMAMLANDI'}</Text><Text style={s.big}>{correct}/{answers.length}</Text><Text style={s.h2}>{mode==='exam'?(failed?'Beş mavi madde sınırına ulaştın.':'Bu turda beş mavi madde sınırının altında kaldın.'):'İlk seçimde doğru.'}</Text><Text style={s.body}>{mode==='exam'?`${blue.length} farklı mavi maddede hata. ${steps.length-answers.length} adım uygulanmadı. Bu sonuç gerçek sınav sonucu değildir.`:'Yanlışlarına aşağıdan tekrar bakabilirsin.'}</Text><Text style={s.small}>Sonucun cihazına kaydedildi.{comparable.length ? ` Tamamlanan aynı kapsamdaki en iyi turun: ${Math.max(...comparable.map(r=>r.correct))}/${steps.length}.` : ''}</Text><Button title="Bölümlere dön" onPress={()=>{setSteps([]);setDone(false);}}/><Button title="Aynı bölümü yeniden çalış" secondary onPress={()=>begin(steps,mode)}/></Card>
   {steps.slice(0,answers.length).map((item,i)=><Card key={item.id}><Text style={s.eyebrow}>{answers[i]===item.target?'DOĞRU':answers[i]==='unknown'?'BİLMİYORUM':'TEKRAR BAK'} · {item.section}</Text><Text style={s.h2}>{item.label}</Text><Text style={s.body}>{item.explanation}</Text></Card>)}
  </> : <>
   <View style={s.row}><Text style={s.badge}>{step.section} · {index+1}/{steps.length}</Text><Text style={s.small}>{mode==='exam'?`Mavi madde hatası: ${blue.length}/5`:'Serbest çalışma'}</Text></View>
   <Card><Text style={s.eyebrow}>{mode==='exam'?'KOMİSYON SORUYOR':'BİRLİKTE KEŞFEDELİM'}</Text><Text style={s.h2}>{step.prompt}</Text><Text style={s.small}>{step.options?'Uygun cevabı seç.':'Çizimde ilgili parçaya dokun.'}</Text></Card>
   <VehicleDiagram section={step.section} target={step.target} selected={step.options ? 'static' : selected} reveal={mode==='practice'&&selected!==undefined} onSelect={id=>setAnswers([...answers,id])}/>
   {step.options?.map(option=><Button key={option} title={option} secondary disabled={selected!==undefined} onPress={()=>setAnswers([...answers,option])}/>)}
   {selected===undefined?<Button title="Bilmiyorum" secondary onPress={()=>setAnswers([...answers,'unknown'])}/>:<Card>
    {mode==='practice'?<><Text accessibilityRole="alert" style={s.h2}>{selected===step.target?'Doğru.':`Birlikte bakalım: ${step.label}`}</Text><Text style={s.body}>{step.explanation}</Text>{!step.options&&<Text style={s.small}>Doğru parça açık yeşil çerçeveyle gösterildi.</Text>}</>:<Text accessibilityRole="alert" style={s.body}>{failed?'Beş farklı mavi maddede hata oluştu. Prova tamamlandı; sonuçlarını inceleyebilirsin.':'Cevabın kaydedildi. Açıklamayı tur sonunda görebilirsin.'}</Text>}
    <Button title={failed||index===steps.length-1?'Sonucu kaydet ve göster':'Sonraki adım →'} disabled={saving} onPress={()=>{if(failed||index===steps.length-1)void complete();else setIndex(index+1);}}/>
   </Card>}
   <Button title="Bölümlere dön · bu turu bırak" secondary disabled={saving} onPress={()=>setSteps([])}/>
   <Text style={s.small}>Tur sonunda sonuç kaydedilir. Tamamlamadan ayrılırsan bu tur kaydedilmez.</Text>
  </>}
 </>;
}
