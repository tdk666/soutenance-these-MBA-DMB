import { useRef } from 'react';
import { motion } from 'motion/react';
import type { ObjetEtat } from '../types';
import { EASE_MORPH } from './motion';

/**
 * L'objet graphique persistant : DIX UNITÉS qui ne sont jamais démontées.
 * Les dix journées vendues de la barre se regroupent physiquement en quatre
 * strates (2·3·2·3 unités, les proportions du prix étagé), puis les strates
 * pivotent en frise de vingt-quatre mois. Chaque métamorphose est une
 * interpolation des mêmes dix rectangles : la continuité est structurelle.
 */

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  fantome: boolean;
  jaune: boolean;
}

/** répartition des unités par strate : les proportions des quatre étages */
const UNITES_PAR_STRATE = [2, 3, 2, 3];
/** parts des 24 mois : T1 (3), T2-T3 (6), T4 (3), Année 2 (12) */
const FRISE_PARTS = [3, 6, 3, 12];

function geometrie(etat: ObjetEtat): Rect[] | null {
  if (etat.kind === 'absent') return null;

  if (etat.kind === 'barre') {
    const g =
      etat.position === 'centre'
        ? { x: 140, y: 880, w: 1640, h: 64, gap: 8 }
        : { x: 140, y: 1022, w: 1640, h: 12, gap: 4 };
    const uw = (g.w - 9 * g.gap) / 10;
    return Array.from({ length: 10 }, (_, i) => ({
      x: g.x + i * (uw + g.gap),
      y: g.y,
      w: uw,
      h: g.h,
      fantome: i >= 10 - etat.joursFantomes,
      jaune: false,
    }));
  }

  if (etat.kind === 'strates') {
    const g =
      etat.position === 'centre'
        ? { x: 140, y: 292, w: 720, h: 88, gap: 28 }
        // retrait : la trace discrète, coin haut droit, hors de tout texte
        : { x: 1620, y: 92, w: 160, h: 16, gap: 8 };
    const rects: Rect[] = [];
    UNITES_PAR_STRATE.forEach((n, s) => {
      const uw = g.w / n;
      for (let i = 0; i < n; i++) {
        rects.push({
          x: g.x + i * uw,
          y: g.y + s * (g.h + g.gap),
          w: uw + (i < n - 1 ? 1.5 : 0), // recouvrement : la strate est UNE pièce
          h: g.h,
          fantome: false,
          jaune: false,
        });
      }
    });
    return rects;
  }

  // frise : chaque strate devient un segment du temps
  const g = { x: 140, y: 460, w: 1640, h: 110, gap: 12 };
  const total = FRISE_PARTS.reduce((a, b) => a + b, 0);
  const unite = (g.w - 3 * g.gap) / total;
  const rects: Rect[] = [];
  let sx = g.x;
  FRISE_PARTS.forEach((part, s) => {
    const segW = part * unite;
    const n = UNITES_PAR_STRATE[s];
    const uw = segW / n;
    const allume = s < etat.allumes;
    for (let i = 0; i < n; i++) {
      rects.push({
        x: sx + i * uw,
        y: g.y,
        w: uw + (i < n - 1 ? 1.5 : 0),
        h: g.h,
        fantome: !allume,
        jaune: allume,
      });
    }
    sx += segW + g.gap;
  });
  return rects;
}

/** durée de la métamorphose selon le changement d'état (elles s'allongent
    à mesure que l'objet gagne en signification : 1,4 s / 1,6 s / 1,8 s) */
function dureeMorph(avant: ObjetEtat['kind'] | null, apres: ObjetEtat['kind']): number {
  if (avant === apres || avant === null) return 0.55;
  if (apres === 'strates') return 1.6;
  if (apres === 'frise') return 1.8;
  if (apres === 'barre') return 1.4;
  return 0.9;
}

export function ObjetLayer({ etat, live }: { etat: ObjetEtat; live: boolean }) {
  const precedent = useRef<ObjetEtat['kind'] | null>(null);
  const rects = geometrie(etat);
  const duree = live ? dureeMorph(precedent.current, etat.kind) : 0;
  if (precedent.current !== etat.kind) precedent.current = etat.kind;

  return (
    <div className="pointer-events-none absolute inset-0">
      {rects &&
        rects.map((r, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={
              live
                ? { x: r.x, y: r.y + 36, width: r.w, height: r.h, opacity: 0 }
                : false
            }
            animate={{
              opacity: 1,
              x: r.x,
              y: r.y,
              width: r.w,
              height: r.h,
              backgroundColor: r.jaune
                ? 'rgba(232,180,0,1)'
                : r.fantome
                  ? 'rgba(255,255,255,0)'
                  : 'rgba(255,255,255,1)',
              boxShadow: r.fantome
                ? 'inset 0 0 0 1.5px rgba(185,189,196,0.45)'
                : 'inset 0 0 0 0px rgba(185,189,196,0)',
            }}
            transition={{
              duration: duree,
              ease: EASE_MORPH,
              delay: live ? i * 0.04 : 0,
            }}
            style={{ left: 0, top: 0 }}
          />
        ))}
    </div>
  );
}
