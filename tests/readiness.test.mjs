import test from 'node:test';
import assert from 'node:assert/strict';
import { courseCarFromShare, courseCarQuestions, emptyCourseCar, encodeCourseCarShare, parseCourseCarShare, setCourseCarHotspot, upsertCourseCarPhoto } from '../src/courseCarModel.ts';
import { buildReadiness } from '../src/readiness.ts';
import { lessonFocus, lessonPayload, parseDrivingLessons } from '../src/drivingLessons.ts';
import { parseSignResults, signResultPayload } from '../src/signProgress.ts';

const now = '2026-11-13T10:00:00.000Z';
const lesson = (id, repeat, confidence = 3) => ({ id, finishedAt: now, practiced: ['L park'], repeat, confidence, note: '' });

test('direksiyon dersleri doğrulanır ve sık tekrar edilen konu öne çıkar', () => {
  const lessons = [lesson('3',['L park']),lesson('2',['Ayna ve kör nokta']),lesson('1',['L park'])];
  assert.deepEqual(parseDrivingLessons(lessonPayload(lessons)), lessons);
  assert.deepEqual(lessonFocus(lessons)[0], { skill: 'L park', count: 2 });
  assert.throws(() => parseDrivingLessons(JSON.stringify({version:1,lessons:[{...lessons[0],confidence:7}]})));
});

test('Kurs Arabam QR kodu fotoğraf taşımadan işaretleri aktarır', () => {
  let profile = emptyCourseCar('Kırmızı Clio');
  profile = upsertCourseCarPhoto(profile, 'Kaput', 'data:image/jpeg;base64,SECRET');
  profile = setCourseCarHotspot(profile, 'Kaput', 'Akü', 0.12345, 0.67891);
  const code = encodeCourseCarShare(profile);
  assert.equal(code.includes('SECRET'), false);
  const shared = parseCourseCarShare(code);
  const imported = courseCarFromShare(shared);
  assert.equal(imported.photos.length, 0);
  const withPhoto = upsertCourseCarPhoto(imported, 'Kaput', 'data:image/jpeg;base64,LOCAL');
  assert.equal(courseCarQuestions(withPhoto)[0].hotspot.label, 'Akü');
  assert.equal(courseCarQuestions(withPhoto)[0].hotspot.x, 0.123);
});

test('Hazırlık Kartı beş ayrı çalışma alanını bağımsız değerlendirir', () => {
  const answers = Array.from({length:50},(_,i)=>({questionId:`q${i}`,topic:'Trafik ve çevre',selected:0,correct:i<40,firstSeen:true}));
  const exams = [1,2,3].map(id=>({id:String(id),finishedAt:now,mode:'exam',answers,durationSeconds:100,score:80}));
  const car = [{id:'c',finishedAt:now,correct:8,total:10,mode:'exam',section:'Komisyon provası',blueErrors:2}];
  const signs = [{id:'s',finishedAt:now,score:5,total:5}];
  const items = buildReadiness(exams,car,null,signs,[lesson('l',[],5)]);
  assert.equal(items.length,5);
  assert.equal(items.find(item=>item.id==='theory').status,'ready');
  assert.equal(items.find(item=>item.id==='commission').status,'ready');
  assert.equal(items.find(item=>item.id==='course-car').status,'missing');
  assert.equal(items.find(item=>item.id==='signs').status,'ready');
  assert.equal(items.find(item=>item.id==='lessons').status,'ready');
});

test('trafik işareti sonuç kaydı hatalı puanı reddeder', () => {
  const results=[{id:'s1',finishedAt:now,score:4,total:5}];
  assert.deepEqual(parseSignResults(signResultPayload(results)),results);
  assert.throws(()=>parseSignResults(JSON.stringify({version:1,results:[{...results[0],score:6}]})));
});
