export const DRIVING_LESSONS_KEY = 'birinci-vites.driving-lessons.v1';

export const drivingSkills = [
  'Sürüş hazırlığı',
  'Kalkış ve duruş',
  'Ayna ve kör nokta',
  'Sinyal kullanımı',
  'Vites ve debriyaj',
  'Yokuşta kalkış',
  'L park',
  'Geri park',
  'Kavşaklar',
  'Yaya ve işaretler',
  'Dar alanda dönüş',
  'Hız ve şerit takibi',
] as const;

export type DrivingSkill = typeof drivingSkills[number];
export type DrivingLesson = {
  id: string;
  finishedAt: string;
  practiced: DrivingSkill[];
  repeat: DrivingSkill[];
  confidence: 1 | 2 | 3 | 4 | 5;
  note: string;
};

export function parseDrivingLessons(raw: string | null): DrivingLesson[] {
  if (!raw) return [];
  const value = JSON.parse(raw);
  if (!value || value.version !== 1 || !Array.isArray(value.lessons)) throw new Error('Geçersiz direksiyon dersi kaydı');
  for (const lesson of value.lessons) {
    if (!lesson || typeof lesson.id !== 'string' || !Number.isFinite(Date.parse(lesson.finishedAt)) ||
      !Array.isArray(lesson.practiced) || !Array.isArray(lesson.repeat) ||
      lesson.practiced.some((item: string) => !drivingSkills.includes(item as DrivingSkill)) ||
      lesson.repeat.some((item: string) => !drivingSkills.includes(item as DrivingSkill)) ||
      !Number.isInteger(lesson.confidence) || lesson.confidence < 1 || lesson.confidence > 5 ||
      typeof lesson.note !== 'string') throw new Error('Geçersiz direksiyon dersi kaydı');
  }
  return value.lessons;
}

export function lessonFocus(lessons: DrivingLesson[], limit = 3) {
  const recent = lessons.slice(0, 5);
  const counts = new Map<DrivingSkill, { count: number; recent: number }>();
  recent.forEach((lesson, lessonIndex) => lesson.repeat.forEach(skill => {
    const current = counts.get(skill) ?? { count: 0, recent: lessonIndex };
    counts.set(skill, { count: current.count + 1, recent: Math.min(current.recent, lessonIndex) });
  }));
  return [...counts.entries()]
    .sort((a, b) => b[1].count - a[1].count || a[1].recent - b[1].recent)
    .slice(0, limit)
    .map(([skill, value]) => ({ skill, count: value.count }));
}

export function lessonPayload(lessons: DrivingLesson[]) {
  return JSON.stringify({ version: 1, lessons: lessons.slice(0, 100) });
}
