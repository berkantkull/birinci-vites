import type { Attempt, Topic } from './domain';
import type { CourseCarProfile } from './courseCarModel';
import type { CarResult } from './carLesson';
import type { DrivingLesson, DrivingSkill } from './drivingLessons';
import type { SignQuizResult } from './signProgress';

export type ReadinessStatus = 'ready' | 'continue' | 'missing';
export type ReadinessItem = { id: 'theory' | 'commission' | 'course-car' | 'signs' | 'lessons'; label: string; status: ReadinessStatus; detail: string };

export function buildReadiness(
  history: Attempt[],
  carResults: CarResult[],
  courseCar: CourseCarProfile | null,
  signResults: SignQuizResult[],
  lessons: DrivingLesson[],
): ReadinessItem[] {
  const exams = history.filter(item => item.mode === 'exam').slice(0, 3);
  const weak = weakestTopic(history);
  const theory: ReadinessItem = exams.length === 0
    ? { id: 'theory', label: 'Teorik sınav', status: 'missing', detail: 'Henüz 50 soruluk bir prova tamamlanmadı.' }
    : {
      id: 'theory', label: 'Teorik sınav', status: exams.length >= 3 && exams.every(item => item.score >= 70) ? 'ready' : 'continue',
      detail: `Son ${exams.length} prova: ${exams.map(item => item.score).join(', ')} puan${weak ? ` · Tekrar: ${weak.topic}` : ''}`,
    };

  const commissionResult = carResults.find(item => item.mode === 'exam');
  const commission: ReadinessItem = !commissionResult
    ? { id: 'commission', label: 'Komisyon Provası', status: 'missing', detail: 'Henüz tamamlanmış bir komisyon turu yok.' }
    : { id: 'commission', label: 'Komisyon Provası', status: (commissionResult.blueErrors ?? 5) < 5 && (commissionResult.total ?? 0) >= 10 ? 'ready' : 'continue', detail: `Son tur: ${commissionResult.blueErrors ?? 0} mavi hata · ${commissionResult.correct}/${commissionResult.total ?? 0} doğru` };

  const markerTarget = 19;
  const photoCount = courseCar?.photos.length ?? 0;
  const markerCount = courseCar?.photos.reduce((total, photo) => total + photo.hotspots.length, 0) ?? 0;
  const course: ReadinessItem = !courseCar
    ? { id: 'course-car', label: 'Kurs Arabam', status: 'missing', detail: 'Kurs aracı henüz tanıtılmadı.' }
    : { id: 'course-car', label: 'Kurs Arabam', status: photoCount === 3 && markerCount === markerTarget ? 'ready' : 'continue', detail: `${photoCount}/3 fotoğraf · ${markerCount}/${markerTarget} işaretli parça` };

  const sign = signResults[0];
  const signs: ReadinessItem = !sign
    ? { id: 'signs', label: 'Trafik işaretleri', status: 'missing', detail: 'Henüz hızlı işaret testi tamamlanmadı.' }
    : { id: 'signs', label: 'Trafik işaretleri', status: sign.score === sign.total ? 'ready' : 'continue', detail: `Son hızlı test: ${sign.score}/${sign.total}` };

  const latestLesson = lessons[0];
  const focus = recentLessonFocus(lessons);
  const lesson: ReadinessItem = !latestLesson
    ? { id: 'lessons', label: 'Direksiyon dersleri', status: 'missing', detail: 'Henüz bir ders sonu kaydı yok.' }
    : { id: 'lessons', label: 'Direksiyon dersleri', status: latestLesson.confidence >= 4 && latestLesson.repeat.length === 0 ? 'ready' : 'continue', detail: focus.length ? `Sonraki derste tekrar: ${focus.map(item => item.skill).join(', ')}` : `Son ders güveni: ${latestLesson.confidence}/5 · Tekrar notu yok` };

  return [theory, commission, course, signs, lesson];
}

function weakestTopic(history: Attempt[]) {
  const byTopic = new Map<Topic, { correct: number; total: number; ids: Set<string> }>();
  history.flatMap(item => item.answers).forEach(answer => {
    const value = byTopic.get(answer.topic) ?? { correct: 0, total: 0, ids: new Set<string>() };
    value.correct += answer.correct ? 1 : 0; value.total += 1; value.ids.add(answer.questionId); byTopic.set(answer.topic, value);
  });
  return [...byTopic.entries()].filter(([,value]) => value.ids.size >= 10)
    .map(([topic,value]) => ({ topic, accuracy: value.correct / value.total }))
    .sort((a,b) => a.accuracy - b.accuracy)[0];
}

function recentLessonFocus(lessons: DrivingLesson[]) {
  const counts = new Map<DrivingSkill, number>();
  lessons.slice(0,5).forEach(lesson => lesson.repeat.forEach(skill => counts.set(skill,(counts.get(skill)??0)+1)));
  return [...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,3).map(([skill,count])=>({skill,count}));
}
