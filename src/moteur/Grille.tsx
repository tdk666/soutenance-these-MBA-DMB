import { motion } from 'motion/react';
import type { DeckConfig } from '../types';
import { EASE_ENTREE } from './motion';
import { MiniEcran } from './MiniEcran';

/** Vue d’ensemble (Échap) : les 21 écrans, sélection clavier ou clic. */
export function Grille({
  config,
  selection,
  courant,
  onChoisir,
}: {
  config: DeckConfig;
  selection: number;
  courant: number;
  onChoisir: (screenIndex: number) => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-auto"
      style={{ background: '#04060B' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: EASE_ENTREE }}
    >
      <div
        className="grid gap-4 p-10"
        style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
      >
        {config.screens.map((s, i) => (
          <button
            key={s.id}
            onClick={() => onChoisir(i)}
            className="group text-left"
            style={{ outline: 'none' }}
          >
            <div
              style={{
                border:
                  i === selection
                    ? '2px solid #E8B400'
                    : i === courant
                      ? '2px solid rgba(255,255,255,0.8)'
                      : '2px solid rgba(255,255,255,0.15)',
              }}
            >
              <MiniEcran config={config} screenIndex={i} largeur={236} />
            </div>
            <div
              className="mt-2 flex items-baseline gap-2"
              style={{ fontFamily: 'var(--grotesque)', color: i === selection ? '#E8B400' : '#B9BDC4' }}
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 13, opacity: 0.85 }}>{s.titreInterne}</span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
