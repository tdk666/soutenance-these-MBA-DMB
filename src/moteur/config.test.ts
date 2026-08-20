import { describe, expect, it } from 'vitest';
import { deckConfig } from '../../content/deck.config';
import { tcToMs } from './timecode';
import type { ScreenId, SilenceId } from '../types';

describe('invariants du deck.config', () => {
  it('25 écrans, ordonnés E01 → E25', () => {
    expect(deckConfig.screens.length).toBe(25);
    deckConfig.screens.forEach((s, i) => {
      expect(s.id).toBe(`E${String(i + 1).padStart(2, '0')}`);
    });
  });

  it('les timecodes d’entrée sont valides et croissants', () => {
    let precedent = -1;
    for (const s of deckConfig.screens) {
      const ms = tcToMs(s.entreeCible);
      expect(ms).toBeGreaterThanOrEqual(precedent);
      precedent = ms;
    }
  });

  it('chaque chaîne a un délai, chaque step une justification et un repère', () => {
    for (const s of deckConfig.screens) {
      for (const step of s.steps) {
        expect(step.pourquoi.length, step.id).toBeGreaterThan(0);
        expect(step.repereParole.length, step.id).toBeGreaterThan(0);
        if (step.mode === 'chaine') {
          expect(step.delaiMs, step.id).toBeGreaterThan(0);
        }
      }
    }
  });

  it('les 7 silences sont assignés exactement une fois', () => {
    const vus = new Map<SilenceId, number>();
    for (const s of deckConfig.screens) {
      for (const sil of s.notes.silences) vus.set(sil, (vus.get(sil) ?? 0) + 1);
    }
    for (const id of ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'] as const) {
      expect(vus.get(id), id).toBe(1);
    }
  });

  it('les checkpoints pointent vers des écrans existants', () => {
    const ids = new Set<ScreenId>(deckConfig.screens.map((s) => s.id));
    for (const cp of deckConfig.checkpoints) {
      if (cp.sortieDe !== null) expect(ids.has(cp.sortieDe), cp.id).toBe(true);
    }
  });

  it('les notes couvrent tout le script (aucun écran sans texte)', () => {
    for (const s of deckConfig.screens) {
      expect(s.notes.script.trim().length, s.id).toBeGreaterThan(20);
    }
  });

  it('doctrine : 3 coupes, 3 réserves, gains et coûts du script', () => {
    expect(deckConfig.coupes.map((c) => c.id).sort()).toEqual(['C3', 'C5', 'C6']);
    expect(deckConfig.reserves.map((r) => r.id).sort()).toEqual(['R1', 'R2', 'R3']);
    expect(deckConfig.coupes.reduce((a, c) => a + c.gainS, 0)).toBe(105);
    expect(deckConfig.reserves.reduce((a, r) => a + r.coutS, 0)).toBe(75);
  });
});
