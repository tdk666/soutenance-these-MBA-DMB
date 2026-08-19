import { AnimatePresence, motion } from 'motion/react';
import type { ObjetEtat } from '../types';
import { EASE_MORPH } from './motion';

/**
 * L'objet graphique persistant : la colonne vertébrale visuelle.
 * Monté en permanence au-dessus des écrans, jamais démonté; ses états sont
 * interpolés ici. Version étape 2 : états posés et amputation réelle;
 * les morphings continus barre → strates → frise arrivent à l'étape 4.
 */

const GEO = {
  barre: {
    centre: { x: 140, y: 880, w: 1640, h: 64, gap: 8 },
    pied: { x: 140, y: 1022, w: 1640, h: 12, gap: 4 },
    retrait: { x: 140, y: 1022, w: 800, h: 12, gap: 4 },
  },
  strates: {
    centre: { x: 140, y: 292, w: 720, h: 88, gap: 28 },
    retrait: { x: 140, y: 330, w: 280, h: 44, gap: 18 },
  },
  frise: { x: 140, y: 470, w: 1640, h: 110, gap: 12 },
};

/** parts des 24 mois : T1 (3), T2-T3 (6), T4 (3), Année 2 (12) */
const FRISE_PARTS = [3, 6, 3, 12];

function Barre({ etat, live }: { etat: Extract<ObjetEtat, { kind: 'barre' }>; live: boolean }) {
  const g = GEO.barre[etat.position];
  const segW = (g.w - 9 * g.gap) / 10;
  return (
    <div className="absolute" style={{ left: g.x, top: g.y, width: g.w, height: g.h }}>
      {Array.from({ length: 10 }, (_, i) => {
        const fantome = i >= 10 - etat.joursFantomes;
        return (
          <motion.div
            key={i}
            className="absolute"
            initial={false}
            animate={{
              left: i * (segW + g.gap),
              top: 0,
              width: segW,
              height: g.h,
              backgroundColor: fantome ? 'rgba(255,255,255,0)' : 'rgba(255,255,255,1)',
              boxShadow: fantome
                ? 'inset 0 0 0 1.5px rgba(185,189,196,0.45)'
                : 'inset 0 0 0 0px rgba(185,189,196,0)',
            }}
            transition={{
              duration: 0.55,
              ease: EASE_MORPH,
              delay: live && fantome ? (i - (10 - etat.joursFantomes)) * 0.16 : 0,
            }}
          />
        );
      })}
    </div>
  );
}

function Strates({ etat }: { etat: Extract<ObjetEtat, { kind: 'strates' }> }) {
  const g = GEO.strates[etat.position];
  return (
    <div className="absolute" style={{ left: g.x, top: g.y, width: g.w }}>
      {Array.from({ length: 4 }, (_, i) => (
        <motion.div
          key={i}
          className="bg-white"
          style={{ width: g.w, height: g.h, marginBottom: g.gap }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_MORPH, delay: i * 0.12 }}
        />
      ))}
    </div>
  );
}

function Frise({ etat, live }: { etat: Extract<ObjetEtat, { kind: 'frise' }>; live: boolean }) {
  const g = GEO.frise;
  const total = FRISE_PARTS.reduce((a, b) => a + b, 0);
  const unite = (g.w - 3 * g.gap) / total;
  let x = 0;
  return (
    <div className="absolute" style={{ left: g.x, top: g.y, width: g.w, height: g.h }}>
      {FRISE_PARTS.map((part, i) => {
        const w = part * unite;
        const left = x;
        x += w + g.gap;
        const allume = i < etat.allumes;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left, top: 0, width: w, height: g.h }}
            initial={false}
            animate={{
              backgroundColor: allume ? '#E8B400' : 'rgba(232,180,0,0)',
              boxShadow: allume
                ? 'inset 0 0 0 0px rgba(255,255,255,0)'
                : 'inset 0 0 0 1.5px rgba(255,255,255,0.5)',
            }}
            transition={{ duration: live ? 0.7 : 0, ease: EASE_MORPH }}
          />
        );
      })}
    </div>
  );
}

export function ObjetLayer({ etat, live }: { etat: ObjetEtat; live: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <AnimatePresence>
        {etat.kind !== 'absent' && (
          <motion.div
            key={etat.kind + ('position' in etat ? etat.position : '')}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_MORPH }}
          >
            {etat.kind === 'barre' && <Barre etat={etat} live={live} />}
            {etat.kind === 'strates' && <Strates etat={etat} />}
            {etat.kind === 'frise' && <Frise etat={etat} live={live} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
