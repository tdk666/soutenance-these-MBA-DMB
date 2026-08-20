import { describe, expect, it } from 'vitest';
import { deckConfig } from '../../content/deck.config';
import { etatEtage, etatTjm, valeurClientEUR } from './modele';

const p = deckConfig.simulateur;
if (!p) throw new Error('simulateur absent du config');

describe('calibration du simulateur (arithmétique Kajman, script v3)', () => {
  it('à 50 % de gain : ≈ +15 % sur le prix, ÷2 sur les jours', () => {
    const e = etatTjm(p, 50);
    expect(e.tjmEUR / p.contrat.tjmEUR).toBeCloseTo(1.15, 2);
    // 1 500 € tenté « vers mille sept cents ou mille huit cents »
    expect(e.tjmEUR).toBeGreaterThanOrEqual(1700);
    expect(e.tjmEUR).toBeLessThanOrEqual(1800);
    expect(e.joursFactures).toBeCloseTo(p.contrat.jours / 2, 5);
  });

  it('à 50 % de gain : le revenu se contracte de l’ordre de 40 %', () => {
    const sain = etatTjm(p, 0);
    const choque = etatTjm(p, 50);
    const contractionPct = ((choque.revenuEUR - sain.revenuEUR) / sain.revenuEUR) * 100;
    expect(contractionPct).toBeGreaterThanOrEqual(p.calibration.contractionRevenu.minPct);
    expect(contractionPct).toBeLessThanOrEqual(p.calibration.contractionRevenu.maxPct);
  });

  it('le revenu fond continûment malgré la hausse du prix (le client contrôle les jours)', () => {
    let precedent = Infinity;
    for (const g of [0, 10, 20, 30, 40, 50]) {
      const r = etatTjm(p, g).revenuEUR;
      expect(r).toBeLessThan(precedent);
      precedent = r;
    }
  });

  it('la marge plonge pendant que la valeur client ne bouge pas', () => {
    const sain = etatTjm(p, 0);
    const choque = etatTjm(p, 50);
    expect(sain.margePct).toBeGreaterThanOrEqual(25);   // état sain, rentable
    expect(choque.margePct).toBeLessThan(12);           // état choqué
    expect(valeurClientEUR(p)).toBe(sain.revenuEUR);    // la valeur = le contrat sain
  });

  it('geste 3 : la marge tient, et le client ne paie pas plus qu’avant', () => {
    const sain = etatTjm(p, 0);
    const etage = etatEtage(p, 50);
    expect(etage.totalAttenduEUR).toBeLessThanOrEqual(valeurClientEUR(p));
    expect(etage.margePct).toBeGreaterThanOrEqual(sain.margePct);
    expect(etage.margeEUR).toBeGreaterThan(etatTjm(p, 50).margeEUR);
  });

  it('couloir 90/110 : même au plancher, la mission n’est jamais déficitaire', () => {
    const etage = etatEtage(p, 50);
    expect(etage.margeBasseEUR).toBeGreaterThan(0);
    expect(etage.totalBasEUR).toBeLessThan(etage.totalAttenduEUR);
    expect(etage.totalHautEUR).toBeGreaterThan(etage.totalAttenduEUR);
  });

  it('chaque hypothèse affichable est sourcée', () => {
    expect(p.hypotheses.length).toBeGreaterThanOrEqual(5);
    for (const h of p.hypotheses) {
      expect(h.source.length, h.cle).toBeGreaterThan(0);
    }
  });

  it('l’étiquette de la bascule est neutre (jamais « prix étagé » avant la parole)', () => {
    expect(p.etiquetteBascule.toLowerCase()).not.toContain('étagé');
    expect(p.etiquetteBascule.toLowerCase()).not.toContain('etage');
  });
});
