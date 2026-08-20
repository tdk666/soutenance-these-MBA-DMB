import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { EASE_ENTREE } from '../moteur/motion';

/**
 * Révélation typographique par masque : le texte monte depuis sa ligne de
 * base, découpé par un cadre invisible. C’est l’entrée éditoriale de
 * référence du deck : un seul mouvement, jamais un fondu mou.
 */
export function Masque({
  children,
  visible = true,
  live,
  delaiS = 0,
  dureeS = 0.85,
  className,
  style,
}: {
  children: ReactNode;
  visible?: boolean;
  live: boolean;
  delaiS?: number;
  dureeS?: number;
  className?: string;
  style?: CSSProperties;
}) {
  if (!visible) return null;
  return (
    <div className={className} style={{ overflow: 'hidden', ...style }}>
      <motion.div
        initial={live ? { y: '112%' } : false}
        animate={{ y: '0%' }}
        transition={{ duration: dureeS, ease: EASE_ENTREE, delay: delaiS }}
      >
        {children}
      </motion.div>
    </div>
  );
}
