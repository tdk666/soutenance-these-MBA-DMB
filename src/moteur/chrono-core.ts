import type { Checkpoint, Decision, DeckConfig, ScreenId } from '../types';
import { tcToMs } from './timecode';

/**
 * Doctrine : à chaque checkpoint on constate l'écart (positif = retard) et on
 * lit la décision. Parmi les décisions satisfaites, on retient celle au seuil
 * le plus exigeant (retard de 95 s au CP3 → « C3 + C6 + C5 », pas « C3 + C6 »).
 */
export function evaluerDecision(decisions: Decision[], ecartMs: number): string | null {
  let retenue: { seuilMs: number; instruction: string } | null = null;
  for (const d of decisions) {
    const seuilMs = d.condition.seuilS * 1000;
    const satisfaite =
      d.condition.type === 'retard' ? ecartMs >= seuilMs : ecartMs <= -seuilMs;
    if (satisfaite && (retenue === null || seuilMs > retenue.seuilMs)) {
      retenue = { seuilMs, instruction: d.instruction };
    }
  }
  return retenue ? retenue.instruction : null;
}

export interface CaptureCheckpoint {
  checkpoint: Checkpoint;
  ecartMs: number;
  /** null = dans les clous, aucune décision à prendre */
  instruction: string | null;
}

export function capturerCheckpoint(
  config: DeckConfig,
  sortieDe: ScreenId,
  elapsedMs: number,
): CaptureCheckpoint | null {
  const cp = config.checkpoints.find((c) => c.sortieDe === sortieDe);
  if (!cp) return null;
  const ecartMs = elapsedMs - tcToMs(cp.cible);
  return { checkpoint: cp, ecartMs, instruction: evaluerDecision(cp.decisions, ecartMs) };
}
