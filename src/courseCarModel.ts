export type CourseCarArea = 'Kaput' | 'Bagaj' | 'Kokpit';
export type CourseCarHotspot = { id: string; label: string; x: number; y: number };
export type CourseCarPhoto = { area: CourseCarArea; uri: string; hotspots: CourseCarHotspot[] };
export type CourseCarProfile = { version: 1; name: string; updatedAt: string; photos: CourseCarPhoto[] };

export const courseCarAreas: { area: CourseCarArea; description: string; labels: string[] }[] = [
  {
    area: 'Kaput',
    description: 'Motor bölmesini üstten ve parçalar net görünecek şekilde çek.',
    labels: ['Akü', 'Motor yağı kapağı', 'Yağ ölçüm çubuğu', 'Soğutma suyu deposu', 'Cam suyu deposu', 'Fren hidroliği deposu'],
  },
  {
    area: 'Bagaj',
    description: 'Bagaj tabanını ve sınavda gösterilecek ekipmanları görünür bırak.',
    labels: ['Stepne veya onarım kiti', 'Kriko', 'Bijon anahtarı', 'Reflektör', 'İlk yardım çantası'],
  },
  {
    area: 'Kokpit',
    description: 'Direksiyon, gösterge paneli ve orta konsol aynı karede görünsün.',
    labels: ['Dörtlü ikaz', 'Far ve sinyal kolu', 'Silecek kolu', 'Korna', 'İç dikiz aynası', 'Dış ayna ayarı', 'Park freni', 'Klima ve buğu çözme'],
  },
];

export function emptyCourseCar(name = 'Kurs aracım'): CourseCarProfile {
  return { version: 1, name, updatedAt: new Date(0).toISOString(), photos: [] };
}

export function parseCourseCar(raw: string | null): CourseCarProfile | null {
  if (!raw) return null;
  const value = JSON.parse(raw) as Partial<CourseCarProfile>;
  if (value.version !== 1 || typeof value.name !== 'string' || !Array.isArray(value.photos)) throw new Error('Geçersiz araç profili');
  const photos = value.photos.filter((photo): photo is CourseCarPhoto => {
    if (!photo || !courseCarAreas.some(item => item.area === photo.area) || typeof photo.uri !== 'string' || !Array.isArray(photo.hotspots)) return false;
    return photo.hotspots.every(hotspot => typeof hotspot?.id === 'string' && typeof hotspot.label === 'string' && Number.isFinite(hotspot.x) && Number.isFinite(hotspot.y));
  }).map(photo => ({
    ...photo,
    hotspots: photo.hotspots.map(hotspot => ({ ...hotspot, x: clamp(hotspot.x), y: clamp(hotspot.y) })),
  }));
  return { version: 1, name: value.name.trim() || 'Kurs aracım', updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : new Date(0).toISOString(), photos };
}

export function upsertCourseCarPhoto(profile: CourseCarProfile, area: CourseCarArea, uri: string) {
  const existing = profile.photos.find(photo => photo.area === area);
  const photo: CourseCarPhoto = { area, uri, hotspots: existing?.hotspots ?? [] };
  return { ...profile, photos: [...profile.photos.filter(item => item.area !== area), photo] };
}

export function setCourseCarHotspot(profile: CourseCarProfile, area: CourseCarArea, label: string, x: number, y: number) {
  const photo = profile.photos.find(item => item.area === area);
  if (!photo) return profile;
  const hotspot: CourseCarHotspot = { id: `${area}-${label}`, label, x: clamp(x), y: clamp(y) };
  return {
    ...profile,
    photos: profile.photos.map(item => item.area === area ? { ...item, hotspots: [...item.hotspots.filter(point => point.label !== label), hotspot] } : item),
  };
}

export function courseCarQuestions(profile: CourseCarProfile) {
  return profile.photos.flatMap(photo => photo.hotspots.map(hotspot => ({ area: photo.area, photoUri: photo.uri, hotspot })));
}

export function isHotspotCorrect(target: CourseCarHotspot, x: number, y: number, tolerance = 0.13) {
  return Math.hypot(target.x - x, target.y - y) <= tolerance;
}

export function shuffleCourseCarQuestions<T>(items: T[], random = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}
