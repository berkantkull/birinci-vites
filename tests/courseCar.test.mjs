import test from 'node:test';
import assert from 'node:assert/strict';
import { courseCarQuestions, emptyCourseCar, isHotspotCorrect, parseCourseCar, setCourseCarHotspot, upsertCourseCarPhoto } from '../src/courseCarModel.ts';
import { createCommissionRound } from '../src/carLesson.ts';

test('Kurs Arabam fotoğraf ve işaretleri kayıt biçiminde korunur', () => {
  let profile = emptyCourseCar('Beyaz Clio');
  profile = upsertCourseCarPhoto(profile, 'Kaput', 'data:image/jpeg;base64,test');
  profile = setCourseCarHotspot(profile, 'Kaput', 'Akü', 0.25, 0.4);
  const parsed = parseCourseCar(JSON.stringify(profile));
  assert.equal(parsed?.name, 'Beyaz Clio');
  assert.ok(parsed);
  assert.equal(courseCarQuestions(parsed).length, 1);
  assert.equal(courseCarQuestions(parsed)[0].hotspot.label, 'Akü');
});

test('fotoğraf dokunuşu hedefe yakınsa doğru kabul edilir', () => {
  const target = { id: 'battery', label: 'Akü', x: 0.5, y: 0.5 };
  assert.equal(isHotspotCorrect(target, 0.57, 0.55), true);
  assert.equal(isHotspotCorrect(target, 0.8, 0.8), false);
});

test('komisyon turu rastgele sırada on farklı değerlendirme başlığı getirir', () => {
  const values = [0.12, 0.72, 0.33, 0.91, 0.2, 0.63, 0.44, 0.81];
  let index = 0;
  const round = createCommissionRound(10, () => values[index++ % values.length]);
  assert.equal(round.length, 10);
  assert.equal(new Set(round.map(step => step.criterion)).size, 10);
  assert.ok(round.every(step => step.criterion !== undefined));
});
