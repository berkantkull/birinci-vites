import { useEffect, useState } from 'react';
import { journeyPose, roadPath } from './journey';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';
import type { Attempt, Topic } from './domain';
import { Icon, type IconName } from './icons';
import { colors, s } from './ui';

const topicVisuals: Record<Topic, { icon: IconName; bg: string; ink: string; description: string }> = {
  'Trafik ve çevre': { icon: 'road', bg: '#EAF0DF', ink: '#466036', description: 'Yolu oku, güvenle ilerle.' },
  'İlk yardım': { icon: 'aid', bg: '#FCECEB', ink: '#CC4148', description: 'Doğru müdahalenin ilk adımı.' },
  'Araç tekniği': { icon: 'car', bg: '#E7F0FA', ink: '#337BB3', description: 'Aracını daha yakından tanı.' },
  'Trafik adabı': { icon: 'heart', bg: '#FAEAF0', ink: '#C6537D', description: 'Yolu paylaş, saygıyı koru.' },
};
export function TopicIcon({ topic }: { topic: Topic }) {
  const visual = topicVisuals[topic];
  return <View style={[v.iconBox, { backgroundColor: visual.bg, borderRadius: 20 }]}><Icon name={visual.icon} color={visual.ink} size={26} /></View>;
}
export function TopicTile({ topic, count, disabled, onPress }: { topic: Topic; count: number; disabled: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`${topic}, ${count} örnek soru. Konu çalışmasına başla.`} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [v.topicTile, pressed && { backgroundColor: '#EAF0E5', transform: [{ scale: 0.99 }] }, disabled && { opacity: 0.5 }]}>
    <TopicIcon topic={topic} /><View style={{ flex: 1, gap: 5 }}><Text style={v.tileTitle}>{topic}</Text><Text style={s.small}>{topicVisuals[topic].description}</Text><Text style={v.topicCount}>{count} örnek soru · Açıklamalı</Text></View><Icon name="arrow" size={19} />
  </Pressable>;
}
export function Meta({ icon, text, light = false }: { icon: IconName; text: string; light?: boolean }) {
  return <View style={v.inline}><Icon name={icon} size={17} color={light ? '#DDECAC' : colors.green} /><Text style={[s.small, light && { color: '#DFE9E1' }]}>{text}</Text></View>;
}
export function JourneyArt({ scrollY }: { scrollY: Animated.Value }) {
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(value => { if (active) setReduceMotion(value); }).catch(() => {});
    const preference = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    const listener = scrollY.addListener(({ value }) => setProgress(Math.max(0, Math.min(1, value / 240))));
    return () => { active = false; preference.remove(); scrollY.removeListener(listener); };
  }, [scrollY]);
  const pose = journeyPose(reduceMotion ? 0 : progress);
  return <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none" style={{ height: 115, marginVertical: -6 }}>
    <Svg width="100%" height="100%" viewBox="0 0 310 115">
      <Circle cx={255} cy={47} r={45} fill="#244338" /><Circle cx={255} cy={47} r={30} fill="#2C4D3F" />
      <Path d={roadPath} stroke="#486650" strokeWidth={32} fill="none" />
      <Path d={roadPath} stroke="#DDECAC" strokeWidth={2} strokeDasharray="9 10" fill="none" />
      <G transform={`translate(${pose.x} ${pose.y}) rotate(${pose.angle}) translate(-30.5 -17.5)`}><Rect x={0} y={0} width={61} height={35} rx={12} fill="#DDECAC" /><Rect x={19} y={5} width={26} height={25} rx={7} fill="#718B59" /><Path d="M27 6v23M41 7l3 4v13l-3 4" stroke="#DDECAC" strokeWidth={2} fill="none" /><Rect x={7} y={-3} width={11} height={4} rx={2} fill="#102B21" /><Rect x={7} y={34} width={11} height={4} rx={2} fill="#102B21" /><Rect x={46} y={-3} width={9} height={4} rx={2} fill="#102B21" /><Rect x={46} y={34} width={9} height={4} rx={2} fill="#102B21" /></G>
      <Path d="M270 24V3m0 0c8-5 13 4 22 0v13c-9 4-14-5-22 0" fill="#DDECAC" stroke="#DDECAC" strokeWidth={2} />
      <Circle cx={19} cy={42} r={4} fill="#51734F" /><Circle cx={286} cy={101} r={5} fill="#51734F" /><Path d="M127 13v10m-5-5h10" stroke="#8FA873" strokeWidth={2} />
    </Svg>
  </View>;
}
export function ResultVisual({ attempt }: { attempt: Attempt }) {
  const correct = attempt.answers.filter(a => a.correct).length;
  const wrong = attempt.answers.filter(a => a.selected !== null && !a.correct).length;
  const blank = attempt.answers.filter(a => a.selected === null).length;
  const circumference = 2 * Math.PI * 56;
  return <>
    <View style={{ alignItems: 'center', gap: 10 }}>
      <View accessible accessibilityLabel={`Yüzde ${attempt.score} doğruluk`} style={{ width: 148, height: 148, alignItems: 'center', justifyContent: 'center' }}>
        <Svg pointerEvents="none" width={148} height={148} style={StyleSheet.absoluteFill} viewBox="0 0 148 148"><Circle cx={74} cy={74} r={56} fill="none" stroke="#EDF1E7" strokeWidth={10} />{correct > 0 && <Circle cx={74} cy={74} r={56} fill="none" stroke={colors.green} strokeWidth={10} strokeLinecap="round" strokeDasharray={`${circumference * correct / attempt.answers.length} ${circumference}`} rotation={-90} origin="74, 74" />}</Svg>
        <Text style={[s.big, { fontSize: 37 }]}>%{attempt.score}</Text><Text style={s.small}>doğruluk</Text>
      </View>
    </View>
    <View style={v.resultMetrics}>{([{ label: 'Doğru', count: correct, icon: 'check', bg: '#EAF0DF', color: '#466036' }, { label: 'Yanlış', count: wrong, icon: 'close', bg: '#F9EBE5', color: '#A2563D' }, { label: 'Boş', count: blank, icon: 'minus', bg: '#EEF0ED', color: '#5F706A' }] as const).map(item => <View key={item.label} style={[v.resultMetric, { backgroundColor: item.bg }]}><Icon name={item.icon} color={item.color} size={18} /><Text style={v.tileTitle}>{item.count}</Text><Text style={s.small}>{item.label}</Text></View>)}</View>
  </>;
}
export function StudySnapshot({ history }: { history: Attempt[] }) {
  const unique = new Set(history.flatMap(a => a.answers.filter(x => x.selected !== null).map(x => x.questionId))).size;
  return <View style={v.snapshot}><Meta icon="flag" text={`${history.length} çalışma tamamlandı`} /><Meta icon="book" text={`${unique} farklı soru cevaplandı`} /></View>;
}
const v = StyleSheet.create({
  inline: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  iconBox: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  topicTile: { paddingVertical: 19, paddingHorizontal: 4, borderBottomWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 13 },
  tileTitle: { fontSize: 17, fontWeight: '700', color: colors.ink }, topicCount: { fontSize: 11, fontWeight: '600', color: colors.green },
  snapshot: { borderRadius: 17, padding: 16, gap: 12, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', backgroundColor: '#EAF0E5' },
  resultMetrics: { flexDirection: 'row', gap: 8 }, resultMetric: { flex: 1, borderRadius: 15, padding: 12, alignItems: 'center', gap: 6 },
});
