import { motion } from 'motion/react';
import type { DeckConfig, ObjetEtat, Screen } from '../types';
import { EASE_ENTREE } from './motion';

/**
 * Le chrome éditorial : la signature discrète qui tient le deck ensemble.
 * Section courante et folio en haut à droite, filet de progression au ras du
 * bas. Absent des écrans noirs : les verdicts restent nus.
 */
export function Chrome({
  config,
  screen,
  screenIndex,
  beatIndex,
  nbBeats,
  objetEtat,
}: {
  config: DeckConfig;
  screen: Screen;
  screenIndex: number;
  beatIndex: number;
  nbBeats: number;
  objetEtat: ObjetEtat;
}) {
  if (screen.fond === 'noir') return null;
  const surPapier = screen.fond === 'papier';
  const encre = surPapier ? 'rgba(16,20,31,0.45)' : 'rgba(255,255,255,0.45)';
  const bloc = config.meta.blocs.find((b) => b.id === screen.bloc);
  // la trace de l’objet occupe ce coin sur les écrans en retrait : le chrome s’efface
  const coinOccupe = objetEtat.kind === 'strates' && objetEtat.position === 'retrait';
  return (
    <>
      {!coinOccupe && (
        <div
          className="absolute"
          style={{
            right: 140,
            top: 92,
            textAlign: 'right',
            fontFamily: 'var(--grotesque)',
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: encre,
            lineHeight: 1.5,
          }}
        >
          <div>
            {String(screen.bloc).padStart(2, '0')} · {bloc?.nom}
          </div>
          <div style={{ opacity: 0.75 }}>
            {String(screenIndex + 1).padStart(2, '0')} / {config.screens.length}
          </div>
        </div>
      )}
      <motion.div
        className="absolute"
        initial={false}
        animate={{ width: `${(beatIndex / nbBeats) * 100}%` }}
        transition={{ duration: 0.6, ease: EASE_ENTREE }}
        style={{
          left: 0,
          bottom: 0,
          height: 3,
          background: surPapier ? 'rgba(16,20,31,0.3)' : 'rgba(255,255,255,0.32)',
        }}
      />
    </>
  );
}
