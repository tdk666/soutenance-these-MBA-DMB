import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import type { DeckConfig, Fond } from '../types';
import { EASE_FOND } from './motion';

/** couleur plate de référence (miniatures, aperçus) */
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
 * Fond éclairé : les aplats deviennent des surfaces lumineuses. Le bleu est
 * éclairé du coin haut gauche (là où vivent les kickers), le papier a un
 * grain de lumière descendant; le noir reste absolu.
 */
function fondCss(fond: Fond, config: DeckConfig, salleClaire: boolean): string {
  switch (fond) {
    case 'noir':
      return '#000000';
    case 'bleu':
      return salleClaire
        ? `radial-gradient(135% 150% at 18% 0%, #1F2A74 0%, ${config.salleClaire.bleuFonce} 48%, #101740 100%)`
        : 'radial-gradient(135% 150% at 18% 0%, #283382 0%, #1F2A7A 46%, #161E56 100%)';
    case 'papier':
      return 'linear-gradient(168deg, #F9F7F2 0%, #F5F3EE 52%, #EDEAE0 100%)';
  }
}

/**
 * La scène 1920×1080 mise à l'échelle du viewport. Les bascules de fond sont
 * un rideau : la nouvelle surface monte du bas de l'écran et recouvre
 * l'ancienne (750 ms), pendant que le contenu suivant entre.
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

  // pile de rideaux : l'ancien fond reste en socle, le nouveau monte dessus
  const [pile, setPile] = useState<{ cle: number; fond: Fond }[]>([{ cle: 0, fond }]);
  useEffect(() => {
    setPile((p) => {
      const dernier = p[p.length - 1];
      if (dernier.fond === fond) return p;
      return [dernier, { cle: dernier.cle + 1, fond }];
    });
  }, [fond]);

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
        {pile.map((r, i) => (
          <motion.div
            key={r.cle}
            className="absolute inset-0"
            initial={i === 0 ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 0.75, ease: EASE_FOND }}
            style={{ background: fondCss(r.fond, config, salleClaire) }}
          />
        ))}
        {children}
        <div className="grain" />
      </div>
    </div>
  );
}
