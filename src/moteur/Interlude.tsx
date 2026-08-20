import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { DeckConfig, Fond } from '../types';
import { couleurFond } from './Stage';
import { EASE_ENTREE, EASE_FOND } from './motion';

/**
 * L’interlude de chapitre : au premier écran d’un bloc, son nom traverse la
 * scène en très grand pendant la transition, puis se retire vers le haut au
 * moment où l’étiquette du chrome prend le relais. Le jury voit la charpente
 * du récit sans que cela coûte un mot de parole ni un clic. Jamais sur les
 * verdicts noirs : ils arrivent nus.
 */
export function Interlude({
  numero,
  nom,
  fond,
  config,
}: {
  numero: number;
  nom: string;
  fond: Fond;
  config: DeckConfig;
}) {
  const surPapier = fond === 'papier';
  const encre = surPapier ? '#141824' : '#F5F3EE';
  const voile = couleurFond(fond, config, false);
  const mots = nom.split(' ');
  let index = 0;
  // deux phases pilotées par l’horloge React : la tenue résiste aux à-coups de
  // rendu (une timeline en keyframes sauterait en avant si la première image
  // peinte arrive tard, et l’interlude serait déjà en train de sortir)
  const [phase, setPhase] = useState<'tenue' | 'sortie'>('tenue');
  useEffect(() => {
    const t = setTimeout(() => setPhase('sortie'), 950);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={false}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      {/* le voile : la couleur du chapitre, pleine, qui se dissout sur le contenu déjà entré */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'tenue' ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE_FOND }}
        style={{ background: voile }}
      />
      {/* le nom, lettre à lettre, puis la sortie du groupe vers le haut */}
      <motion.div
        className="absolute"
        initial={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        animate={
          phase === 'tenue'
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : { opacity: 0, y: -64, filter: 'blur(10px)' }
        }
        transition={{ duration: 0.55, ease: EASE_ENTREE }}
        style={{ left: 140, top: 396, color: encre }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 0.55, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_ENTREE }}
          style={{
            fontFamily: 'var(--grotesque)',
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: '0.16em',
          }}
        >
          {String(numero).padStart(2, '0')}
        </motion.div>
        <div
          style={{
            fontFamily: 'var(--serif)',
            fontVariationSettings: '"opsz" 144',
            fontWeight: 380,
            fontSize: 168,
            lineHeight: 1.02,
            letterSpacing: '-0.01em',
            marginTop: 10,
          }}
        >
          {mots.map((mot, mi) => (
            <span key={mi} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
              {[...mot].map((c, ci) => {
                const i = index++;
                return (
                  <span
                    key={ci}
                    style={{
                      display: 'inline-block',
                      overflow: 'hidden',
                      verticalAlign: 'top',
                      padding: '0.06em 0.02em 0.14em',
                      margin: '-0.06em -0.02em -0.14em',
                    }}
                  >
                    <motion.span
                      style={{ display: 'inline-block' }}
                      initial={{ y: '115%' }}
                      animate={{ y: '0%' }}
                      transition={{ duration: 0.6, ease: EASE_ENTREE, delay: 0.05 + i * 0.03 }}
                    >
                      {c}
                    </motion.span>
                  </span>
                );
              })}
              {mi < mots.length - 1 ? ' ' : ''}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
