import test from 'node:test';
import assert from 'node:assert/strict';
import { reviewEntries, dailyReview } from '../src/review.ts';
import { carSteps, parseCarResults, failedCriteria } from '../src/carLesson.ts';
const bank=Array.from({length:12},(_,i)=>({id:`q${i}`,topic:i%2?'İlk yardım':'Trafik ve çevre'}));
const attempt=(n,correct,selected=0,id='q0')=>({finishedAt:new Date(n*1000).toISOString(),answers:[{questionId:id,correct,selected}]});
test('boşlar deftere girmez, iki doğru pekiştirir, yeni yanlış geri döndürür',()=>{
  const history=[attempt(1,false),attempt(2,false,null,'q1')];
  assert.equal(reviewEntries(history,bank).length,1);
  assert.equal(reviewEntries([...history,attempt(3,true)],bank)[0].status,'Pekiştir');
  const learned=[...history,attempt(3,true),attempt(4,true)];
  assert.equal(reviewEntries(learned.reverse(),bank)[0].status,'Öğrendim');
  const relapse=reviewEntries([...learned,attempt(5,false)],bank)[0];
  assert.equal(relapse.status,'Tekrar bak'); assert.equal(relapse.mistakes,2);
});
test('öneri yanlışlara öncelik verir, öğrendiklerini çıkarır ve limiti aşmaz',()=>{
  const history=[attempt(1,false),attempt(2,true),attempt(3,true),attempt(4,false,1,'q2')];
  assert.deepEqual(dailyReview(history,bank),{ids:['q2'],remedial:true});
  assert.equal(dailyReview([],bank).ids.length,5);
  assert.equal(new Set(dailyReview([],bank).ids).size,5);
  assert.deepEqual(dailyReview([],[]),{ids:[],remedial:false});
});
test('bankadan kaldırılmış sorular önerilmez',()=>assert.equal(reviewEntries([attempt(1,false,0,'missing')],bank).length,0));
test('araç tanıma yeni kapsam ve eski kayıtlarla uyumludur',()=>{
  assert.equal(carSteps.length,36); assert.equal(new Set(carSteps.map(s=>s.target)).size,36);
  const results=[{id:'car1',finishedAt:new Date().toISOString(),correct:4}];
  assert.deepEqual(parseCarResults(JSON.stringify({version:1,results})),results);
  assert.deepEqual(parseCarResults(null),[]);
  for(const raw of ['null','{}','bad',JSON.stringify({version:1,results:[{...results[0],correct:7}]})]) assert.throws(()=>parseCarResults(raw));
});

test('aynı EK-4 maddesinde birden fazla yanlış tek mavi hata sayılır',()=>{
 const bag=carSteps.filter(s=>s.criterion===6);
 assert.equal(bag.length,6);
 assert.deepEqual(failedCriteria(bag,bag.map(()=>'unknown')),[6]);
 const oil=carSteps.filter(s=>s.criterion===3);
 assert.deepEqual(failedCriteria(oil,oil.map(()=>'unknown')),[3]);
 const extra=carSteps.filter(s=>s.criterion===undefined);
 assert.deepEqual(failedCriteria(extra,extra.map(()=>'unknown')),[]);
});
test('manuel prova 16 resmi başlığı içerir ve beş ayrı hata sınırı korunur',()=>{
 const criteria=[...new Set(carSteps.flatMap(s=>s.criterion?[s.criterion]:[]))].sort((a,b)=>a-b);
 assert.deepEqual(criteria,Array.from({length:16},(_,i)=>i+1));
 const firstFive=criteria.slice(0,5).map(n=>carSteps.find(s=>s.criterion===n));
 assert.equal(failedCriteria(firstFive,['unknown','unknown','unknown','unknown']).length,4);
 assert.equal(failedCriteria(firstFive,firstFive.map(()=>'unknown')).length,5);
 assert.equal(failedCriteria(firstFive,firstFive.map(s=>s.target)).length,0);
});
test('yeni sonuçlarda doğru sayısı uygulanan adım sayısını aşamaz',()=>{
 const r={id:'new',finishedAt:new Date().toISOString(),correct:22,total:30,mode:'exam',blueErrors:4};
 assert.deepEqual(parseCarResults(JSON.stringify({version:2,results:[r]})),[r]);
 assert.throws(()=>parseCarResults(JSON.stringify({version:2,results:[{...r,total:20}]})));
});
