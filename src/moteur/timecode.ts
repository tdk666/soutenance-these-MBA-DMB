import type { Timecode } from '../types';

/** "8:04" ou "~8:50" → millisecondes. Lève une erreur sur format invalide. */
export function tcToMs(tc: Timecode): number {
  const m = /^~?(\d{1,2}):([0-5]\d)$/.exec(tc.trim());
  if (!m) throw new Error(`Timecode invalide : « ${tc} »`);
  return (parseInt(m[1], 10) * 60 + parseInt(m[2], 10)) * 1000;
}

/** millisecondes → "M:SS" (durées positives). */
export function msToTc(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * Écart de chrono. Convention : positif = retard, négatif = avance.
 * Affichage : « +1:05 » (retard) / « −0:42 » (avance, signe moins typographique).
 */
export function formatEcart(ecartMs: number): string {
  const signe = ecartMs >= 0 ? '+' : '−';
  return `${signe}${msToTc(Math.abs(ecartMs))}`;
}
