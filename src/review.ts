import type { Attempt, Question } from './domain';

export type ReviewEntry = { question: Question; mistakes: number; streak: number; lastWrong: string; status: 'Tekrar bak' | 'Pekiştir' | 'Öğrendim' };
// Derive the notebook from saved attempts so older records need no migration.
export function reviewEntries(history: Attempt[], bank: Question[]): ReviewEntry[] {
  const entries = new Map<string, ReviewEntry>();
  const questions = new Map(bank.map(q => [q.id, q]));
  for (const attempt of [...history].sort((a,b) => Date.parse(a.finishedAt) - Date.parse(b.finishedAt))) {
    for (const answer of attempt.answers) {
      if (answer.selected === null) continue; // Unanswered does not mean misunderstood.
      const question = questions.get(answer.questionId);
      if (!question) continue;
      let entry = entries.get(question.id);
      if (!answer.correct) {
        entry = { question, mistakes: (entry?.mistakes ?? 0) + 1, streak: 0, lastWrong: attempt.finishedAt, status: 'Tekrar bak' };
        entries.set(question.id, entry);
      } else if (entry) {
        entry.streak++;
        entry.status = entry.streak >= 2 ? 'Öğrendim' : 'Pekiştir';
      }
    }
  }
  return [...entries.values()].sort((a,b) => a.streak - b.streak || b.mistakes - a.mistakes || Date.parse(b.lastWrong) - Date.parse(a.lastWrong));
}
export function dailyReview(history: Attempt[], bank: Question[], limit = 5) {
  const pending = reviewEntries(history, bank).filter(e => e.status !== 'Öğrendim');
  if (pending.length) return { ids: pending.slice(0,limit).map(e => e.question.id), remedial: true };
  const answered = new Set(history.flatMap(a => a.answers.filter(x => x.selected !== null).map(x => x.questionId)));
  const unseen = bank.filter(q => !answered.has(q.id));
  // Round-robin topics keeps an initial short session varied.
  const pools = [...new Set(bank.map(q => q.topic))].map(topic => (unseen.length ? unseen : bank).filter(q => q.topic === topic));
  const ids: string[] = [];
  for (let index=0; ids.length<limit && pools.some(pool => pool[index]); index++) {
    for (const pool of pools) if (pool[index] && ids.length<limit) ids.push(pool[index].id);
  }
  return { ids, remedial: false };
}
