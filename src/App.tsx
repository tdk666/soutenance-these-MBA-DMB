import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { deckConfig } from '../content/deck.config';
import { attacherClavier, type ClavierHandlers } from './moteur/clavier';
import { useRegie } from './moteur/useRegie';
import { useChrono } from './moteur/useChrono';
import { Stage } from './moteur/Stage';
import { ObjetLayer } from './moteur/ObjetLayer';
import { Chrome } from './moteur/Chrome';
import { Couverture } from './moteur/Couverture';
import { Interlude } from './moteur/Interlude';
import { Grille } from './moteur/Grille';
import { ScreenView } from './ecrans/ScreenView';
import { Presentateur } from './presentateur/Presentateur';
import { FenetrePresentateur } from './presentateur/FenetrePresentateur';
import { EASE_ENTREE } from './moteur/motion';
import type { TransitionIn } from './types';

/** sortie brève et uniforme, dans le flux montant : l’entrée du suivant porte le mouvement */
const SORTIE = { opacity: 0, y: -12, scale: 0.987, filter: 'blur(7px)', transition: { duration: 0.32 } };

function variantes(t: TransitionIn) {
  const duree = 'dureeMs' in t ? t.dureeMs / 1000 : 0.5;
  switch (t.type) {
    case 'aucune':
      return { initial: {}, animate: {}, exit: SORTIE, duree: 0.3 };
    case 'fondu':
    case 'bascule-fond':
      return { initial: { opacity: 0, y: 18, filter: 'blur(6px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, exit: SORTIE, duree };
    case 'morph-objet':
      // la métamorphose de l’objet EST la transition : le contenu suit vite
      return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: SORTIE, duree: 0.45 };
    case 'masque-montant':
      return {
        initial: { clipPath: 'inset(100% 0% 0% 0%)', y: 30 },
        animate: { clipPath: 'inset(0% 0% 0% 0%)', y: 0 },
        exit: SORTIE,
        duree,
      };
    case 'glissement':
      return {
        initial:
          t.direction === 'gauche'
            ? { opacity: 0, x: 90, filter: 'blur(5px)' }
            : { opacity: 0, y: 90, filter: 'blur(5px)' },
        animate: { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' },
        exit: SORTIE,
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
  // la page de garde : affichée au lancement, hors régie
  const [couverture, setCouverture] = useState(true);
  // l’interlude de chapitre : le nom du bloc traverse la scène à son ouverture
  const [interlude, setInterlude] = useState<{
    cle: number;
    numero: number;
    nom: string;
    fond: 'bleu' | 'papier';
  } | null>(null);
  const blocPrec = useRef(regie.screen.bloc);
  useEffect(() => {
    const b = regie.screen.bloc;
    if (b === blocPrec.current) return;
    const avant = blocPrec.current;
    blocPrec.current = b;
    // seulement en avançant au clic, jamais sur les verdicts noirs ni sur un saut
    const fond = regie.screen.fond;
    if (!regie.live || b < avant || fond === 'noir') return;
    const nom = deckConfig.meta.blocs.find((x) => x.id === b)?.nom;
    if (nom) setInterlude({ cle: Date.now(), numero: b, nom, fond });
  }, [regie.screen.bloc, regie.live, regie.screen.fond]);
  useEffect(() => {
    if (!interlude) return;
    const t = setTimeout(() => setInterlude(null), 1700);
    return () => clearTimeout(t);
  }, [interlude]);

  // les handlers clavier lisent l’état courant via une ref (deux fenêtres, zéro closure périmée)
  const ref = useRef({ regie, chrono, grille, selection, saisie, couverture });
  ref.current = { regie, chrono, grille, selection, saisie, couverture };

  const handlers = useMemo<ClavierHandlers>(() => {
    const allerSelection = () => {
      setGrille(false);
      setCouverture(false);
      ref.current.regie.allerAEcran(ref.current.selection);
    };
    return {
      avancer: () => {
        const s = ref.current;
        if (s.grille) setSelection((x) => Math.min(x + 1, deckConfig.screens.length - 1));
        else if (s.couverture) setCouverture(false);
        else s.regie.avancer();
      },
      reculer: () => {
        const s = ref.current;
        if (s.grille) setSelection((x) => Math.max(x - 1, 0));
        else if (!s.couverture && s.regie.beatIndex === 0) setCouverture(true);
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
            setCouverture(false);
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

  /**
   * Synchronisation entre onglets (répétitions sur Netlify : la vue
   * ?vue=presentateur suit la scène au beat près; ses touches pilotent la
   * scène). Le jour J en file://, la fenêtre P reste le canal de référence.
   */
  const canal = useMemo(
    () => ('BroadcastChannel' in window ? new BroadcastChannel('soutenance-sync') : null),
    [],
  );

  // la vue présentateur applique ses touches localement (elle doit vivre seule,
  // sans onglet scène) et les diffuse; quand une scène écoute, son état fait
  // autorité et recale la vue à chaque diffusion
  const handlersEffectifs = useMemo<ClavierHandlers>(() => {
    if (!vuePresentateurSeule || !canal) return handlers;
    const relaye = (action: 'avancer' | 'reculer' | 'chrono' | 'chronoReset') => () => {
      canal.postMessage({ type: 'commande', action });
      handlers[action]();
    };
    return {
      ...handlers,
      avancer: relaye('avancer'),
      reculer: relaye('reculer'),
      bas: relaye('avancer'),
      haut: relaye('reculer'),
      chrono: relaye('chrono'),
      chronoReset: relaye('chronoReset'),
    };
  }, [handlers, vuePresentateurSeule, canal]);

  useEffect(() => attacherClavier(window, handlersEffectifs), [handlersEffectifs]);

  // réception : la scène exécute les commandes; le présentateur suit l’état
  useEffect(() => {
    if (!canal) return;
    canal.onmessage = (e: MessageEvent) => {
      const m = e.data as Record<string, unknown>;
      if (vuePresentateurSeule) {
        if (m?.type !== 'etat') return;
        setCouverture(m.couverture as boolean);
        ref.current.regie.allerAuBeat(m.beat as number, m.chainsDone as number);
        ref.current.chrono.suivreExterne(
          m.chronoMs as number,
          m.chronoEnMarche as boolean,
          m.captures as { id: string; ecartMs: number; instruction: string | null }[],
        );
      } else {
        if (m?.type === 'commande') {
          const action = m.action as string;
          if (action === 'avancer') handlers.avancer();
          else if (action === 'reculer') handlers.reculer();
          else if (action === 'chrono') handlers.chrono();
          else if (action === 'chronoReset') handlers.chronoReset();
        }
      }
    };
    return () => {
      canal.onmessage = null;
    };
  }, [canal, vuePresentateurSeule, handlers]);

  // diffusion de l’état par la scène (à chaque rendu : la cadence suit le chrono)
  useEffect(() => {
    if (!canal || vuePresentateurSeule) return;
    canal.postMessage({
      type: 'etat',
      beat: regie.beatIndex,
      chainsDone: regie.chainsDone,
      couverture,
      chronoMs: chrono.elapsedMs,
      chronoEnMarche: chrono.enMarche,
      captures: chrono.captures.map((c) => ({
        id: c.checkpoint.id,
        ecartMs: c.ecartMs,
        instruction: c.instruction,
      })),
    });
  });

  // pilotage externe : captures Playwright et dépannage le jour J
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__deck = {
      aller: (n: number) => {
        setCouverture(false);
        regie.allerAEcran(n);
      },
      avancer: () => {
        if (ref.current.couverture) setCouverture(false);
        else regie.avancer();
      },
      reculer: regie.reculer,
      couverture: (v: boolean) => setCouverture(v),
      beatIndex: regie.beatIndex,
      chainesEnAttente: regie.chainesEnAttente,
      nbBeats: regie.seq.length - 1,
      ecran: regie.screen.id,
      ecrans: deckConfig.screens.map((s) => s.id),
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
        <Presentateur config={deckConfig} regie={regie} chrono={chrono} couverture={couverture} />
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
        <Chrome
          config={deckConfig}
          screen={regie.screen}
          screenIndex={regie.screenIndex}
          beatIndex={regie.beatIndex}
          nbBeats={regie.seq.length - 1}
          crans={regie.seq
            .filter((b) => b.kind === 'entree')
            .map((b) => b.index / (regie.seq.length - 1))}
          objetEtat={regie.objetEtat}
        />
        <AnimatePresence>
          {interlude && (
            <Interlude
              key={interlude.cle}
              numero={interlude.numero}
              nom={interlude.nom}
              fond={interlude.fond}
              config={deckConfig}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>{couverture && <Couverture config={deckConfig} />}</AnimatePresence>
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
        <Presentateur config={deckConfig} regie={regie} chrono={chrono} couverture={couverture} />
      </FenetrePresentateur>
    </>
  );
}
