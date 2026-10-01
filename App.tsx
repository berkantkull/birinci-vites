import { useEffect, useRef, useState } from 'react';
import { Animated, AppState, BackHandler, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { examRules, parseHistory, scoreAnswers, topicStats, topics, type Attempt, type Topic } from './src/domain';
import { questions } from './src/questions';
import { dailyReview, reviewEntries } from './src/review';
import { ReviewNotebook } from './src/ReviewNotebook';
import { CarScene } from './src/CarScene';
import { JunctionLab } from './src/JunctionLab';
import { TrafficSigns } from './src/TrafficSigns';
import { GuideReader } from './src/GuideReader';
import { Bar, Button, Card, NavigationBar, colors, s } from './src/ui';
import { LiquidGlassProvider, useLiquidGlass } from './src/liquidGlass';
import { Icon } from './src/icons';
import { JourneyArt, Meta, ResultVisual, StudySnapshot, TopicIcon, TopicTile } from './src/visuals';

const STORAGE_KEY = 'birinci-vites.history.v1';
const LEGACY_STORAGE_KEY = 'ehliyet-yolu.history.v1';
async function readHistoryStore() {
  const current = await AsyncStorage.getItem(STORAGE_KEY);
  if (current !== null) return current;
  const legacy = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacy !== null) await AsyncStorage.setItem(STORAGE_KEY, legacy);
  return legacy;
}
import { createExam, pauseSession, resumeSession, parseSession, remainingSeconds, type Session } from './src/examEngine';
type Page = 'home' | 'progress' | 'info' | 'notebook' | 'car' | 'junction' | 'signs';
export default function App() { return <SafeAreaProvider><LiquidGlassProvider><Application /></LiquidGlassProvider></SafeAreaProvider>; }
function Application() {
  const glass = useLiquidGlass();
  const journeyScroll = useRef(new Animated.Value(0)).current;
  const [page, setPage] = useState<Page>('home');
  const [history, setHistory] = useState<Attempt[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [error, setError] = useState('');
  const [guideOpen, setGuideOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [result, setResult] = useState<Attempt | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [entry, setEntry] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [saveError, setSaveError] = useState('');
  const writes = useRef(Promise.resolve());
  const [remaining, setRemaining] = useState(0);
  const [saving, setSaving] = useState(false);
  const finished = useRef(false);
  const scroll = useRef<ScrollView>(null);
  const stats = topicStats(history);
  const notebook = reviewEntries(history, questions);
  const daily = dailyReview(history, questions);
  async function load() {
    try { const raw = await readHistoryStore(); const previous = parseHistory(raw); const active = parseSession(raw ? JSON.parse(raw).session : null, questions); setHistory(previous); if (active && !previous.some(a => a.id === active.id)) { finished.current = false; setRemaining(remainingSeconds(active, Date.now())); setSession(active); } setLoaded(true); setLoadError(false); setError(''); }
    catch { setLoadError(true); setError('Kayıtlar okunamadı. Mevcut verilerini korumak için yeni çalışma başlatılmadı.'); }
  }
  useEffect(() => { void load(); }, []);
  useEffect(() => { scroll.current?.scrollTo({ y: 0, animated: false }); }, [page, session?.index, session?.pausedAt, !!session, !!result, entry]);
  function persist(next: Attempt[], active: Session | null = null) {
    const payload = JSON.stringify({ version: 1, attempts: next, session: active });
    writes.current = writes.current.catch(() => {}).then(async () => {
      setSaving(true);
      try { await AsyncStorage.setItem(STORAGE_KEY, payload); setSaveError(''); }
      catch { setSaveError('Çalışman kaydedilemedi. Uygulamayı kapatmadan tekrar dene.'); }
      finally { setSaving(false); }
    });
    return writes.current;
  }
  useEffect(() => { if (loaded && session) void persist(history, session); }, [loaded, session]);
  function start(mode: Session['mode'], topic?: Topic, ids?: string[]) {
    if (session || !loaded) return;
    const set = ids ? ids.map(id => questions.find(q => q.id===id)).filter((q): q is typeof questions[number] => !!q) : questions.filter(q => !topic || q.topic === topic);
    if (!set.length) return;
    finished.current = false; setResult(null); setConfirm(false); setEntry(false); setShowMap(false);
    if (mode === 'exam') {
      const next = createExam(questions, Date.now(), history.flatMap(a => a.answers).reduce<Record<string, number>>((counts, a) => { counts[a.questionId] = (counts[a.questionId] ?? 0) + 1; return counts; }, {}));
      setRemaining(remainingSeconds(next, Date.now())); setSession(next);
    } else setSession({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, mode, ids: set.map(q => q.id), index: 0, selections: {}, revealed: [], startedAt: Date.now(), deadline: null });
  }
  function finish(current: Session) {
    if (finished.current) return;
    finished.current = true;
    const seen = new Set(history.flatMap(a => a.answers.map(x => x.questionId)));
    const answers = current.ids.map(id => {
      const q = questions.find(q => q.id === id)!;
      return { questionId: id, topic: q.topic, selected: current.selections[id] ?? null, correct: current.selections[id] === q.correct, firstSeen: !seen.has(id) };
    });
    const attempt: Attempt = { id: current.id, finishedAt: new Date().toISOString(), mode: current.mode, answers, durationSeconds: Math.round((Math.min(Date.now(), current.deadline ?? Date.now()) - current.startedAt) / 1000), score: scoreAnswers(answers) };
    const next = [attempt, ...history];
    setHistory(next); setResult(attempt); setSession(null); setConfirm(false); void persist(next);
  }
  useEffect(() => {
    if (!session?.deadline || session.pausedAt !== undefined) return;
    const tick = () => { const seconds = Math.max(0, Math.ceil((session.deadline! - Date.now()) / 1000)); setRemaining(seconds); if (seconds === 0) finish(session); };
    tick(); const timer = setInterval(tick, 500);
    const listener = AppState.addEventListener('change', state => { if (state === 'background') { const paused = pauseSession(session, Date.now()); setSession(paused); void persist(history, paused); } });
    return () => { clearInterval(timer); listener.remove(); };
  }, [session]);
  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (session && session.pausedAt === undefined) { setSession(pauseSession(session, Date.now())); setPage('home'); return true; }
      if (entry) { setEntry(false); return true; }
      if (result) { setResult(null); return true; }
      if (page !== 'home') { setPage('home'); return true; }
      return false;
    }); return () => listener.remove();
  }, [session, result, page, entry]);
  const current = session ? questions.find(q => q.id === session.ids[session.index])! : null;
  const revealed = !!(session && current && session.revealed.includes(current.id));
  const canStart = loaded && !saving && !error && !saveError;
  return <SafeAreaView style={s.page}>{guideOpen && <GuideReader onClose={()=>setGuideOpen(false)} />}<StatusBar style="dark" /><ScrollView ref={scroll} scrollEventThrottle={16} onScroll={event => journeyScroll.setValue(Math.max(0, event.nativeEvent.contentOffset.y))} contentContainerStyle={[s.content, glass && !session && !result && { paddingBottom: 120 }]}>
    <View style={s.row}><Text style={s.brand}>birinci <Text style={{ color: colors.green }}>vites.</Text></Text><Text style={s.badge}>B SINIFI</Text></View>
    {!!error && <Card><Text accessibilityRole="alert" style={s.notice}>{error}</Text><Button title="Tekrar dene" disabled={saving} onPress={() => { if (loadError) void load(); else void persist(history); }} /></Card>}
    {!loaded && !loadError && <Text style={s.body}>Çalışmaların yükleniyor…</Text>}
    {!!saveError && <Card><Text accessibilityRole="alert" style={s.notice}>{saveError}</Text><Button title="Kaydetmeyi tekrar dene" onPress={() => { void persist(history, session); }} disabled={saving} /></Card>}
    {entry && !session ? <Card><Text style={s.h2}>Kendini denemeye hazır mısın?</Text>
      <Text style={s.body}>50 soru · 45 dakika · Başarı eşiği 70. Yanlışlar doğruları götürmez.</Text>
      <Text style={s.body}>Sorular havuzdan seçilir; daha az karşılaştığın sorulara öncelik verilir. İstediğin zaman ara verebilir veya denemeyi bitirebilirsin. Ara verdiğinde süre durur.</Text>
      <Button title="Denemeyi başlat" disabled={!canStart || !!session} onPress={() => start('exam')} /><Button title="Vazgeç" secondary onPress={() => setEntry(false)} />
    </Card> : session && session.pausedAt === undefined && current ? <>
      <View style={s.row}><Text style={s.eyebrow}>{session.mode === 'study' ? 'KONU ÇALIŞMASI' : 'SINAV PROVASI'}</Text><Text style={s.badge}>{session.deadline ? `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}` : 'Süresiz'}</Text></View>
      <Bar value={(session.index + 1) / session.ids.length * 100} />
      <View style={[s.row, { justifyContent: 'flex-start' }]}><TopicIcon topic={current.topic} /><View style={{ flex: 1, gap: 3 }}><Text style={s.small}>Soru {session.index + 1} / {session.ids.length} · {current.topic}</Text><Text style={s.small}>{Object.keys(session.selections).length} cevaplandı · {session.ids.length - Object.keys(session.selections).length} boş</Text></View></View>
      <Text style={s.h2}>{current.text}</Text>
      {current.options.map((option, i) => <Pressable key={option} accessibilityRole="radio" accessibilityState={{ checked: session.selections[current.id] === i, disabled: revealed }} disabled={revealed} onPress={() => {
        if (session.deadline && Date.now() >= session.deadline) { finish(session); return; }
        setSession({ ...session, selections: { ...session.selections, [current.id]: i } });
      }} style={[s.option, session.selections[current.id] === i && s.selected]}><View style={[s.optionLetter, session.selections[current.id] === i && { backgroundColor: colors.green }]}><Text style={[s.letter, session.selections[current.id] === i && { color: colors.white }]}>{'ABCD'[i]}</Text></View><Text style={[s.body, { flex: 1, color: colors.ink }]}>{option}</Text>{session.selections[current.id] === i && <Icon name="check" size={18} />}</Pressable>)}
      {session.mode === 'study' && !revealed && <Button title="Cevabı kontrol et" disabled={session.selections[current.id] === undefined} onPress={() => setSession({ ...session, revealed: [...session.revealed, current.id] })} />}
      {revealed && <Card><Text style={s.h2}>{session.selections[current.id] === current.correct ? 'Doğru cevap' : 'Birlikte öğrenelim'}</Text><Text style={s.body}>Cevap: {'ABCD'[current.correct]} — {current.options[current.correct]}</Text><Text style={s.body}>{current.explanation}</Text></Card>}
      <View style={s.row}><Button title="← Önceki" secondary disabled={session.index === 0} onPress={() => setSession({ ...session, index: session.index - 1 })} />{session.index < session.ids.length - 1 && <Button title="Sonraki →" onPress={() => setSession({ ...session, index: session.index + 1 })} />}</View>
      <Button title={showMap ? 'Soru listesini gizle' : 'Soru listesi · cevapları gözden geçir'} secondary onPress={() => setShowMap(!showMap)} />
      {showMap && <View style={[s.row, { justifyContent: 'flex-start' }]}>{session.ids.map((id, index) => <Pressable accessibilityRole="button" accessibilityLabel={`${index + 1}. soru, ${session.selections[id] === undefined ? 'boş' : 'cevaplandı'}`} key={id} onPress={() => setSession({ ...session, index })} style={[s.option, { minWidth: 48, minHeight: 48, padding: 12 }, session.selections[id] !== undefined && s.selected, index === session.index && { borderWidth: 2, borderColor: colors.green }]}><Text style={s.letter}>{index + 1}</Text></Pressable>)}</View>}
      <Text style={s.small}>{current.source}</Text>
      <Button title="Ara ver ve ana sayfaya dön" secondary onPress={() => { setSession(pauseSession(session, Date.now())); setConfirm(false); setPage('home'); }} />
      {confirm ? <Card>
        <Text style={s.h2}>{Object.keys(session.selections).length === 0 ? 'Hiç soru cevaplamadınız' : 'Çalışmayı tamamlayalım mı?'}</Text>
        {Object.keys(session.selections).length === 0 ? (
          <Text accessibilityRole="alert" style={s.notice}>Çalışmayı bitirmek istediğinize emin misiniz? Bitirirseniz sonucunuz %0 olarak kaydedilecek.</Text>
        ) : (
          <Text style={s.body}>{session.ids.length - Object.keys(session.selections).length} boş soru var. Boşlar doğru sayısına eklenmez. Sonucun kaydedilir.</Text>
        )}
        <Button title="Çözmeye devam et" onPress={() => { setConfirm(false); }} />
        <Button title={Object.keys(session.selections).length === 0 ? 'Evet, yine de bitir' : 'Tamamla ve sonucu gör'} secondary onPress={() => finish(session)} />
      </Card> : <Button title="Çalışmayı bitir" secondary onPress={() => setConfirm(true)} />}
    </> : result ? <>
      <Text style={s.eyebrow}>ÇALIŞMA SONUCUN</Text><Text style={s.title}>Bir adım daha ileride.</Text>
      <Card><ResultVisual attempt={result} /><Meta icon="clock" text={`${result.durationSeconds} saniye · ${result.mode === 'exam' ? 'Sınav provası' : result.mode === 'mini' ? 'Eski mini deneme' : 'Konu çalışması'}`} /><Meta icon="shield" text={saving ? 'Kaydediliyor…' : saveError ? 'Kaydedilmedi' : 'Cihazına kaydedildi'} /><Text style={s.small}>{result.mode === 'exam' ? (result.score >= 70 ? 'Prova sonucu: başarılı. Bu sonuç resmî sınav sonucu değildir.' : 'Prova sonucu: 70 puan eşiğinin altında. Bu sonuç resmî sınav sonucu değildir.') : 'Konu çalışması sınav sonucu değildir.'}</Text></Card>
      {result.answers.map(a => { const q = questions.find(q => q.id === a.questionId)!; return <Card key={a.questionId}><Text style={s.eyebrow}>{a.correct ? 'DOĞRU' : a.selected === null ? 'BOŞ' : 'YANLIŞ'} · {a.firstSeen ? 'İLK KARŞILAŞMA' : 'TEKRAR'}</Text><Text style={s.h2}>{q.text}</Text><Text style={s.body}>Cevabın: {a.selected === null ? 'Boş' : q.options[a.selected]}</Text><Text style={s.body}>Doğru cevap: {q.options[q.correct]}</Text><Text style={s.small}>{q.explanation}</Text></Card>; })}
      <Button title="Gelişimimi gör" onPress={() => { setResult(null); setPage('progress'); }} />
      <Button title="Ana sayfaya dön" secondary onPress={() => { setResult(null); setPage('home'); }} />
    </> : page === 'notebook' ? <ReviewNotebook entries={notebook} disabled={!canStart || !!session} onStudy={ids=>start('study',undefined,ids)} onBack={()=>setPage('home')} /> : page === 'car' ? <CarScene onBack={()=>setPage('home')} onScreenChange={()=>scroll.current?.scrollTo({y:0,animated:false})} /> : page === 'junction' ? <JunctionLab onBack={()=>setPage('home')} /> : page === 'signs' ? <TrafficSigns onBack={()=>setPage('home')} /> : page === 'home' ? <>
      {session?.pausedAt !== undefined && <Card><Text style={s.h2}>Kaldığın yerden devam et</Text><Text style={s.body}>{Object.keys(session.selections).length}/{session.ids.length} cevaplandı · {session.deadline ? `${Math.floor(remainingSeconds(session, Date.now()) / 60)} dk ${remainingSeconds(session, Date.now()) % 60} sn kaldı` : 'Süresiz çalışma'}</Text><Button title="Çalışmaya devam et" disabled={!canStart} onPress={() => { setConfirm(false); setSession(resumeSession(session, Date.now())); }} /><Button title="Çalışmayı bitir" secondary onPress={() => { setSession(resumeSession(session, Date.now())); setConfirm(true); }} /></Card>}

      <View style={{ gap: 9 }}><Text style={s.eyebrow}>YOLCULUĞUN BURADA BAŞLIYOR</Text><Text style={s.title}>Ehliyete giden yolda,{'\n'}her gün bir adım.</Text><Text style={s.body}>Çalış, kendini dene, gelişimini keşfet.</Text></View>
      <View style={s.hero}><Text style={s.badge}>İLK SÜRÜM · ÖRNEK SORULAR</Text><Text style={s.heroTitle}>Gerçek tempoda prova.{'\n'}Güzel bir başlangıç.</Text><JourneyArt scrollY={journeyScroll} /><View style={[s.row, { justifyContent: 'flex-start' }]}><Meta icon="book" text={`${questions.length} soruluk havuz`} light /><Meta icon="clock" text="50 soru · 45 dakika" light /></View><Button title="50 soruluk sınava hazırlan →" onPress={() => setEntry(true)} disabled={!canStart || !!session} /><Text style={[s.small, { color: '#CCDCD3' }]}>50 soru · 45 dakika · Dilediğinde ara ver. Açıklamalar sınav sonunda.</Text></View>
      {history.length > 0 && <StudySnapshot history={history} />}
      <Card><View style={s.row}><View style={{flexDirection:'row',alignItems:'center',gap:10}}><Icon name="road" size={24}/><Text style={s.eyebrow}>BUGÜNÜN ROTASI</Text></View><Text style={s.badge}>{daily.ids.length} soru · 4 dk</Text></View><Text style={s.h2}>Senin için hazır.</Text><Text style={s.body}>{daily.remedial ? 'Yanlışların ve pekiştirmen gereken konulardan kısa bir rota hazırladık.' : history.length ? 'Tekrar bekleyen yanlışın yok. Rotana yeni sorular ekledik.' : 'İlk kısa rotan hazır. Cevapların geldikçe sonraki rotalar sana göre değişecek.'}</Text><View style={[s.row,{justifyContent:'flex-start'}]}>{[...new Set(daily.ids.map(id=>questions.find(q=>q.id===id)!.topic))].map(topic=><Text key={topic} style={s.badge}>{topic}</Text>)}</View><Button title="Rotama başla →" disabled={!canStart || !!session || !daily.ids.length} onPress={()=>start('study',undefined,daily.ids)} />{session && <Text style={s.small}>Rotan için açık çalışmanı önce tamamla.</Text>}<Button title={`Hatalarım defteri · ${notebook.filter(e=>e.status!=='Öğrendim').length} soru bekliyor`} secondary onPress={()=>setPage('notebook')} /></Card>
      <View style={{gap:5}}><Text style={s.h2}>Görerek öğren</Text><Text style={s.small}>Bir dokunuşla aç, kısa bir tur yap, devam et.</Text></View>
      <Card><View style={s.row}><View style={{flexDirection:'row',alignItems:'center',gap:12,flex:1}}><View style={s.emptyIcon}><Icon name="road" size={34}/></View><View style={{flex:1,gap:4}}><Text style={s.h2}>Kavşak laboratuvarı</Text><Text style={s.small}>15 durumluk havuz · her tur farklı 5 soru</Text></View></View></View><Text style={s.body}>Kavşağa bak, geçiş sırasını seç ve doğru hareketi anında gör.</Text><Button title="İlk kavşağı aç →" onPress={()=>setPage('junction')} disabled={!!session}/></Card>
      <Card><View style={s.row}><View style={{flexDirection:'row',alignItems:'center',gap:12,flex:1}}><View style={[s.emptyIcon,{backgroundColor:'#E6EEF5'}]}><Icon name="flag" size={34} color="#2F6F9F"/></View><View style={{flex:1,gap:4}}><Text style={s.h2}>Trafik işaretleri</Text><Text style={s.small}>26 temel işaret · her tur değişen hızlı test</Text></View></View></View><Text style={s.body}>İşaretleri kategori kategori keşfet veya doğrudan hızlı teste gir.</Text><Button title="İşaretleri keşfet →" onPress={()=>setPage('signs')} disabled={!!session}/></Card>
      <View style={{ gap: 5 }}><Text style={s.h2}>Bugün ne çalışalım?</Text><Text style={s.small}>Bir konu seç, her cevapta yeni bir şey öğren.</Text></View>
      <View style={{ gap: 10 }}>{topics.map(topic => <TopicTile key={topic} topic={topic} count={questions.filter(q => q.topic === topic).length} disabled={!canStart || !!session} onPress={() => start('study', topic)} />)}</View>
    </> : page === 'progress' ? <>
      <Text style={s.eyebrow}>GELİŞİM GÜNLÜĞÜN</Text><Text style={s.title}>Dünü gör.{'\n'}Yarına hazırlan.</Text>
      <Button title="Hatalarım defterini aç" secondary onPress={()=>setPage('notebook')} />
      {!history.length ? <Card><View style={s.emptyIcon}><Icon name="chart" size={36} /></View><Text style={s.h2}>İlk adımını bekliyor.</Text><Text style={s.body}>Bir mini deneme tamamladığında sonuçların ve konu dağılımın burada görünecek.</Text><Button title="İlk sınav provamı başlat" onPress={() => setEntry(true)} disabled={!canStart || !!session} /></Card> : <>
        <Card><Text style={s.h2}>{history.length} çalışma tamamlandı</Text><Text style={s.body}>Son çalışma: %{history[0].score} doğruluk</Text><Text style={s.small}>Konu çalışmaları ve mini denemeler farklı kapsamlardadır; puanları tek bir gelişim oranında birleştirmiyoruz.</Text></Card>
        {stats.map(stat => <Card key={stat.topic}><View style={s.row}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}><TopicIcon topic={stat.topic} /><Text style={[s.h2, { fontSize: 18, flex: 1 }]}>{stat.topic}</Text></View><Text style={s.letter}>{stat.total ? `%${stat.accuracy}` : '—'}</Text></View><Bar value={stat.accuracy} /><Text style={s.small}>{stat.correct}/{stat.total} doğru · {stat.unique} farklı soru{stat.firstCount > 0 ? ` · İlk karşılaşmada %${stat.firstAccuracy}` : ''}</Text><Text style={s.body}>{stat.enough ? 'Çalışma sonuçlarını izlemeye devam et.' : 'Henüz yeterli veri yok. Güçlü veya eksik konu yorumu için en az 10 farklı soru gerekli.'}</Text><Button title="Bu konuyu çalış" secondary disabled={!canStart || !!session} onPress={() => start('study', stat.topic)} /></Card>)}
        <Text style={s.h2}>Çalışma geçmişi</Text>{history.map(a => <Card key={a.id}><View style={s.row}><Text style={s.h2}>%{a.score}</Text><Text style={s.small}>{new Date(a.finishedAt).toLocaleString('tr-TR')}</Text></View><Text style={s.body}>{a.mode === 'exam' ? 'Sınav provası' : a.mode === 'mini' ? 'Eski mini deneme' : 'Konu çalışması'} · {a.answers.length} soru · {a.durationSeconds} sn</Text><Text style={s.small}>{a.answers.filter(x => x.firstSeen).length} ilk karşılaşma · {a.answers.filter(x => !x.firstSeen).length} tekrar</Text></Card>)}
      </>}
    </> : <>
      <Text style={s.eyebrow}>ŞEFFAF VE GÜNCEL</Text><Text style={s.title}>Neye hazırlanıyoruz?</Text>
      <Card><Text style={s.h2}>MEB teorik e-Sınav çerçevesi</Text><Text style={s.body}>{examRules.questions} soru · {examRules.minutes} dakika · Başarı eşiği {examRules.passScore}/100</Text>{topics.map(topic => <View key={topic} style={s.row}><Text style={s.body}>{topic}</Text><Text style={s.letter}>{examRules.distribution[topic]} soru</Text></View>)}<Text style={s.small}>Yanlış cevaplar doğru cevapları azaltmaz. İşitme engelli adaylar için kılavuzda 15 dakika ek süre tanımlanır.</Text><Text style={s.small}>Kaynak kontrolü: 14 Eylül 2026</Text><Button title="MEB 2026 kılavuzunu aç" secondary onPress={() => setGuideOpen(true)} /></Card>
      <Card><Text style={s.h2}>Soru bankası hakkında</Text><Text style={s.body}>Havuzda {questions.length} soru var. Her denemede konu dağılımına uygun 50 soru seçilir; daha az karşılaştığın sorulara öncelik verilir. Bu içerik MEB onaylı değildir; güncel sınavda aynı soruların çıkacağı garanti edilmez.</Text></Card>
      <Card><Text style={s.h2}>Kayıtların cihazında</Text><Text style={s.body}>Hesap açman gerekmez. Çalışmaların ve verdiğin cevaplar bu cihazda saklanır; bulut yedeği yoktur. Ara vererek ana sayfaya dönebilir, kalan sürenle devam edebilirsin. Uygulama arka plana geçtiğinde de deneme duraklatılır. Uygulama verilerini silersen kayıtların silinir.</Text></Card>
      <Card><Text style={s.h2}>Birinci Vites açık kaynak</Text><Text style={s.body}>Projeyi incelemek, gelişmeleri takip etmek veya katkıda bulunmak için GitHub deposunu açabilirsin.</Text><Button title="GitHub'da görüntüle →" secondary onPress={() => void Linking.openURL('https://github.com/berkantkull/birinci-vites')} /></Card>
    </>}
  </ScrollView>{(!session || session.pausedAt !== undefined) && !result && !entry && <NavigationBar>{(['home', 'progress', 'car', 'info'] as const).map((p, i) => <Pressable key={p} accessibilityRole="tab" accessibilityState={{ selected: p === page }} onPress={() => setPage(p)} style={[s.tab, glass && s.glassTab, glass && page === p && s.glassTabSelected]}><Icon name={(['book', 'chart', 'car', 'compass'] as const)[i]} size={22} color={page === p ? colors.green : colors.muted} /><Text style={{ fontSize: 12, color: page === p ? colors.green : colors.muted, fontWeight: page === p ? '800' : '500' }}>{['Çalış', 'Gelişim', 'Sürüş', 'Rehber'][i]}</Text></Pressable>)}</NavigationBar>}</SafeAreaView>;
}
