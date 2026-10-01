import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, Text, TextInput, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Button, Card, colors, s } from './ui';
import { courseCarAreas, courseCarQuestions, emptyCourseCar, isHotspotCorrect, parseCourseCar, setCourseCarHotspot, shuffleCourseCarQuestions, upsertCourseCarPhoto, type CourseCarArea, type CourseCarProfile } from './courseCarModel';

const COURSE_CAR_KEY = 'birinci-vites.course-car.v1';
type Mode = 'home' | 'edit' | 'study' | 'result';
type Point = { x: number; y: number; correct: boolean };

export function CourseCar({ onBack, onScreenChange }: { onBack: () => void; onScreenChange: () => void }) {
  const [profile, setProfile] = useState<CourseCarProfile | null>(null);
  const [draft, setDraft] = useState<CourseCarProfile>(emptyCourseCar());
  const [mode, setMode] = useState<Mode>('home');
  const [selectedLabels, setSelectedLabels] = useState<Partial<Record<CourseCarArea, string>>>({});
  const [layouts, setLayouts] = useState<Partial<Record<CourseCarArea, { width: number; height: number }>>>({});
  const [questions, setQuestions] = useState<ReturnType<typeof courseCarQuestions>>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState<Point | null>(null);
  const [correct, setCorrect] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(COURSE_CAR_KEY)
      .then(raw => {
        const stored = parseCourseCar(raw);
        setProfile(stored);
        setDraft(stored ?? emptyCourseCar());
      })
      .catch(() => setError('Kurs aracın okunamadı. Kayıtlarını silmeden tekrar deneyebilirsin.'))
      .finally(() => setLoaded(true));
  }, []);
  useEffect(() => { onScreenChange(); }, [mode, onScreenChange]);

  const readyQuestions = useMemo(() => profile ? courseCarQuestions(profile) : [], [profile]);

  function openEditor() {
    setDraft(profile ?? emptyCourseCar());
    setDirty(false);
    setError('');
    setMode('edit');
  }

  async function choosePhoto(area: CourseCarArea, camera: boolean) {
    setError('');
    try {
      if (camera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) { setError('Fotoğraf çekmek için kamera izni gerekiyor. İstersen galeriden de seçebilirsin.'); return; }
      }
      const result = camera
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], base64: true, quality: 0.55, cameraType: ImagePicker.CameraType.back })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], base64: true, quality: 0.55 });
      if (result.canceled || !result.assets[0]) return;
      const asset = result.assets[0];
      const uri = asset.base64 ? `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}` : asset.uri;
      setDraft(current => upsertCourseCarPhoto(current, area, uri));
      setSelectedLabels(current => ({ ...current, [area]: courseCarAreas.find(item => item.area === area)?.labels[0] }));
      setDirty(true);
    } catch {
      setError('Fotoğraf eklenemedi. Daha küçük bir görselle tekrar deneyebilirsin.');
    }
  }

  function markPhoto(area: CourseCarArea, event: GestureResponderEvent) {
    const layout = layouts[area];
    const label = selectedLabels[area];
    if (!layout || !label) { setError('Önce aşağıdan işaretlemek istediğin parçayı seç.'); return; }
    setDraft(current => setCourseCarHotspot(current, area, label, event.nativeEvent.locationX / layout.width, event.nativeEvent.locationY / layout.height));
    setDirty(true);
    setError('');
  }

  async function save() {
    setSaving(true);
    const next = { ...draft, name: draft.name.trim() || 'Kurs aracım', updatedAt: new Date().toISOString() };
    try {
      await AsyncStorage.setItem(COURSE_CAR_KEY, JSON.stringify(next));
      setProfile(next);
      setDraft(next);
      setDirty(false);
      setError('');
      setMode('home');
    } catch {
      setError('Araç profili kaydedilemedi. Fotoğraflardan biri çok büyükse daha düşük çözünürlüklü bir fotoğraf dene.');
    } finally { setSaving(false); }
  }

  function beginStudy() {
    if (!profile) return;
    const next = shuffleCourseCarQuestions(courseCarQuestions(profile));
    setQuestions(next);
    setQuestionIndex(0);
    setAnswer(null);
    setCorrect(0);
    setMode('study');
  }

  function answerPhoto(event: GestureResponderEvent) {
    if (answer) return;
    const question = questions[questionIndex];
    const layout = layouts[question.area];
    if (!layout) return;
    const x = event.nativeEvent.locationX / layout.width;
    const y = event.nativeEvent.locationY / layout.height;
    const hit = isHotspotCorrect(question.hotspot, x, y);
    setAnswer({ x, y, correct: hit });
    if (hit) setCorrect(value => value + 1);
  }

  function nextQuestion() {
    if (questionIndex === questions.length - 1) { setMode('result'); return; }
    setQuestionIndex(value => value + 1);
    setAnswer(null);
  }

  if (!loaded) return <><Button title="← Sürüş alanı" secondary onPress={onBack}/><Text style={s.body}>Kurs aracın yükleniyor…</Text></>;
  if (mode === 'home') return <>
    <Button title="← Sürüş alanı" secondary onPress={onBack}/>
    <Text style={s.eyebrow}>KURS ARABAM</Text><Text style={s.title}>Kendi kurs aracınla çalış.</Text>
    {!!error && <Text accessibilityRole="alert" style={s.notice}>{error}</Text>}
    {!profile ? <Card><Text style={s.h2}>Aracını bir kez tanıt.</Text><Text style={s.body}>Kaput, bagaj ve kokpit fotoğraflarını ekle. Parçaların gerçek yerlerini işaretle; Birinci Vites bu fotoğraflardan sana özel çalışma hazırlasın.</Text><Button title="Kurs aracımı oluştur" onPress={openEditor}/></Card> : <>
      <Card><Text style={s.eyebrow}>KAYITLI ARAÇ</Text><Text style={s.h2}>{profile.name}</Text><Text style={s.body}>{profile.photos.length}/3 bölüm fotoğrafı · {readyQuestions.length} işaretli parça</Text><Text style={s.small}>Son düzenleme: {new Date(profile.updatedAt).toLocaleString('tr-TR')}</Text><Button title="Kendi aracımla çalış" disabled={!readyQuestions.length} onPress={beginStudy}/><Button title="Fotoğrafları ve parçaları düzenle" secondary onPress={openEditor}/></Card>
      {!readyQuestions.length && <Text style={s.notice}>Çalışma başlatmak için en az bir fotoğrafta bir parçanın yerini işaretle.</Text>}
    </>}
    <Card><Text style={s.h2}>Fotoğraflar yalnız bu cihazda</Text><Text style={s.small}>Araç fotoğrafları hesabımıza veya bir sunucuya gönderilmez. Uygulama verilerini silersen araç profilin de silinir. Plaka ve kişisel belge görünmeyecek şekilde fotoğraf çek.</Text></Card>
  </>;

  if (mode === 'edit') return <>
    <Button title="← Kurs Arabam" secondary disabled={saving} onPress={() => setMode('home')}/>
    <Text style={s.eyebrow}>ARACINI TANIT</Text><Text style={s.title}>Aracını üç fotoğrafla tanıt.</Text>
    {!!error && <Text accessibilityRole="alert" style={s.notice}>{error}</Text>}
    <Card><Text style={s.h2}>Aracın adı</Text><TextInput accessibilityLabel="Kurs aracının adı" value={draft.name} onChangeText={name => { setDraft(current => ({ ...current, name })); setDirty(true); }} placeholder="Örn. Beyaz Clio" placeholderTextColor={colors.muted} style={[s.option, { color: colors.ink, fontSize: 16 }]} /></Card>
    {courseCarAreas.map(({ area, description, labels }) => {
      const photo = draft.photos.find(item => item.area === area);
      const selectedLabel = selectedLabels[area];
      return <Card key={area}>
        <View style={s.row}><View style={{flex:1,gap:4}}><Text style={s.h2}>{area}</Text><Text style={s.small}>{description}</Text></View><Text style={s.badge}>{photo?.hotspots.length ?? 0}/{labels.length}</Text></View>
        {photo ? <>
          <Pressable accessibilityRole="imagebutton" accessibilityLabel={`${area} fotoğrafı. Seçili parçanın yerini işaretlemek için dokun.`} onLayout={(event: LayoutChangeEvent) => setLayouts(current => ({ ...current, [area]: event.nativeEvent.layout }))} onPress={event => markPhoto(area, event)} style={{ width:'100%', aspectRatio:4/3, borderRadius:18, overflow:'hidden', backgroundColor:'#DCE3DB', position:'relative' }}>
            <Image source={{uri:photo.uri}} resizeMode="cover" style={{width:'100%',height:'100%'}} />
            {photo.hotspots.map((hotspot, number) => <View key={hotspot.id} pointerEvents="none" style={{position:'absolute',left:`${hotspot.x*100}%`,top:`${hotspot.y*100}%`,width:30,height:30,borderRadius:15,marginLeft:-15,marginTop:-15,backgroundColor:hotspot.label===selectedLabel?'#DDECAC':'#FFFFFFDD',borderWidth:3,borderColor:colors.green,alignItems:'center',justifyContent:'center'}}><Text style={[s.letter,{fontSize:12}]}>{number+1}</Text></View>)}
          </Pressable>
          <Text style={s.small}>{selectedLabel ? `Fotoğrafta “${selectedLabel}” konumuna dokun.` : 'Aşağıdan bir parça seç, sonra fotoğraftaki yerine dokun.'}</Text>
          <View style={[s.row,{justifyContent:'flex-start'}]}>{labels.map(label => {
            const marked = photo.hotspots.some(point => point.label === label);
            return <Pressable key={label} accessibilityRole="button" accessibilityState={{selected:selectedLabel===label}} onPress={() => setSelectedLabels(current => ({...current,[area]:label}))} style={[s.option,{minHeight:42,paddingVertical:9,paddingHorizontal:12},selectedLabel===label&&s.selected]}><Text style={[s.small,{color:colors.ink,fontWeight:'700'}]}>{marked?'✓ ':''}{label}</Text></Pressable>;
          })}</View>
          <View style={s.row}><Button title="Fotoğrafı değiştir" secondary onPress={() => void choosePhoto(area,false)}/><Button title="Yeniden çek" secondary onPress={() => void choosePhoto(area,true)}/></View>
        </> : <><Button title="Fotoğraf çek" onPress={() => void choosePhoto(area,true)}/><Button title="Galeriden seç" secondary onPress={() => void choosePhoto(area,false)}/></>}
      </Card>;
    })}
    <Button title={saving?'Kaydediliyor…':'Kurs aracımı kaydet'} disabled={saving||!dirty} onPress={() => void save()}/>
  </>;

  if (mode === 'result') return <>
    <Button title="← Kurs Arabam" secondary onPress={() => setMode('home')}/>
    <Card><Text style={s.eyebrow}>KURS ARABAM SONUCU</Text><Text style={s.big}>{correct}/{questions.length}</Text><Text style={s.h2}>{correct === questions.length ? 'Aracını iyi tanıyorsun.' : 'Birkaç parçayı tekrar görelim.'}</Text><Text style={s.body}>Bu çalışma gerçek direksiyon sınavı sonucu değildir.</Text><Button title="Aynı araçla yeniden çalış" onPress={beginStudy}/></Card>
  </>;

  const question = questions[questionIndex];
  return <>
    <Button title="← Turu bırak" secondary onPress={() => setMode('home')}/>
    <View style={s.row}><Text style={s.badge}>{question.area}</Text><Text style={s.small}>{questionIndex+1}/{questions.length}</Text></View>
    <Card><Text style={s.eyebrow}>KENDİ ARACINDA BUL</Text><Text style={s.h2}>{question.hotspot.label} nerede?</Text><Text style={s.body}>Fotoğraftaki yerine dokun.</Text></Card>
    <Pressable accessibilityRole="imagebutton" accessibilityLabel={`${question.area} fotoğrafı. ${question.hotspot.label} yerini seç.`} onLayout={(event: LayoutChangeEvent) => setLayouts(current => ({ ...current, [question.area]: event.nativeEvent.layout }))} onPress={answerPhoto} style={{width:'100%',aspectRatio:4/3,borderRadius:22,overflow:'hidden',backgroundColor:'#DCE3DB',position:'relative'}}>
      <Image source={{uri:question.photoUri}} resizeMode="cover" style={{width:'100%',height:'100%'}} />
      {answer && <><View pointerEvents="none" style={{position:'absolute',left:`${answer.x*100}%`,top:`${answer.y*100}%`,width:34,height:34,borderRadius:17,marginLeft:-17,marginTop:-17,backgroundColor:answer.correct?'#DDECAC':'#FFD9D2',borderWidth:3,borderColor:answer.correct?colors.green:'#A43D32'}}/><View pointerEvents="none" style={{position:'absolute',left:`${question.hotspot.x*100}%`,top:`${question.hotspot.y*100}%`,width:26,height:26,borderRadius:13,marginLeft:-13,marginTop:-13,backgroundColor:'#DDECAC',borderWidth:3,borderColor:colors.green}}/></>}
    </Pressable>
    {answer && <Card><Text accessibilityRole="alert" style={s.h2}>{answer.correct?'Doğru yer.':'Doğru yer yeşil işaretle gösterildi.'}</Text><Button title={questionIndex===questions.length-1?'Sonucu gör':'Sonraki parça →'} onPress={nextQuestion}/></Card>}
  </>;
}

