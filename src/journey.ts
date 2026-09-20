// Yolun merkez çizgisini örnekleyerek virajda da sabit mesafe adımları kullanırız.
export const roadPath = 'M-15 85H103C145 85 123 39 166 39H325';
const points = [{ x: 35, y: 85 }, { x: 103, y: 85 }];
for (let i = 1; i <= 80; i++) {
  const t = i / 80, u = 1 - t;
  points.push({ x: u ** 3 * 103 + 3 * u * u * t * 145 + 3 * u * t * t * 123 + t ** 3 * 166,
    y: u ** 3 * 85 + 3 * u * u * t * 85 + 3 * u * t * t * 39 + t ** 3 * 39 });
}
points.push({ x: 270, y: 39 });
const distances = [0];
for (let i = 1; i < points.length; i++) distances.push(distances[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
export function journeyPose(progress: number) {
  const target = Math.max(0, Math.min(1, progress)) * distances[distances.length - 1];
  let i = 1;
  while (i < distances.length - 1 && distances[i] < target) i++;
  const a = points[i - 1], b = points[i];
  const t = (target - distances[i - 1]) / (distances[i] - distances[i - 1]);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, angle: Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI };
}
