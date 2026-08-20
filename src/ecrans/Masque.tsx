import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { EASE_ENTREE } from '../moteur/motion';

/**
 * Révélation typographique par masque : une montée courte et tendue dans un
 * cadre invisible, portée par l’opacité. Jamais de longue glissade : le
 * texte se pose, il ne défile pas.
 */
export function Masque({
  children,
  visible = true,
  live,
  delaiS = 0,
  dureeS = 0.6,
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
        initial={live ? { y: '52%', opacity: 0 } : false}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: dureeS, ease: EASE_ENTREE, delay: delaiS }}
      >
        {children}
      </motion.div>
    </div>
  );
}
