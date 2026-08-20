import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DeckConfig, ObjetEtat, Screen, ScreenId } from '../types';
import { buildSequence, objetEtatAt, stateAt, beatEntree, type Beat } from './sequence';

export interface Regie {
  seq: Beat[];
  beatIndex: number;
  /** chaînes du beat courant déjà égrenées (pour la synchronisation) */
  chainsDone: number;
  screen: Screen;
  screenIndex: number;
  /** ids des steps accomplis pour l’écran courant */
  faits: Set<string>;
  objetEtat: ObjetEtat;
  /** true si l’écran a été atteint en avançant (les animations d’entrée se jouent) */
  live: boolean;
  /** le prochain beat, pour le mode présentateur */
  prochain: Beat | null;
  /** chaînes du beat courant encore en attente */
  chainesEnAttente: number;
  avancer: () => void;
  reculer: () => void;
  allerAEcran: (screenIndex: number) => void;
  /** suivi externe (synchronisation entre onglets) */
  allerAuBeat: (beatIndex: number, chainsDone: number) => void;
}

interface Pos {
  beat: number;
  chainsDone: number;
  live: boolean;
}

/**
 * La régie : curseur de beats + égrenage des chaînes.
 * Avancer pendant qu’une chaîne s’égrène la termine d’un coup au lieu de
 * changer de beat (« la flèche droite avance une chaîne sans casser l’état »).
 */
export function useRegie(
  config: DeckConfig,
  onSortieEcran?: (id: ScreenId) => void,
): Regie {
  const seq = useMemo(() => buildSequence(config), [config]);
  const [pos, setPos] = useState<Pos>({ beat: 0, chainsDone: 0, live: false });
  const sortieRef = useRef(onSortieEcran);
  sortieRef.current = onSortieEcran;

  // égrenage des chaînes du beat courant
  useEffect(() => {
    const b = seq[pos.beat];
    if (!pos.live || pos.chainsDone >= b.chains.length) return;
    const prochaine = b.chains[pos.chainsDone];
    const t = setTimeout(() => {
      setPos((p) =>
        p.beat === b.index && p.chainsDone < b.chains.length
          ? { ...p, chainsDone: p.chainsDone + 1 }
          : p,
      );
    }, prochaine.delaiMs ?? 400);
    return () => clearTimeout(t);
  }, [seq, pos.beat, pos.chainsDone, pos.live]);

  const avancer = useCallback(() => {
    setPos((p) => {
      const b = seq[p.beat];
      if (p.chainsDone < b.chains.length) {
        return { ...p, chainsDone: b.chains.length };
      }
      if (p.beat >= seq.length - 1) return p;
      const suivant = seq[p.beat + 1];
      if (suivant.screenIndex !== b.screenIndex) {
        sortieRef.current?.(config.screens[b.screenIndex].id);
      }
      return { beat: p.beat + 1, chainsDone: 0, live: true };
    });
  }, [seq, config]);

  const reculer = useCallback(() => {
    setPos((p) => {
      if (p.beat === 0) return p;
      const precedent = seq[p.beat - 1];
      return { beat: p.beat - 1, chainsDone: precedent.chains.length, live: false };
    });
  }, [seq]);

  const allerAEcran = useCallback(
    (screenIndex: number) => {
      const cible = Math.max(0, Math.min(config.screens.length - 1, screenIndex));
      const beat = beatEntree(seq, cible);
      setPos({ beat, chainsDone: seq[beat].chains.length, live: false });
    },
    [seq, config],
  );

  /** suivi externe (synchronisation entre onglets) : se cale sur un beat précis */
  const allerAuBeat = useCallback(
    (beatIndex: number, chainsDone: number) => {
      const beat = Math.max(0, Math.min(seq.length - 1, beatIndex));
      setPos((p) =>
        p.beat === beat && p.chainsDone === chainsDone
          ? p
          : { beat, chainsDone: Math.min(chainsDone, seq[beat].chains.length), live: false },
      );
    },
    [seq],
  );

  const { screenIndex, faits } = stateAt(seq, pos.beat, pos.chainsDone);
  const objetEtat = objetEtatAt(config, seq, pos.beat, pos.chainsDone);
  const beat = seq[pos.beat];

  return {
    seq,
    beatIndex: pos.beat,
    chainsDone: pos.chainsDone,
    screen: config.screens[screenIndex],
    screenIndex,
    faits,
    objetEtat,
    live: pos.live,
    prochain: pos.beat + 1 < seq.length ? seq[pos.beat + 1] : null,
    chainesEnAttente: beat.chains.length - pos.chainsDone,
    avancer,
    reculer,
    allerAEcran,
    allerAuBeat,
  };
}
