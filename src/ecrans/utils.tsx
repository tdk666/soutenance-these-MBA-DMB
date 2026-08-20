import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import type { Screen } from '../types';
import { EASE_ENTREE } from '../moteur/motion';

/** Un élément ciblé par un step 'reveler' est-il accompli ? */
export function estRevele(screen: Screen, faits: Set<string>, cible: string): boolean {
  const step = screen.steps.find(
    (s) => s.action.type === 'reveler' && s.action.cible === cible,
  );
  return step !== undefined && faits.has(step.id);
}

/** Un élément ciblé par un step 'barrer' est-il barré ? */
export function estBarre(screen: Screen, faits: Set<string>, cible: string): boolean {
  const step = screen.steps.find(
    (s) => s.action.type === 'barrer' && s.action.cible === cible,
  );
  return step !== undefined && faits.has(step.id);
}

/** Entrée standard d’un bloc de contenu : masque montant, un seul mouvement. */
export function Entree({
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
  style?: React.CSSProperties;
}) {
  if (!visible) return null;
  return (
    <motion.div
      className={className}
      style={style}
      initial={live ? { opacity: 0, y: 34 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dureeS, ease: EASE_ENTREE, delay: delaiS }}
    >
      {children}
    </motion.div>
  );
}
