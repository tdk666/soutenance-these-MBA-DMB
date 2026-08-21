import type { SimulateurParams } from '../types';

/**
 * Le modèle économique du simulateur (bloc 6).
 *
 * Il reproduit l’arithmétique du directeur financier (scène Kajman, thèse,
 * script v3) : quand le gain de productivité IA atteint 50 %,
 *   - l’agence tente une hausse du prix de journée d’environ +15 %
 *     (1 500 € vers 1 700-1 800 €),
 *   - le client impose la division du nombre de jours par deux,
 *   - le revenu de la mission fond de l’ordre de 40 %.
 * Les tests de calibration (modele.test.ts) vérifient ces ordres de grandeur :
 * si le modèle ne les reproduit pas, il ment.
 *
 * Structure de coûts (hypothèses de démonstration, affichables d’un clic) :
 *   - le coût d’une journée travaillée (salaires chargés) fond avec les jours,
 *   - les frais fixes alloués à la mission ne fondent PAS (c’est le cœur du
 *     problème : les coûts de l’agence ne baissent pas aussi vite que ses jours),
 *   - le coût des outils IA croît avec le gain (l’agence paie pour produire
 *     plus vite ce qu’elle facture moins).
 *
 * Le prix étagé (geste 3) réévalue la même mission par nature de travail :
 * le total attendu est INFÉRIEUR au contrat sain (le client capte une partie
 * du gain, clause Pierin : des gains cherchés ensemble), et la marge de
 * l’agence tient quand même, parce qu’elle ne vend plus les heures que l’IA
 * a supprimées. La ligne à l’effet joue dans un couloir 90/110 : même au
 * plancher, la mission n’est jamais déficitaire.
 */

export interface EtatTjm {
  gainPct: number;
  joursFactures: number;
  tjmEUR: number;
  revenuEUR: number;
  coutsEUR: number;
  margeEUR: number;
  margePct: number;
}

/** La valeur créée pour le client : ancrée sur le contrat sain, elle ne bouge jamais. */
export function valeurClientEUR(p: SimulateurParams): number {
  return p.contrat.jours * p.contrat.tjmEUR;
}

/** L’état du contrat au temps passé, pour un gain de productivité donné (0..gainMaxPct). */
export function etatTjm(p: SimulateurParams, gainPct: number): EtatTjm {
  const g = Math.max(0, Math.min(p.gainMaxPct, gainPct)) / p.gainMaxPct; // 0..1
  // le client contrôle les jours : ils fondent avec le gain (÷2 à gain max)
  const joursFactures = p.contrat.jours * (1 - (p.gainMaxPct / 100) * g);
  // l’agence ne contrôle que le prix : hausse tentée, +15 % à gain max
  const tjmEUR = p.contrat.tjmEUR * (1 + (p.hausseTjmMaxPct / 100) * g);
  const revenuEUR = joursFactures * tjmEUR;
  const coutsEUR =
    p.contrat.coutJourEUR * joursFactures +
    p.contrat.structureEUR +
    p.contrat.outilsPleinGainEUR * g;
  const margeEUR = revenuEUR - coutsEUR;
  return {
    gainPct,
    joursFactures,
    tjmEUR,
    revenuEUR,
    coutsEUR,
    margeEUR,
    margePct: (margeEUR / revenuEUR) * 100,
  };
}

export interface EtatEtage {
  lignes: { nom: string; metrique: string; montantEUR: number; nature: string }[];
  totalAttenduEUR: number;
  /** bornes du couloir sur la ligne à l’effet */
  totalBasEUR: number;
  totalHautEUR: number;
  coutsEUR: number;
  margeEUR: number;
  margePct: number;
  /** marge si la ligne à l’effet finit au plancher du couloir */
  margeBasseEUR: number;
}

/**
 * La même mission, redistribuée en quatre étages (geste 3). Les coûts sont
 * ceux de l’état TJM au même gain : rien ne change dans la production,
 * seule l’unité de compte change.
 */
export function etatEtage(p: SimulateurParams, gainPct: number): EtatEtage {
  const couts = etatTjm(p, gainPct).coutsEUR;
  const totalAttenduEUR = p.etage.lignes.reduce((a, l) => a + l.montantEUR, 0);
  const variable = p.etage.lignes.find((l) => l.nature === 'variable');
  const variableEUR = variable ? variable.montantEUR : 0;
  const totalBasEUR = totalAttenduEUR - variableEUR * (1 - p.etage.couloir.basPct / 100);
  const totalHautEUR = totalAttenduEUR + variableEUR * (p.etage.couloir.hautPct / 100 - 1);
  const margeEUR = totalAttenduEUR - couts;
  return {
    lignes: p.etage.lignes,
    totalAttenduEUR,
    totalBasEUR,
    totalHautEUR,
    coutsEUR: couts,
    margeEUR,
    margePct: (margeEUR / totalAttenduEUR) * 100,
    margeBasseEUR: totalBasEUR - couts,
  };
}

export function formatEUR(n: number): string {
  const arrondi = Math.round(n);
  return `${arrondi.toLocaleString('fr-FR').replace(/ | /g, ' ')} €`;
}

export function formatPct(n: number, decimales = 0): string {
  const v = n.toFixed(decimales).replace('.', ',').replace('-', '−');
  return `${v} %`;
}
