import { motion } from 'motion/react';
import type { DeckConfig } from '../types';
import { EASE_ENTREE } from './motion';
import { TitreAnime } from '../ecrans/TitreAnime';

/**
 * La page de garde : affichée pendant l'installation du jury, avant le noir
 * de l'adresse. Hors régie : la première flèche l'éteint et ouvre E01.
 */
export function Couverture({ config }: { config: DeckConfig }) {
  const c = config.meta.couverture;
  return (
    <motion.div
      className="absolute inset-0"
      style={{ background: '#000000', color: 'var(--blanc)' }}
      initial={false}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE_ENTREE } }}
    >
      <div
        className="etiquette absolute"
        style={{ left: 160, top: 150, color: 'var(--gris)' }}
      >
        {c.surtitre}
      </div>

      <div className="absolute" style={{ left: 160, top: '44%', transform: 'translateY(-50%)', maxWidth: 1620 }}>
        <TitreAnime
          texte={c.titre}
          live
          delaiS={0.3}
          decalageS={0.014}
          style={{
            fontFamily: 'var(--serif)',
            fontVariationSettings: "'opsz' 132",
            fontWeight: 'var(--wght-titre)' as unknown as number,
            fontSize: 126,
            lineHeight: 1.1,
            letterSpacing: '-0.015em',
          }}
        />
      </div>

      {/* la signature : les dix unités de l'objet, avant leur histoire */}
      <div className="absolute flex" style={{ left: 162, top: '63%', gap: 5 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_ENTREE, delay: 1.1 + i * 0.05 }}
            style={{ width: 42, height: 8, background: 'var(--blanc)' }}
          />
        ))}
      </div>

      <div className="absolute" style={{ left: 160, bottom: 110 }}>
        {c.mentions.map((m, i) => (
          <motion.div
            key={m}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_ENTREE, delay: 1.3 + i * 0.12 }}
            style={{
              fontFamily: 'var(--grotesque)',
              fontSize: 30,
              color: i === 0 ? 'var(--blanc)' : 'var(--gris-clair)',
              lineHeight: 1.8,
            }}
          >
            {m}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
