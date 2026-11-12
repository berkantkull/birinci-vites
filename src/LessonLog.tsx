import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Card, colors, s } from './ui';
import { DRIVING_LESSONS_KEY, drivingSkills, lessonFocus, lessonPayload, parseDrivingLessons, type DrivingLesson, type DrivingSkill } from './drivingLessons';

type Step = 'home' | 'practiced' | 'repeat' | 'confidence' | 'saved';

export function LessonLog({ onBack, onScreenChange, startNew = false }: { onBack: () => void; onScreenChange: () => void; startNew?: boolean }) {
  const [lessons, setLessons] = useState<DrivingLesson[]>([]);
  const [step, setStep] = useState<Step>(startNew ? 'practiced' : 'home');
  const [practiced, setPracticed] = useState<DrivingSkill[]>([]);
  const [repeat, setRepeat] = useState<DrivingSkill[]>([]);
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [note, setNote] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(DRIVING_LESSONS_KEY)
      .then(raw => setLessons(parseDrivingLessons(raw)))
      .catch(() => setError('Ders kayıtların okunamadı. Mevcut verilerini silmeden tekrar deneyebilirsin.'))
      .finally(() => setLoaded(true));
  }, []);
  useEffect(() => { onScreenChange(); }, [step, onScreenChange]);

  function toggle(list: DrivingSkill[], item: DrivingSkill, update: (value: DrivingSkill[]) => void) {
    update(list.includes(item) ? list.filter(value => value !== item) : [...list, item]);
  }
  function begin() {
    setPracticed([]); setRepeat([]); setConfidence(3); setNote(''); setError(''); setStep('practiced');
  }
  async function save() {
    const lesson: DrivingLesson = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      finishedAt: new Date().toISOString(), practiced, repeat, confidence, note: note.trim().slice(0, 300),
    };
    const next = [lesson, ...lessons].slice(0, 100);
    setSaving(true);
    try {
      await AsyncStorage.setItem(DRIVING_LESSONS_KEY, lessonPayload(next));
      setLessons(next); setStep('saved'); setError('');
    } catch { setError('Ders notu kaydedilemedi. Uygulamayı kapatmadan tekrar deneyebilirsin.'); }
    finally { setSaving(false); }
  }

  const focus = lessonFocus(lessons);
  if (!loaded) return <><Button title="← Sürüş alanı" secondary onPress={onBack}/><Text style={s.body}>Ders notların yükleniyor…</Text></>;
  if (step === 'home') return <>
    <Button title="← Sürüş alanı" secondary onPress={onBack}/>
    <Text style={s.eyebrow}>DERS BİTTİ</Text><Text style={s.title}>Derste kalanlar kaybolmasın.</Text>
    <Text style={s.body}>Hocanın söylediklerini üç kısa adımda kaydet. Bir sonraki dersten önce tekrar etmen gerekenleri burada bul.</Text>
    {!!error && <Text accessibilityRole="alert" style={s.notice}>{error}</Text>}
    <Button title="Bugünkü dersi kaydet →" onPress={begin}/>
    {!!focus.length && <Card><Text style={s.eyebrow}>SONRAKİ DERSTEN ÖNCE</Text><Text style={s.h2}>{focus.map(item => item.skill).join(' · ')}</Text><Text style={s.small}>Son beş dersindeki tekrar notlarına göre sıralandı.</Text></Card>}
    {!lessons.length ? <Card><Text style={s.h2}>Henüz ders kaydı yok</Text><Text style={s.body}>İlk kaydın yaklaşık 30 saniye sürer.</Text></Card> : <>
      <Text style={s.h2}>Son dersler</Text>
      {lessons.slice(0, 5).map(lesson => <Card key={lesson.id}><View style={s.row}><Text style={s.h2}>{new Date(lesson.finishedAt).toLocaleDateString('tr-TR')}</Text><Text style={s.badge}>Güven {lesson.confidence}/5</Text></View><Text style={s.body}>{lesson.practiced.join(' · ')}</Text><Text style={s.small}>{lesson.repeat.length ? `Tekrar: ${lesson.repeat.join(', ')}` : 'Tekrar notu yok.'}</Text>{!!lesson.note && <Text style={s.small}>“{lesson.note}”</Text>}</Card>)}
    </>}
  </>;

  if (step === 'saved') return <>
    <Button title="← Ders notları" secondary onPress={() => setStep('home')}/>
    <Card><Text style={s.eyebrow}>DERS KAYDEDİLDİ</Text><Text style={s.h2}>{repeat.length ? `Sonraki derste ${repeat[0].toLocaleLowerCase('tr-TR')} ile başla.` : 'Bu dersten tekrar notu kalmadı.'}</Text><Text style={s.body}>{practiced.length} çalışma başlığı · Güven {confidence}/5</Text><Button title="Ders notlarını gör" onPress={() => setStep('home')}/></Card>
  </>;

  const number = step === 'practiced' ? 1 : step === 'repeat' ? 2 : 3;
  return <>
    <Button title="← Ders notlarına dön" secondary disabled={saving} onPress={() => setStep('home')}/>
    <View style={s.row}><Text style={s.eyebrow}>DERS BİTTİ</Text><Text style={s.badge}>{number}/3</Text></View>
    {step === 'practiced' && <>
      <Text style={s.title}>Bugün ne çalıştın?</Text><Text style={s.body}>Birden fazla seçebilirsin.</Text>
      <SkillPicker selected={practiced} onToggle={item => toggle(practiced, item, setPracticed)}/>
      <Button title="Devam →" disabled={!practiced.length} onPress={() => setStep('repeat')}/>
    </>}
    {step === 'repeat' && <>
      <Text style={s.title}>Hocan neyi tekrar et dedi?</Text><Text style={s.body}>Tekrar notu yoksa seçim yapmadan devam edebilirsin.</Text>
      <SkillPicker selected={repeat} onToggle={item => toggle(repeat, item, setRepeat)}/>
      <Button title="Devam →" onPress={() => setStep('confidence')}/>
    </>}
    {step === 'confidence' && <>
      <Text style={s.title}>Ders sonunda nasıldın?</Text>
      <Card><Text style={s.h2}>Kendine kaç verirsin?</Text><View style={[s.row, {justifyContent:'flex-start'}]}>{([1,2,3,4,5] as const).map(value => <Pressable key={value} accessibilityRole="radio" accessibilityState={{checked:confidence===value}} onPress={() => setConfidence(value)} style={[s.option, {minWidth:52,minHeight:52,padding:12,justifyContent:'center'},confidence===value&&s.selected]}><Text style={s.letter}>{value}</Text></Pressable>)}</View><Text style={s.small}>Bu puan sınav tahmini değildir; yalnızca o günkü hissini kaydeder.</Text></Card>
      <Card><Text style={s.h2}>Kısa not</Text><TextInput accessibilityLabel="Direksiyon dersi notu" value={note} onChangeText={setNote} maxLength={300} multiline placeholder="Örn. L park çıkışında sağ aynayı unutma" placeholderTextColor={colors.muted} style={[s.option,{color:colors.ink,fontSize:15,minHeight:96,textAlignVertical:'top'}]}/><Text style={s.small}>{note.length}/300</Text></Card>
      {!!error && <Text accessibilityRole="alert" style={s.notice}>{error}</Text>}
      <Button title={saving?'Kaydediliyor…':'Ders notunu kaydet'} disabled={saving} onPress={() => void save()}/>
    </>}
  </>;
}

function SkillPicker({ selected, onToggle }: { selected: DrivingSkill[]; onToggle: (item: DrivingSkill) => void }) {
  return <View style={[s.row,{justifyContent:'flex-start'}]}>{drivingSkills.map(item => <Pressable key={item} accessibilityRole="checkbox" accessibilityState={{checked:selected.includes(item)}} onPress={() => onToggle(item)} style={[s.option,{minHeight:44,paddingVertical:10,paddingHorizontal:13},selected.includes(item)&&s.selected]}><Text style={[s.small,{color:colors.ink,fontWeight:'700'}]}>{selected.includes(item)?'✓ ':''}{item}</Text></Pressable>)}</View>;
}
