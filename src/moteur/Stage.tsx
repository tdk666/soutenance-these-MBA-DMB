import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import type { DeckConfig, Fond } from '../types';
import { EASE_FOND } from './motion';

export function couleurFond(fond: Fond, config: DeckConfig, salleClaire: boolean): string {
  switch (fond) {
    case 'noir':
      return '#000000';
    case 'bleu':
      return salleClaire ? config.salleClaire.bleuFonce : '#1F2A7A';
    case 'papier':
      return '#F5F3EE';
  }
}

/**
 * La scène de référence 1920×1080, mise à l'échelle du viewport (1280×720 à 4K),
 * letterbox noir. Le fond est une couche persistante dont la couleur s'anime :
 * les bascules de fond sont des événements continus, pas des cuts.
 */
export function Stage({
  fond,
  config,
  salleClaire,
  children,
}: {
  fond: Fond;
  config: DeckConfig;
  salleClaire: boolean;
  children: ReactNode;
}) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const calc = () =>
      setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black">
      <div
        className={`scene relative ${salleClaire ? 'salle-claire' : ''}`}
        style={{
          width: 1920,
          height: 1080,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flex: '0 0 auto',
        }}
      >
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ backgroundColor: couleurFond(fond, config, salleClaire) }}
          transition={{ duration: 0.7, ease: EASE_FOND }}
        />
        {children}
        <div className="grain" />
      </div>
    </div>
  );
}
