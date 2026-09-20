import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { View } from 'react-native';

export type IconName = 'book' | 'chart' | 'shield' | 'road' | 'aid' | 'car' | 'heart' | 'clock' | 'arrow' | 'check' | 'close' | 'minus' | 'flag' | 'lock' | 'compass';
const paths: Record<IconName, string> = {
  book: 'M12 5v15M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-4-2-7-1-10 1',
  chart: 'M4 3v18h17M8 16v-4m5 4V8m5 8V5',
  shield: 'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4m-4 10 3 3 5-6',
  road: 'M7 2 3 22M17 2l4 20M12 3v3m0 4v4m0 4v3',
  aid: 'M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z',
  car: 'm3 10 2-6h14l2 6M3 10h18v8H3Zm2 8v3m14-3v3M6 14h2m8 0h2',
  heart: 'M12 21 3 12C-3 4 7-2 12 6c5-8 15-2 9 6Z',
  clock: 'M12 7v5l3 2',
  compass: 'm16 8-2.5 5.5L8 16l2.5-5.5Z',
  arrow: 'M4 12h15m-6-6 6 6-6 6',
  check: 'm5 12 4 4L19 6',
  close: 'm6 6 12 12M6 18 18 6',
  minus: 'M5 12h14',
  flag: 'M4 22V3c6-4 10 4 16 0v11c-6 4-10-4-16 0',
  lock: 'M7 10V7a5 5 0 0 1 10 0v3m-5 5v3',
};
// Dekoratif ikonlar ekran okuyucuda yanlarındaki etiketi tekrar ettirmez.
export function Icon({ name, size = 22, color = '#24634D' }: { name: IconName; size?: number; color?: string }) {
  return <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none">
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {(name === 'clock' || name === 'compass') && <Circle cx={12} cy={12} r={9} />}
      {name === 'lock' && <Rect x={4} y={10} width={16} height={12} rx={3} />}
      <Path d={paths[name]} />
    </Svg>
  </View>;
}
