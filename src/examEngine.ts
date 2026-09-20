import type { Question } from './domain';
export type Session = { id: string; mode: 'study' | 'exam'; ids: string[]; index: number; selections: Record<string, number>; revealed: string[]; startedAt: number; deadline: number | null; pausedAt?: number };
export const EXAM_SECONDS = 2700;
export function remainingSeconds(session: Session, now: number) { return session.deadline === null ? 0 : Math.max(0, Math.ceil((session.deadline - (session.pausedAt ?? now)) / 1000)); }
export function pauseSession(session: Session, now: number): Session { return session.pausedAt !== undefined ? session : { ...session, pausedAt: now }; }
export function resumeSession(session: Session, now: number): Session {
  if (session.pausedAt === undefined) return session;
  const gap = Math.max(0, now - session.pausedAt);
  return { ...session, pausedAt: undefined, startedAt: session.startedAt + gap, deadline: session.deadline === null ? null : session.deadline + gap };
}
export function createExam(bank: Question[], now: number, exposures: Record<string, number> = {}): Session {
  const quotas: Record<string, number> = { 'Trafik ve çevre': 23, 'İlk yardım': 12, 'Araç tekniği': 9, 'Trafik adabı': 6 };
  const shuffle = <T,>(items: T[]) => { const result = [...items]; for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; } return result; };
  const ids = Object.entries(quotas).flatMap(([topic, count]) => {
    const pool = bank.filter(q => q.topic === topic);
    if (pool.length < count) throw new Error(`${topic}: yetersiz soru.`);
    // Shuffle equal-frequency questions; prefer the least encountered ones.
    return shuffle(pool).sort((a, b) => (exposures[a.id] ?? 0) - (exposures[b.id] ?? 0)).slice(0, count).map(q => q.id);
  });
  if (new Set(ids).size !== 50) throw new Error('Soru kimlikleri benzersiz olmalıdır.');
  return { id: `${now}-${Math.random().toString(36).slice(2)}`, mode: 'exam', ids: shuffle(ids), index: 0, selections: {}, revealed: [], startedAt: now, deadline: now + EXAM_SECONDS * 1000 };
}
export function parseSession(value: unknown, bank: Question[]): Session | null {
  if (value == null) return null;
  const s = value as Session;
  if (s.pausedAt !== undefined && (!Number.isFinite(s.pausedAt) || s.pausedAt < s.startedAt)) throw new Error('Geçersiz mola kaydı');
  if (!s || typeof s.id !== 'string' || !['study', 'exam'].includes(s.mode) || !Array.isArray(s.ids) || !s.ids.length || new Set(s.ids).size !== s.ids.length || s.ids.some(id => !bank.some(q => q.id === id)) || !Number.isInteger(s.index) || s.index < 0 || s.index >= s.ids.length || !s.selections || typeof s.selections !== 'object' || Object.entries(s.selections).some(([id, n]) => !s.ids.includes(id) || !Number.isInteger(n) || n < 0 || n > 3) || !Array.isArray(s.revealed) || s.revealed.some(id => !s.ids.includes(id)) || !Number.isFinite(s.startedAt) || (s.mode === 'exam' && (!Number.isFinite(s.deadline) || s.deadline! <= s.startedAt || s.ids.length !== 50)) || (s.mode === 'study' && s.deadline !== null)) throw new Error('Geçersiz oturum kaydı');
  return s;
}
