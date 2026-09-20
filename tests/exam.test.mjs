import test from 'node:test';
import assert from 'node:assert/strict';
import { createExam, remainingSeconds, parseSession, pauseSession, resumeSession } from '../src/examEngine.ts';
import { examQuestions } from '../src/examQuestions.ts';
import { additionalQuestions } from '../src/additionalQuestions.ts';
import { pdfQuestions } from '../src/pdfQuestions.ts';
const bank = [...pdfQuestions, ...additionalQuestions, ...examQuestions];
const topics = ['Trafik ve çevre', 'İlk yardım', 'Araç tekniği', 'Trafik adabı'];
const now = 10000000;
test('büyük havuzdan 50 benzersiz soru ve 23/12/9/6 dağılımı', () => {
  assert.ok(bank.length >= 150);
  assert.equal(new Set(bank.map(q => q.id)).size, bank.length);
  for (let i=0;i<30;i++) {
    const s = createExam(bank, now);
    assert.equal(s.ids.length,50); assert.equal(new Set(s.ids).size,50);
    assert.deepEqual(topics.map(t => s.ids.filter(id => bank.find(q => q.id === id).topic === t).length), [23,12,9,6]);
  }
  for (const q of bank) {
    assert.equal(q.options.length,4); assert.equal(new Set(q.options).size,4);
    assert.ok(Number.isInteger(q.correct) && q.correct>=0 && q.correct<4);
    assert.ok(q.options.every(x => x.trim().length>0));
  }
});
test('ilk iki deneme soru kimlikleri bakımından tamamen farklıdır', () => {
  const first=createExam(bank,now);
  const counts=Object.fromEntries(first.ids.map(id=>[id,1]));
  const second=createExam(bank,now+1,counts);
  assert.ok(second.ids.every(id=>!first.ids.includes(id)));
});
test('havuz tüketilince az karşılaşılan sorular seçilir', () => {
  const counts={};
  for(let i=0;i<15;i++) {
    const exam=createExam(bank,now+i,counts);
    for(const topic of topics) {
      const pool=bank.filter(q=>q.topic===topic);
      const selected=pool.filter(q=>exam.ids.includes(q.id));
      const omitted=pool.filter(q=>!exam.ids.includes(q.id));
      assert.ok(Math.max(...selected.map(q=>counts[q.id]??0))<=Math.min(...omitted.map(q=>counts[q.id]??0)));
    }
    exam.ids.forEach(id=>counts[id]=(counts[id]??0)+1);
  }
  assert.equal(Object.keys(counts).length,bank.length);
});
test('süre 45 dakika, bitişte sıfırın altına inmez', () => {
  const s=createExam(bank,now);
  assert.equal(remainingSeconds(s,now),2700);
  assert.equal(remainingSeconds(s,now+2700000),0);
  assert.equal(remainingSeconds(s,now+9000000),0);
});
test('mola süreden düşmez, cevaplar ve mola yeniden açılınca korunur', () => {
  const s=createExam(bank,now); s.selections[s.ids[0]]=2;
  const paused=pauseSession(s,now+300000);
  assert.equal(remainingSeconds(paused,now+9000000),2400);
  const restored=parseSession(JSON.parse(JSON.stringify(paused)),bank);
  const resumed=resumeSession(restored,now+9000000);
  assert.equal(remainingSeconds(resumed,now+9000000),2400);
  assert.equal(resumed.selections[s.ids[0]],2);
  assert.equal(remainingSeconds(resumed,now+9060000),2340);
  assert.equal(pauseSession(paused,now+600000),paused);
  assert.throws(()=>parseSession({...s,index:50},bank));
  assert.throws(()=>parseSession({...s,pausedAt:'invalid'},bank));
});
test('eksik konu bankası reddedilir',()=>assert.throws(()=>createExam(bank.filter(q=>q.topic!=='İlk yardım'),now)));
test('PDF kaynakları korunur, çelişkili cevap anahtarları dışarıda kalır',()=>{
  assert.equal(pdfQuestions.length,113);
  for(const q of pdfQuestions) assert.match(q.referenceUrl,/^https:\/\/www\.ehliyethane\.net\/wp-content\/uploads\/.*\.pdf$/);
  for(const id of ['ehliyethane-2-5','ehliyethane-4-45','ehliyethane-5-32','ehliyethane-5-47']) assert.ok(!pdfQuestions.some(q=>q.id===id));
  assert.equal(new Set(pdfQuestions.map(q=>q.text)).size,pdfQuestions.length);
});
