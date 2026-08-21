import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import { EASE_ENTREE } from '../moteur/motion';

/**
 * Titre à révélation lettre à lettre : chaque caractère monte de sa ligne de
 * base, en cascade serrée. Réservé aux grands titres et aux baptêmes; les
 * blocs de texte gardent le masque simple (Masque).
 */
/**
 * Révélation mot à mot : la version phrase du TitreAnime. Chaque mot monte de
 * sa ligne de base dans son propre cadre. Pour les lignes de texte qui
 * doivent rester cinétiques sans le scintillement du lettre à lettre.
 */
export function MotsAnime({
  texte,
  live,
  delaiS = 0,
  dureeS = 0.55,
  decalageS = 0.03,
  style,
}: {
  texte: string;
  live: boolean;
  delaiS?: number;
  dureeS?: number;
  decalageS?: number;
  style?: CSSProperties;
}) {
  const mots = texte.split(' ');
  return (
    <span style={{ display: 'inline-block', ...style }} aria-label={texte} role="text">
      {mots.map((m, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
            whiteSpace: 'pre',
            padding: '0.08em 0.03em 0.16em',
            margin: '-0.08em -0.03em -0.16em',
          }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={live ? { y: '112%', opacity: 0 } : false}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: dureeS, ease: EASE_ENTREE, delay: delaiS + i * decalageS }}
          >
            {m + (i < mots.length - 1 ? ' ' : '')}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function TitreAnime({
  texte,
  live,
  delaiS = 0,
  dureeS = 0.7,
  decalageS = 0.016,
  style,
}: {
  texte: string;
  live: boolean;
  delaiS?: number;
  dureeS?: number;
  decalageS?: number;
  style?: CSSProperties;
}) {
  const mots = texte.split(' ');
  let index = 0;
  return (
    <span style={{ display: 'inline-block', ...style }} aria-label={texte} role="text">
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
                  // marge de découpe : les jambages et l’italique ne se rognent pas
                  padding: '0.06em 0.02em 0.14em',
                  margin: '-0.06em -0.02em -0.14em',
                }}
              >
                <motion.span
                  style={{ display: 'inline-block' }}
                  initial={live ? { y: '120%' } : false}
                  animate={{ y: '0%' }}
                  transition={{ duration: dureeS, ease: EASE_ENTREE, delay: delaiS + i * decalageS }}
                >
                  {c}
                </motion.span>
              </span>
            );
          })}
          {mi < mots.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}
