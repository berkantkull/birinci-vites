import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GlassView } from 'expo-glass-effect';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiquidGlass } from './liquidGlass';
export const colors = { bg: '#F3F5F0', ink: '#162D28', muted: '#5F706A', green: '#24634D', lime: '#DDECAC', border: '#DCE3DB', white: '#FFFFFF' };
export function Button({ title, onPress, secondary = false, disabled = false }: { title: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  const glass = useLiquidGlass();
  if (glass && secondary) {
    return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}>
      {({ pressed }) => <GlassView glassEffectStyle="regular" colorScheme="light" isInteractive={!disabled} tintColor="#EAF0E530" style={[s.button, { backgroundColor: 'transparent', borderRadius: 22 }, pressed && { transform: [{ scale: 0.98 }] }]}>
        <Text style={[s.buttonText, { color: colors.ink }, disabled && { opacity: 0.45 }]}>{title}</Text>
      </GlassView>}
    </Pressable>;
  }
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, secondary && s.secondary, (disabled || pressed) && { opacity: 0.5 }]}><Text style={[s.buttonText, secondary && { color: colors.ink }]}>{title}</Text></Pressable>;
}
export function NavigationBar({ children }: { children: ReactNode }) {
  const glass = useLiquidGlass();
  const insets = useSafeAreaInsets();
  if (!glass) return <View style={s.nav}>{children}</View>;
  return <View pointerEvents="box-none" style={[s.glassNavPosition, { bottom: insets.bottom + 8 }]}>
    <GlassView glassEffectStyle="regular" colorScheme="light" style={s.glassNav}>{children}</GlassView>
  </View>;
}
export function Card({ children }: { children: ReactNode }) { return <View style={s.card}>{children}</View>; }
export function Bar({ value }: { value: number }) { return <View style={s.track}><View style={[s.fill, { width: `${Math.max(0, Math.min(100, value))}%` }]} /></View>; }
export const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg }, content: { width: '100%', maxWidth: 700, alignSelf: 'center', padding: 22, gap: 20, paddingBottom: 36 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  brand: { fontSize: 23, fontWeight: '800', color: colors.ink, letterSpacing: -1 }, eyebrow: { color: colors.green, fontSize: 12, fontWeight: '700', letterSpacing: 1.8 },
  title: { color: colors.ink, fontSize: 34, fontWeight: '800', lineHeight: 41, letterSpacing: -1 }, h2: { color: colors.ink, fontSize: 21, fontWeight: '700', lineHeight: 29 },
  body: { color: colors.muted, fontSize: 15, lineHeight: 23 }, small: { color: colors.muted, fontSize: 12, lineHeight: 19 },
  card: { backgroundColor: colors.white, borderRadius: 22, padding: 22, gap: 15, borderWidth: 1, borderColor: colors.border },
  hero: { backgroundColor: colors.ink, borderRadius: 26, padding: 25, gap: 20, overflow: 'hidden' },
  heroTitle: { fontSize: 29, lineHeight: 36, fontWeight: '700', color: colors.white }, heroBody: { fontSize: 15, lineHeight: 24, color: '#CCDCD3' },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.lime, color: colors.ink, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, fontWeight: '700', fontSize: 12 },
  button: { backgroundColor: colors.green, borderRadius: 14, padding: 16, alignItems: 'center', justifyContent: 'center', minHeight: 52 }, buttonText: { color: colors.white, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  secondary: { backgroundColor: '#EAF0E5' }, track: { height: 7, backgroundColor: '#EAF0E5', borderRadius: 5, overflow: 'hidden' }, fill: { height: '100%', backgroundColor: colors.green },
  option: { borderWidth: 1, borderColor: colors.border, padding: 16, borderRadius: 15, flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60 },
  selected: { borderColor: colors.green, backgroundColor: '#EAF3E6' }, letter: { fontWeight: '800', color: colors.green, fontSize: 16 },
  optionLetter: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#EAF0E5', alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { width: 78, height: 78, borderRadius: 25, backgroundColor: '#EAF0E5', alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, backgroundColor: colors.border },
  nav: { borderTopWidth: 1, borderColor: colors.border, backgroundColor: colors.white, flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 9 },
  glassNavPosition: { position: 'absolute', left: 18, right: 18, alignItems: 'center' },
  glassNav: { width: '100%', maxWidth: 540, flexDirection: 'row', justifyContent: 'space-around', padding: 7, borderRadius: 32 },
  glassTab: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 24 },
  glassTabSelected: { backgroundColor: '#24634D18' },
  tab: { paddingVertical: 8, paddingHorizontal: 18, minHeight: 56, gap: 5, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }, notice: { color: '#885221', backgroundColor: '#FFF2DD', padding: 14, borderRadius: 12, lineHeight: 22 }, big: { fontSize: 54, fontWeight: '800', color: colors.ink },
});
