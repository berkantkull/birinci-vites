import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Card, colors, s } from './ui';
import { buildReadiness, type ReadinessItem } from './readiness';
import { parseCarResults } from './carLesson';
import { parseCourseCar } from './courseCarModel';
import { DRIVING_LESSONS_KEY, parseDrivingLessons } from './drivingLessons';
import { parseSignResults, SIGN_PROGRESS_KEY } from './signProgress';
import type { Attempt } from './domain';

const CAR_KEY = 'birinci-vites.car.v1';
const COURSE_CAR_KEY = 'birinci-vites.course-car.v1';

export function ReadinessPage({ history, onBack, onStartExam, onOpenCar, onOpenSigns, onOpenLesson }: {
  history: Attempt[];
  onBack: () => void;
  onStartExam: () => void;
  onOpenCar: () => void;
  onOpenSigns: () => void;
  onOpenLesson: () => void;
}) {
  const [items, setItems] = useState<ReadinessItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(CAR_KEY), AsyncStorage.getItem(COURSE_CAR_KEY),
      AsyncStorage.getItem(SIGN_PROGRESS_KEY), AsyncStorage.getItem(DRIVING_LESSONS_KEY),
    ]).then(([carRaw, courseRaw, signRaw, lessonRaw]) => {
      setItems(buildReadiness(history, parseCarResults(carRaw), parseCourseCar(courseRaw), parseSignResults(signRaw), parseDrivingLessons(lessonRaw)));
      setError('');
    }).catch(() => setError('Hazırlık kartındaki cihaz kayıtlarından biri okunamadı. Kayıtların silinmedi.'))
      .finally(() => setLoaded(true));
  }, [history]);

  const ready = items.filter(item => item.status === 'ready').length;
  return <>
    <Button title="← Çalışma alanına dön" secondary onPress={onBack}/>
    <Text style={s.eyebrow}>HAZIRLIK KARTIM</Text><Text style={s.title}>Nerede olduğunu tek bakışta gör.</Text>
    <Text style={s.body}>Bu kart sınavı geçip geçmeyeceğini tahmin etmez. Yalnızca tamamladığın çalışmaları ve sıradaki tekrarlarını bir araya getirir.</Text>
    {!!error && <Text accessibilityRole="alert" style={s.notice}>{error}</Text>}
    {!loaded ? <Text style={s.body}>Hazırlık kayıtların yükleniyor…</Text> : <>
      <Card><View style={s.row}><View><Text style={s.eyebrow}>GENEL GÖRÜNÜM</Text><Text style={s.h2}>{ready}/{items.length} alan düzenli</Text></View><Text style={s.big}>{ready}</Text></View><Text style={s.small}>“Düzenli” etiketi son çalışmalarına göre verilir; resmî sınav sonucu veya başarı garantisi değildir.</Text></Card>
      {items.map(item => <Card key={item.id}><View style={[s.row,{alignItems:'flex-start'}]}><View style={{flex:1,gap:5}}><Text style={s.h2}>{item.label}</Text><Text style={s.body}>{item.detail}</Text></View><Status status={item.status}/></View><Button title={actionLabel(item.id)} secondary onPress={item.id==='theory'?onStartExam:item.id==='signs'?onOpenSigns:item.id==='lessons'?onOpenLesson:onOpenCar}/></Card>)}
    </>}
  </>;
}

function Status({status}:{status:ReadinessItem['status']}) {
  const text = status==='ready'?'Düzenli':status==='continue'?'Tekrar et':'Başla';
  const backgroundColor = status==='ready'?colors.lime:status==='continue'?'#FFF2DD':'#EAF0E5';
  return <Text style={[s.badge,{backgroundColor}]}>{text}</Text>;
}

function actionLabel(id:ReadinessItem['id']) {
  if(id==='theory')return 'Sınav provası aç';
  if(id==='signs')return 'İşaret testini aç';
  if(id==='commission')return 'Komisyon Provası’nı aç';
  if(id==='course-car')return 'Kurs Arabam’ı aç';
  return 'Ders notlarını aç';
}
