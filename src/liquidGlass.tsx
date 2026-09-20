import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, AppState, Platform } from 'react-native';
import { isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';

const LiquidGlassContext = createContext(false);

// Native API desteği ve kullanıcının erişilebilirlik tercihi birlikte değerlendirilir.
export function LiquidGlassProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (Platform.OS !== 'ios' || !isGlassEffectAPIAvailable() || !isLiquidGlassAvailable()) return;
    let active = true;
    let revision = 0;
    const refresh = async () => {
      const current = ++revision;
      try {
        const reduced = await AccessibilityInfo.isReduceTransparencyEnabled();
        if (active && current === revision) setEnabled(!reduced);
      } catch {
        if (active && current === revision) setEnabled(false);
      }
    };
    const transparency = AccessibilityInfo.addEventListener('reduceTransparencyChanged', reduced => {
      revision++;
      setEnabled(!reduced);
    });
    const appState = AppState.addEventListener('change', state => {
      if (state === 'active') void refresh();
    });
    void refresh();
    return () => { active = false; transparency.remove(); appState.remove(); };
  }, []);
  return <LiquidGlassContext.Provider value={enabled}>{children}</LiquidGlassContext.Provider>;
}

export function useLiquidGlass() { return useContext(LiquidGlassContext); }
