import type { DeckConfig, ObjetEtat } from '../types';
import { couleurFond } from './Stage';
import { etatFinalEcran } from './sequence';
import { ObjetLayer } from './ObjetLayer';
import { ScreenView } from '../ecrans/ScreenView';

/**
 * Aperçu miniature d'un écran. Par défaut à l'état final (tous steps
 * accomplis); `faits` et `objet` permettent de refléter l'état vivant
 * (vue « à l'écran » du présentateur).
 */
export function MiniEcran({
  config,
  screenIndex,
  largeur,
  salleClaire = false,
  faits,
  objet,
}: {
  config: DeckConfig;
  screenIndex: number;
  largeur: number;
  salleClaire?: boolean;
  faits?: Set<string>;
  objet?: ObjetEtat;
}) {
  const screen = config.screens[screenIndex];
  const echelle = largeur / 1920;
  const final = etatFinalEcran(config, screenIndex);
  const faitsEffectifs = faits ?? final.faits;
  const objetEffectif = objet ?? final.objet;
  return (
    <div
      className="pointer-events-none relative overflow-hidden"
      style={{ width: largeur, height: largeur * (1080 / 1920) }}
    >
      <div
        className={`scene absolute ${salleClaire ? 'salle-claire' : ''}`}
        style={{
          width: 1920,
          height: 1080,
          transform: `scale(${echelle})`,
          transformOrigin: 'top left',
          backgroundColor: couleurFond(screen.fond, config, salleClaire),
        }}
      >
        <ScreenView
          screen={screen}
          faits={faitsEffectifs}
          live={false}
          objetEtat={objetEffectif}
          sim={config.simulateur}
        />
        <ObjetLayer etat={objetEffectif} live={false} />
      </div>
    </div>
  );
}
