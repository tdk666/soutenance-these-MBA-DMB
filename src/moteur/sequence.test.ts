import { describe, expect, it } from 'vitest';
import { deckConfig } from '../../content/deck.config';
import {
  buildSequence,
  beatEntree,
  nbBeatsManuels,
  objetEtatAt,
  stateAt,
} from './sequence';

const seq = buildSequence(deckConfig);

describe('séquence de régie', () => {
  it('respecte le budget de régie : 41 beats manuels', () => {
    // 24 entrées d’écran (la première ne se déclenche pas) + 17 révélations
    // ancrées sur un mot : ligne de crête comprise (elle remplace le détail
    // de l’année 2 à l’écran, elle ne peut donc pas partir en chaîne), et
    // plan complet de la frise compris (exigence d’audit du 21 août).
    expect(nbBeatsManuels(seq)).toBe(41);
  });

  it('le baptême « déflation latente » est un beat de la figure d’enquête', () => {
    const iE13 = deckConfig.screens.findIndex((s) => s.id === 'E13');
    const beatsE13 = seq.filter((b) => b.screenIndex === iE13);
    expect(beatsE13.length).toBe(2); // entrée + baptême
    expect(beatsE13[1].step?.id).toBe('E13.bapteme-deflation');
  });

  it('commence sur E01 et finit sur E21', () => {
    expect(seq[0].kind).toBe('initial');
    expect(seq[0].screenIndex).toBe(0);
    expect(seq[seq.length - 1].screenIndex).toBe(deckConfig.screens.length - 1);
  });

  it('la progression des écrans est monotone', () => {
    for (let i = 1; i < seq.length; i++) {
      expect(seq[i].screenIndex).toBeGreaterThanOrEqual(seq[i - 1].screenIndex);
      expect(seq[i].screenIndex - seq[i - 1].screenIndex).toBeLessThanOrEqual(1);
    }
  });

  it('chaque écran a exactement un beat d’entrée', () => {
    const entrees = seq.filter((b) => b.kind === 'entree' || b.kind === 'initial');
    expect(entrees.length).toBe(deckConfig.screens.length);
  });

  it('l’état à un beat est rejouable et complet en arrivée arrière', () => {
    const iE09 = deckConfig.screens.findIndex((s) => s.id === 'E11');
    const entree = beatEntree(seq, iE09);
    // dernier beat de E09 : tous les steps faits, chaînes comprises
    const dernierE09 = seq.filter((b) => b.screenIndex === iE09).at(-1)!;
    const etat = stateAt(seq, dernierE09.index, dernierE09.chains.length);
    const stepsE09 = deckConfig.screens[iE09].steps.map((s) => s.id);
    for (const id of stepsE09) expect(etat.faits.has(id)).toBe(true);
    // à l’entrée, rien n’est fait
    const debut = stateAt(seq, entree, 0);
    expect(debut.faits.size).toBe(0);
  });

  it('l’amputation ÷2 fait passer la barre de 0 à 5 jours fantômes', () => {
    const iE09 = deckConfig.screens.findIndex((s) => s.id === 'E11');
    const beatsE09 = seq.filter((b) => b.screenIndex === iE09);
    const entree = beatsE09[0].index;
    const avant = objetEtatAt(deckConfig, seq, entree, 0);
    expect(avant).toEqual({ kind: 'barre', joursFantomes: 0, position: 'centre' });
    const dernier = beatsE09.at(-1)!;
    const apres = objetEtatAt(deckConfig, seq, dernier.index, dernier.chains.length);
    expect(apres).toEqual({ kind: 'barre', joursFantomes: 5, position: 'centre' });
  });

  it('la frise s’allume segment par segment jusqu’à 4', () => {
    const iE19 = deckConfig.screens.findIndex((s) => s.id === 'E21');
    const beatsE19 = seq.filter((b) => b.screenIndex === iE19);
    expect(beatsE19.length).toBe(7); // entrée + 4 segments + ligne de crête + plan complet
    const dernier = beatsE19.at(-1)!;
    const etat = objetEtatAt(deckConfig, seq, dernier.index, dernier.chains.length);
    expect(etat).toEqual({ kind: 'frise', allumes: 4 });
  });
});
