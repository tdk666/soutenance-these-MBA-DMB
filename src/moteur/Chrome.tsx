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
  crans = [],
  objetEtat,
}: {
  config: DeckConfig;
  screen: Screen;
  screenIndex: number;
  beatIndex: number;
  nbBeats: number;
  /** positions des entrées d’écran sur le filet, en fraction de la course */
  crans?: number[];
  objetEtat: ObjetEtat;
}) {
  if (screen.fond === 'noir') return null;
  const surPapier = screen.fond === 'papier';
  const encre = surPapier ? 'rgba(16,20,31,0.45)' : 'rgba(255,255,255,0.45)';
  const filet = surPapier ? 'rgba(16,20,31,0.3)' : 'rgba(255,255,255,0.32)';
  const repere = surPapier ? 'rgba(16,20,31,0.16)' : 'rgba(255,255,255,0.14)';
  const bloc = config.meta.blocs.find((b) => b.id === screen.bloc);
  // le coin s’efface quand quelque chose y vit déjà : la trace de l’objet en
  // retrait, ou les barres hautes du simulateur
  const coinOccupe =
    (objetEtat.kind === 'strates' && objetEtat.position === 'retrait') ||
    screen.layout === 'simulateur';
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
      {/* les crans du parcours : une marque par écran, l’instrument sous le filet */}
      {crans.map((f, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${f * 100}%`,
            bottom: 0,
            width: 1,
            height: 9,
            background: repere,
          }}
        />
      ))}
      <motion.div
        className="absolute"
        initial={false}
        animate={{ width: `${(beatIndex / nbBeats) * 100}%` }}
        transition={{ duration: 0.6, ease: EASE_ENTREE }}
        style={{ left: 0, bottom: 0, height: 3, background: filet }}
      />
      {/* repères de coin, la marque d’imprimeur : uniquement sur papier */}
      {surPapier &&
        [
          { left: 48, top: 48, borderLeft: `1px solid ${repere}`, borderTop: `1px solid ${repere}` },
          { right: 48, top: 48, borderRight: `1px solid ${repere}`, borderTop: `1px solid ${repere}` },
          { left: 48, bottom: 48, borderLeft: `1px solid ${repere}`, borderBottom: `1px solid ${repere}` },
          { right: 48, bottom: 48, borderRight: `1px solid ${repere}`, borderBottom: `1px solid ${repere}` },
        ].map((pos, i) => (
          <div key={i} className="absolute" style={{ width: 16, height: 16, ...pos }} />
        ))}
    </>
  );
}
