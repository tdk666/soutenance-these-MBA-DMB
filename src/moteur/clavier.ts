/**
 * Clavier et télécommande de présentation. Les télécommandes usuelles
 * émettent PageDown/PageUp (parfois flèches) : les deux sont couverts.
 *
 * → / Espace / PageDown : avancer (un beat, ou terminer la chaîne en cours)
 * ← / PageUp            : reculer
 * Échap                 : grille des écrans (ou fermer / annuler la saisie)
 * 1-21 puis Entrée      : aller à l'écran
 * F                     : plein écran (scène)
 * L                     : mode salle claire
 * S                     : chrono marche/pause
 * Maj+R                 : chrono remis à zéro
 * P                     : fenêtre présentateur
 */
export interface ClavierHandlers {
  avancer: () => void;
  reculer: () => void;
  /** ArrowDown / ArrowUp : avancer/reculer en scène, ±1 rangée dans la grille */
  bas: () => void;
  haut: () => void;
  echap: () => void;
  chiffre: (c: string) => void;
  entree: () => void;
  pleinEcran: () => void;
  salleClaire: () => void;
  chrono: () => void;
  chronoReset: () => void;
  presentateur: () => void;
}

export function attacherClavier(win: Window, h: ClavierHandlers): () => void {
  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        h.avancer();
        return;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        h.reculer();
        return;
      case 'ArrowDown':
        e.preventDefault();
        h.bas();
        return;
      case 'ArrowUp':
        e.preventDefault();
        h.haut();
        return;
      case 'Escape':
        h.echap();
        return;
      case 'Enter':
        h.entree();
        return;
      default:
        break;
    }
    if (/^[0-9]$/.test(e.key)) {
      h.chiffre(e.key);
      return;
    }
    switch (e.key.toLowerCase()) {
      case 'f':
        h.pleinEcran();
        return;
      case 'l':
        h.salleClaire();
        return;
      case 's':
        h.chrono();
        return;
      case 'r':
        if (e.shiftKey) h.chronoReset();
        return;
      case 'p':
        h.presentateur();
        return;
    }
  };
  win.addEventListener('keydown', onKeyDown);
  return () => win.removeEventListener('keydown', onKeyDown);
}
