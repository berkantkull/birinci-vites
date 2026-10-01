import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Button, Card, colors, s } from './ui';
import type { ReviewEntry } from './review';

export function ReviewNotebook({ entries, disabled, onStudy, onBack }: { entries: ReviewEntry[]; disabled: boolean; onStudy: (ids: string[]) => void; onBack: () => void }) {
  const [filter, setFilter] = useState('Tekrar bak');
  const [opened, setOpened] = useState<string | null>(null);
  const visible = entries.filter(e => e.status === filter);
  return <>
    <Button title="← Ana sayfa" secondary onPress={onBack} />
    <Text style={s.eyebrow}>HER HATA BİR İPUCU</Text>
    <Text style={s.title}>Yanlış cevapların</Text>
    <Text style={s.body}>Yanlış yaptığın sorular burada kalır. Sonraki çalışmalarda bir doğruyla pekiştirmeye, üst üste iki doğruyla öğrendiklerine geçer. Yeniden yanlış yaparsan tekrar listesine döner.</Text>
    <View style={[s.row, { justifyContent: 'flex-start' }]}>{['Tekrar bak','Pekiştir','Öğrendim'].map(label => <Pressable key={label} accessibilityRole="tab" accessibilityState={{ selected: filter===label }} onPress={() => { setFilter(label); setOpened(null); }} style={{ backgroundColor: filter===label ? colors.ink : '#E5EBDC', borderRadius: 20, padding: 13, minHeight: 48 }}><Text style={{ color: filter===label ? 'white' : colors.ink, fontWeight: '700' }}>{label} · {entries.filter(e=>e.status===label).length}</Text></Pressable>)}</View>
    {disabled && <Text style={s.small}>Yeni tekrar için açık çalışmanı tamamla. Defterini şimdi inceleyebilirsin.</Text>}
    {!visible.length ? <Card><Text style={s.h2}>{!entries.length ? 'Henüz bir yanlışın yok.' : 'Bu sayfa şimdilik boş.'}</Text><Text style={s.body}>{!entries.length ? 'Bir çalışma tamamladığında yanlış cevapladığın soruları burada bulacaksın. Boş bıraktıklarını yanlış olarak eklemiyoruz.' : 'Çalışmalarını tamamladıkça soruların durumu otomatik güncellenir.'}</Text></Card> : <>
      <Button title={`${Math.min(5,visible.length)} soruyla tekrar yap`} disabled={disabled} onPress={()=>onStudy(visible.slice(0,5).map(e=>e.question.id))} />
      {visible.map(entry => <Card key={entry.question.id}>
        <View style={s.row}><Text style={s.eyebrow}>{entry.question.topic}</Text><Text style={s.small}>{entry.mistakes} kez yanlış · {Math.min(entry.streak,2)}/2 doğru tekrar</Text></View>
        <Text style={s.h2}>{entry.question.text}</Text>
        <Button title={opened===entry.question.id ? 'Açıklamayı gizle' : 'Cevabı ve açıklamayı gör'} secondary onPress={()=>setOpened(opened===entry.question.id ? null : entry.question.id)} />
        {opened===entry.question.id && <View style={{ gap: 8 }}><Text style={s.body}>{entry.question.options[entry.question.correct]}</Text><Text style={s.small}>{entry.question.explanation}</Text><Text style={s.small}>Açıklamayı okumak durumunu değiştirmez; tekrar çalışmasını tamamlamalısın.</Text></View>}
        <Button title="Bu soruyu tekrar çöz" secondary disabled={disabled} onPress={()=>onStudy([entry.question.id])} />
      </Card>)}
    </>}
  </>;
}
