import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { deckConfig } from '../content/deck.config';
import { attacherClavier, type ClavierHandlers } from './moteur/clavier';
import { useRegie } from './moteur/useRegie';
import { useChrono } from './moteur/useChrono';
import { Stage } from './moteur/Stage';
import { ObjetLayer } from './moteur/ObjetLayer';
import { Grille } from './moteur/Grille';
import { ScreenView } from './ecrans/ScreenView';
import { Presentateur } from './presentateur/Presentateur';
import { FenetrePresentateur } from './presentateur/FenetrePresentateur';
import { EASE_ENTREE } from './moteur/motion';
import type { TransitionIn } from './types';

function variantes(t: TransitionIn) {
  const duree = 'dureeMs' in t ? t.dureeMs / 1000 : 0.5;
  switch (t.type) {
    case 'aucune':
      return { initial: {}, animate: {}, exit: { opacity: 0 }, duree: 0.3 };
    case 'fondu':
    case 'bascule-fond':
    case 'morph-objet':
      return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, duree };
    case 'masque-montant':
      return {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
        duree,
      };
    case 'glissement':
      return {
        initial: t.direction === 'gauche' ? { opacity: 0, x: 90 } : { opacity: 0, y: 90 },
        animate: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0 },
        duree,
      };
  }
}

export default function App() {
  const vuePresentateurSeule = useMemo(
    () => new URLSearchParams(window.location.search).get('vue') === 'presentateur',
    [],
  );
  const chrono = useChrono(deckConfig);
  const regie = useRegie(deckConfig, chrono.onSortieEcran);
  const [salleClaire, setSalleClaire] = useState(false);
  const [grille, setGrille] = useState(false);
  const [selection, setSelection] = useState(0);
  const [saisie, setSaisie] = useState('');
  const [presOuverte, setPresOuverte] = useState(false);

  // les handlers clavier lisent l'état courant via une ref (deux fenêtres, zéro closure périmée)
  const ref = useRef({ regie, chrono, grille, selection, saisie });
  ref.current = { regie, chrono, grille, selection, saisie };

  const handlers = useMemo<ClavierHandlers>(() => {
    const allerSelection = () => {
      setGrille(false);
      ref.current.regie.allerAEcran(ref.current.selection);
    };
    return {
      avancer: () => {
        const s = ref.current;
        if (s.grille) setSelection((x) => Math.min(x + 1, deckConfig.screens.length - 1));
        else s.regie.avancer();
      },
      reculer: () => {
        const s = ref.current;
        if (s.grille) setSelection((x) => Math.max(x - 1, 0));
        else s.regie.reculer();
      },
      bas: () => {
        const s = ref.current;
        if (s.grille) setSelection((x) => Math.min(x + 7, deckConfig.screens.length - 1));
        else s.regie.avancer();
      },
      haut: () => {
        const s = ref.current;
        if (s.grille) setSelection((x) => Math.max(x - 7, 0));
        else s.regie.reculer();
      },
      echap: () => {
        const s = ref.current;
        if (s.saisie !== '') setSaisie('');
        else if (s.grille) setGrille(false);
        else {
          setSelection(s.regie.screenIndex);
          setGrille(true);
        }
      },
      chiffre: (c) => setSaisie((x) => (x + c).slice(0, 2)),
      entree: () => {
        const s = ref.current;
        if (s.saisie !== '') {
          const n = parseInt(s.saisie, 10);
          if (n >= 1 && n <= deckConfig.screens.length) {
            setGrille(false);
            s.regie.allerAEcran(n - 1);
          }
          setSaisie('');
        } else if (s.grille) {
          allerSelection();
        }
      },
      pleinEcran: () => {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen();
      },
      salleClaire: () => setSalleClaire((x) => !x),
      chrono: () => ref.current.chrono.demarrerOuPause(),
      chronoReset: () => ref.current.chrono.reset(),
      presentateur: () => setPresOuverte((x) => !x),
    };
  }, []);

  useEffect(() => attacherClavier(window, handlers), [handlers]);

  // pilotage externe : captures Playwright et dépannage le jour J
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__deck = {
      aller: (n: number) => regie.allerAEcran(n),
      avancer: regie.avancer,
      reculer: regie.reculer,
      beatIndex: regie.beatIndex,
      chainesEnAttente: regie.chainesEnAttente,
      nbBeats: regie.seq.length - 1,
      ecran: regie.screen.id,
      chrono: {
        simuler: chrono.simuler,
        demarrerOuPause: chrono.demarrerOuPause,
        reset: chrono.reset,
      },
      salleClaire: (v: boolean) => setSalleClaire(v),
    };
  });

  const v = variantes(regie.screen.transitionIn);

  if (vuePresentateurSeule) {
    return (
      <div className="h-screen w-screen">
        <Presentateur config={deckConfig} regie={regie} chrono={chrono} />
      </div>
    );
  }

  return (
    <>
      <Stage fond={regie.screen.fond} config={deckConfig} salleClaire={salleClaire}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={regie.screen.id}
            className="absolute inset-0"
            initial={regie.live ? v.initial : false}
            animate={v.animate}
            exit={v.exit}
            transition={{ duration: v.duree, ease: EASE_ENTREE }}
          >
            <ScreenView
              screen={regie.screen}
              faits={regie.faits}
              live={regie.live}
              objetEtat={regie.objetEtat}
              sim={deckConfig.simulateur}
            />
          </motion.div>
        </AnimatePresence>
        <ObjetLayer etat={regie.objetEtat} live={regie.live} />
      </Stage>

      <AnimatePresence>
        {grille && (
          <Grille
            config={deckConfig}
            selection={selection}
            courant={regie.screenIndex}
            onChoisir={(i) => {
              setGrille(false);
              regie.allerAEcran(i);
            }}
          />
        )}
      </AnimatePresence>

      {saisie !== '' && (
        <div
          className="fixed bottom-6 left-6 z-50 rounded-md px-4 py-2"
          style={{
            background: '#151A24',
            color: '#E8B400',
            fontFamily: 'var(--grotesque)',
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          aller à : {saisie}
        </div>
      )}

      <FenetrePresentateur
        ouverte={presOuverte}
        onFermee={() => setPresOuverte(false)}
        onFenetre={(win) => attacherClavier(win, handlers)}
      >
        <Presentateur config={deckConfig} regie={regie} chrono={chrono} />
      </FenetrePresentateur>
    </>
  );
}
