import { useCallback, useEffect, useRef, useState } from 'react';
import type { Checkpoint, DeckConfig, ScreenId } from '../types';
import { capturerCheckpoint, type CaptureCheckpoint } from './chrono-core';

export interface Chrono {
  elapsedMs: number;
  enMarche: boolean;
  demarre: boolean;
  demarrerOuPause: () => void;
  reset: () => void;
  /** décale le chrono (répétitions, captures de vérification) */
  simuler: (ms: number) => void;
  /** suivi externe : synchronisation entre onglets */
  suivreExterne: (
    ms: number,
    marche: boolean,
    captures?: { id: string; ecartMs: number; instruction: string | null }[],
  ) => void;
  captures: CaptureCheckpoint[];
  derniereCapture: CaptureCheckpoint | null;
  prochainCheckpoint: Checkpoint | null;
  onSortieEcran: (id: ScreenId) => void;
}

/**
 * Le chrono à checkpoints. Il ne connaît pas l’heure idéale de chaque écran :
 * il constate l’écart aux seuls checkpoints du script, à la sortie de leurs
 * écrans, et lit la décision dans le config. On ne rattrape jamais en
 * accélérant : on coupe, ou on ouvre une réserve.
 */
export function useChrono(config: DeckConfig): Chrono {
  const [enMarche, setEnMarche] = useState(false);
  const [accumMs, setAccumMs] = useState(0);
  const [departAt, setDepartAt] = useState<number | null>(null);
  const [, forceTick] = useState(0);
  const [captures, setCaptures] = useState<CaptureCheckpoint[]>([]);

  useEffect(() => {
    if (!enMarche) return;
    const t = setInterval(() => forceTick((n) => n + 1), 200);
    return () => clearInterval(t);
  }, [enMarche]);

  const elapsedMs = accumMs + (enMarche && departAt !== null ? Date.now() - departAt : 0);
  const elapsedRef = useRef(elapsedMs);
  elapsedRef.current = elapsedMs;

  const demarrerOuPause = useCallback(() => {
    setEnMarche((marche) => {
      if (marche) {
        setAccumMs((a) => a + (departAt !== null ? Date.now() - departAt : 0));
        setDepartAt(null);
        return false;
      }
      setDepartAt(Date.now());
      return true;
    });
  }, [departAt]);

  const reset = useCallback(() => {
    setEnMarche(false);
    setAccumMs(0);
    setDepartAt(null);
    setCaptures([]);
  }, []);

  const simuler = useCallback((ms: number) => {
    setAccumMs(ms);
    setDepartAt((d) => (d !== null ? Date.now() : d));
  }, []);

  /** suivi externe (synchronisation entre onglets) : reflète le chrono du pilote */
  const suivreExterne = useCallback(
    (
      ms: number,
      marche: boolean,
      capturesExternes?: { id: string; ecartMs: number; instruction: string | null }[],
    ) => {
      setAccumMs(ms);
      setDepartAt(marche ? Date.now() : null);
      setEnMarche(marche);
      if (capturesExternes) {
        setCaptures(
          capturesExternes.flatMap((c) => {
            const checkpoint = config.checkpoints.find((x) => x.id === c.id);
            return checkpoint ? [{ checkpoint, ecartMs: c.ecartMs, instruction: c.instruction }] : [];
          }),
        );
      }
    },
    [config],
  );

  const onSortieEcran = useCallback(
    (id: ScreenId) => {
      // sans chrono démarré, pas de constat : on ne capture que le réel
      if (elapsedRef.current <= 0) return;
      const capture = capturerCheckpoint(config, id, elapsedRef.current);
      if (!capture) return;
      setCaptures((prev) => [
        ...prev.filter((c) => c.checkpoint.id !== capture.checkpoint.id),
        capture,
      ]);
    },
    [config],
  );

  const capturesIds = new Set(captures.map((c) => c.checkpoint.id));
  const prochainCheckpoint =
    config.checkpoints.find((c) => c.sortieDe !== null && !capturesIds.has(c.id)) ??
    config.checkpoints.find((c) => c.id === 'FIN') ??
    null;

  return {
    elapsedMs,
    enMarche,
    demarre: elapsedMs > 0 || enMarche,
    demarrerOuPause,
    reset,
    simuler,
    suivreExterne,
    captures,
    derniereCapture: captures.length > 0 ? captures[captures.length - 1] : null,
    prochainCheckpoint,
    onSortieEcran,
  };
}
