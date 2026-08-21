import { describe, expect, it } from 'vitest';
import { deckConfig } from '../../content/deck.config';
import { capturerCheckpoint, evaluerDecision } from './chrono-core';
import { tcToMs } from './timecode';

function cp(id: string) {
  const c = deckConfig.checkpoints.find((x) => x.id === id);
  if (!c) throw new Error(`checkpoint absent : ${id}`);
  return c;
}

describe('chrono à checkpoints (doctrine du script)', () => {
  it('CP0 : avance ≥ 45 s ouvre R2, sinon rien', () => {
    expect(evaluerDecision(cp('CP0').decisions, -50_000)).toMatch(/R2/);
    expect(evaluerDecision(cp('CP0').decisions, -30_000)).toBeNull();
    expect(evaluerDecision(cp('CP0').decisions, 60_000)).toBeNull();
  });

  it('CP1 : avance +50 s → ouvrir R1 · retard −60 s → armer C3', () => {
    // convention : écart positif = retard; « avance +50 s » du cahier des charges = écart −50 s
    expect(evaluerDecision(cp('CP1').decisions, -50_000)).toMatch(/R1/);
    expect(evaluerDecision(cp('CP1').decisions, 60_000)).toMatch(/C3/);
    expect(evaluerDecision(cp('CP1').decisions, 20_000)).toBeNull();
  });

  it('CP3 : le seuil le plus exigeant gagne', () => {
    const d = cp('CP3').decisions;
    expect(evaluerDecision(d, 50_000)).toMatch(/C3 \+ C6(?!.*C5)/);
    expect(evaluerDecision(d, 95_000)).toMatch(/C5/);
    expect(evaluerDecision(d, -35_000)).toMatch(/R3/);
  });

  it('capture à la sortie du bon écran, avec le bon écart', () => {
    // cible CP1 v3 : 13:24; sortie constatée à 14:14 → retard de 50 s
    const capture = capturerCheckpoint(deckConfig, 'E14', tcToMs('14:14'));
    expect(capture).not.toBeNull();
    expect(capture!.checkpoint.id).toBe('CP1');
    expect(capture!.ecartMs).toBe(50_000);
    expect(capture!.instruction).toMatch(/C3/);
    expect(capturerCheckpoint(deckConfig, 'E10', 100_000)).toBeNull();
  });

  it('les six cibles v3 sont dans le config', () => {
    const cibles = deckConfig.checkpoints.map((c) => c.cible);
    expect(cibles).toEqual(['8:28', '13:24', '16:26', '23:08', '27:23', '30:08']);
  });
});
