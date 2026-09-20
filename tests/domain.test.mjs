import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreAnswers, topicStats, parseHistory, examRules } from '../src/domain.ts';
const answer = (id, correct, selected = 0, firstSeen = true) => ({ questionId: id, topic: 'Trafik ve çevre', correct, selected, firstSeen });
const attempt = answers => ({ id: 'a', finishedAt: '2026-09-14T10:00:00Z', mode: 'mini', answers, durationSeconds: 10, score: scoreAnswers(answers) });
test('35 doğru, yanlış ve boşlardan bağımsız olarak 70 puan getirir', () => {
  const answers = Array.from({ length: 50 }, (_, i) => answer(String(i), i < 35, i < 45 ? 0 : null));
  assert.equal(scoreAnswers(answers), 70);
  assert.equal(scoreAnswers([]), 0);
  assert.equal(Object.values(examRules.distribution).reduce((a, b) => a + b), 50);
});
test('aynı sorunun tekrarları veri yeterliliğini şişirmez', () => {
  const history = [attempt([answer('q1', false)]), ...Array.from({ length: 20 }, () => attempt([answer('q1', true, 0, false)]))];
  const stat = topicStats(history)[0];
  assert.equal(stat.unique, 1);
  assert.equal(stat.total, 21);
  assert.equal(stat.firstAccuracy, 0);
  assert.equal(stat.enough, false);
});
test('kayıtlar yeniden okunur, bozuk veri sessizce silinmez', () => {
  const history = [attempt([answer('q1', true)])];
  assert.deepEqual(parseHistory(JSON.stringify({ version: 1, attempts: history })), history);
  assert.deepEqual(parseHistory(null), []);
  for (const value of ['null', '{}', 'broken', JSON.stringify({ version: 2, attempts: [] }), JSON.stringify({ version: 1, attempts: [{ ...history[0], score: 3 }] }), JSON.stringify({ version: 1, attempts: [attempt([answer('q1', true, null)])] })]) {
    assert.throws(() => parseHistory(value));
  }
});
