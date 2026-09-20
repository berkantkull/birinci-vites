export const topics = ['Trafik ve çevre', 'İlk yardım', 'Araç tekniği', 'Trafik adabı'] as const;
export type Topic = typeof topics[number];
export type Question = { id: string; topic: Topic; text: string; options: [string, string, string, string]; correct: number; explanation: string; source: string; subtopic?: string; referenceUrl?: string };
export type Answer = { questionId: string; topic: Topic; selected: number | null; correct: boolean; firstSeen: boolean };
export type Attempt = { id: string; finishedAt: string; mode: 'study' | 'mini' | 'exam'; answers: Answer[]; durationSeconds: number; score: number };
export const examRules = {
  questions: 50, minutes: 45, passScore: 70,
  distribution: { 'Trafik ve çevre': 23, 'İlk yardım': 12, 'Araç tekniği': 9, 'Trafik adabı': 6 },
  checkedAt: '2026-09-14',
  source: 'https://www.meb.gov.tr/meb_iys_dosyalar/2026_07/6a6b50c06daf3993652350_MTSK_e-Sinav_Kilavuzu_2026.pdf',
};
export function scoreAnswers(answers: Answer[]) {
  return answers.length ? Math.round(answers.filter(a => a.correct).length / answers.length * 100) : 0;
}
export function topicStats(history: Attempt[]) {
  return topics.map(topic => {
    const answers = history.flatMap(a => a.answers).filter(a => a.topic === topic);
    const unique = new Set(answers.map(a => a.questionId)).size;
    const first = answers.filter(a => a.firstSeen);
    return { topic, total: answers.length, unique, correct: answers.filter(a => a.correct).length,
      accuracy: scoreAnswers(answers), firstAccuracy: scoreAnswers(first), firstCount: first.length,
      enough: unique >= 10 };
  });
}
// C# tarafındaki DTO doğrulamasına benzer: cihazdan okunan veri de denetlenir.
export function parseHistory(raw: string | null): Attempt[] {
  if (raw === null) return [];
  const data = JSON.parse(raw);
  if (!data || data.version !== 1 || !Array.isArray(data.attempts)) throw new Error('Geçersiz kayıt biçimi');
  for (const a of data.attempts) {
    if (!a || typeof a.id !== 'string' || !Number.isFinite(Date.parse(a.finishedAt)) ||
      !['study', 'mini', 'exam'].includes(a.mode) || !Number.isFinite(a.durationSeconds) || a.durationSeconds < 0 ||
      !Array.isArray(a.answers) || a.answers.length === 0 || a.answers.some((v: Answer) => !v || typeof v.questionId !== 'string' ||
        !topics.includes(v.topic) || typeof v.correct !== 'boolean' || typeof v.firstSeen !== 'boolean' ||
        !(v.selected === null || (Number.isInteger(v.selected) && v.selected >= 0 && v.selected <= 3)) || (v.selected === null && v.correct)) ||
      a.score !== scoreAnswers(a.answers)) throw new Error('Geçersiz çalışma kaydı');
  }
  return data.attempts;
}
