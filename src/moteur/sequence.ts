import type { DeckConfig, ObjetEtat, Step } from '../types';

/**
 * La séquence de régie : la liste ordonnée des beats (déclenchements manuels).
 * Le beat 0 est l'état initial (E01, noir). Chaque écran suivant apporte un
 * beat d'entrée, puis un beat par step manuel. Les steps 'chaine' sont
 * accrochés au beat qui les précède et se jouent seuls, avec leur délai.
 */
export interface Beat {
  index: number;
  screenIndex: number;
  kind: 'initial' | 'entree' | 'step';
  step: Step | null;
  chains: Step[];
  /** libellé court pour le mode présentateur (« prochain geste ») */
  libelle: string;
}

export function buildSequence(config: DeckConfig): Beat[] {
  const beats: Beat[] = [];
  config.screens.forEach((screen, screenIndex) => {
    beats.push({
      index: beats.length,
      screenIndex,
      kind: screenIndex === 0 ? 'initial' : 'entree',
      step: null,
      chains: [],
      libelle: `Écran ${screen.id} · ${screen.titreInterne}`,
    });
    let porteur = beats[beats.length - 1];
    for (const step of screen.steps) {
      if (step.mode === 'chaine') {
        porteur.chains.push(step);
      } else {
        beats.push({
          index: beats.length,
          screenIndex,
          kind: 'step',
          step,
          chains: [],
          libelle: step.repereParole,
        });
        porteur = beats[beats.length - 1];
      }
    }
  });
  return beats;
}

/** Nombre de déclenchements manuels (le beat initial n'en est pas un). */
export function nbBeatsManuels(seq: Beat[]): number {
  return seq.length - 1;
}

/** Premier beat (entrée) d'un écran donné. */
export function beatEntree(seq: Beat[], screenIndex: number): number {
  const b = seq.find((x) => x.screenIndex === screenIndex);
  if (!b) throw new Error(`Écran hors séquence : ${screenIndex}`);
  return b.index;
}

/**
 * État dérivé, pur et rejouable : quels steps de l'écran courant sont faits
 * à (beatIndex, chainsDone). Les chaînes des beats passés sont faites; celles
 * du beat courant sont limitées à chainsDone (le direct les égrène).
 */
export function stateAt(
  seq: Beat[],
  beatIndex: number,
  chainsDone: number,
): { screenIndex: number; faits: Set<string> } {
  const courant = seq[beatIndex];
  const faits = new Set<string>();
  for (let i = 0; i <= beatIndex; i++) {
    const b = seq[i];
    if (b.screenIndex !== courant.screenIndex) continue;
    if (b.step) faits.add(b.step.id);
    const limite = i === beatIndex ? chainsDone : b.chains.length;
    for (const c of b.chains.slice(0, limite)) faits.add(c.id);
  }
  return { screenIndex: courant.screenIndex, faits };
}

/**
 * État de l'objet graphique : l'état d'arrivée de l'écran courant, modifié
 * par les actions 'objet' déjà accomplies (dans l'ordre des steps).
 */
export function objetEtatAt(
  config: DeckConfig,
  seq: Beat[],
  beatIndex: number,
  chainsDone: number,
): ObjetEtat {
  const { screenIndex, faits } = stateAt(seq, beatIndex, chainsDone);
  const screen = config.screens[screenIndex];
  let etat = screen.objet;
  for (const step of screen.steps) {
    if (step.action.type === 'objet' && faits.has(step.id)) {
      etat = step.action.versEtat;
    }
  }
  return etat;
}

/** État final d'un écran (tous steps faits) : pour les aperçus et la grille. */
export function etatFinalEcran(config: DeckConfig, screenIndex: number): {
  faits: Set<string>;
  objet: ObjetEtat;
} {
  const screen = config.screens[screenIndex];
  const faits = new Set(screen.steps.map((s) => s.id));
  let objet = screen.objet;
  for (const step of screen.steps) {
    if (step.action.type === 'objet') objet = step.action.versEtat;
  }
  return { faits, objet };
}
