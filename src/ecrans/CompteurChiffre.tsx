import { useEffect, useState } from 'react';
import { animate } from 'motion/react';
import { EASE_ENTREE } from '../moteur/motion';

/**
 * Un chiffre-événement : il entre en comptant, jamais en pavé statique.
 * Chaque chiffre occupe une cellule à chasse fixe pour éviter tout
 * tremblement de largeur pendant l'animation.
 */
export function CompteurChiffre({
  de,
  vers,
  format,
  dureeMs,
  actif,
  className,
}: {
  de: number;
  vers: number;
  format: (n: number) => string;
  dureeMs: number;
  /** false : afficher directement la valeur finale (retour arrière, aperçus) */
  actif: boolean;
  className?: string;
}) {
  const [valeur, setValeur] = useState(actif ? de : vers);
  useEffect(() => {
    if (!actif) {
      setValeur(vers);
      return;
    }
    const controle = animate(de, vers, {
      duration: dureeMs / 1000,
      ease: EASE_ENTREE,
      onUpdate: (v) => setValeur(v),
    });
    return () => controle.stop();
  }, [actif, de, vers, dureeMs]);

  return (
    <span className={className} aria-label={format(vers)}>
      {[...format(valeur)].map((c, i) => (
        <span
          key={i}
          style={
            /\d/.test(c)
              ? { display: 'inline-block', width: '0.58em', textAlign: 'center' }
              : undefined
          }
        >
          {c}
        </span>
      ))}
    </span>
  );
}
