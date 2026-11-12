export const SIGN_PROGRESS_KEY = 'birinci-vites.signs.v1';
export type SignQuizResult = { id: string; finishedAt: string; score: number; total: number };

export function parseSignResults(raw: string | null): SignQuizResult[] {
  if (!raw) return [];
  const value = JSON.parse(raw);
  if (!value || value.version !== 1 || !Array.isArray(value.results)) throw new Error('Geçersiz trafik işareti kaydı');
  if (value.results.some((result: SignQuizResult) => !result || typeof result.id !== 'string' ||
    !Number.isFinite(Date.parse(result.finishedAt)) || !Number.isInteger(result.score) ||
    !Number.isInteger(result.total) || result.total < 1 || result.score < 0 || result.score > result.total)) {
    throw new Error('Geçersiz trafik işareti kaydı');
  }
  return value.results;
}

export function signResultPayload(results: SignQuizResult[]) {
  return JSON.stringify({ version: 1, results: results.slice(0, 100) });
}
