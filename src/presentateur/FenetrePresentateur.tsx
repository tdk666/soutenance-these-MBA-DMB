import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * La fenêtre présentateur : un portail React dans une fenêtre enfant.
 * Aucun canal inter-fenêtres (BroadcastChannel et localStorage sont
 * inutilisables en file://) : le même arbre React pilote les deux fenêtres,
 * la synchronisation est structurelle.
 */
export function FenetrePresentateur({
  ouverte,
  onFermee,
  onFenetre,
  children,
}: {
  ouverte: boolean;
  onFermee: () => void;
  /** attacher le clavier et autres écouteurs; retourne le nettoyage */
  onFenetre: (win: Window) => () => void;
  children: ReactNode;
}) {
  const [conteneur, setConteneur] = useState<HTMLElement | null>(null);
  const winRef = useRef<Window | null>(null);

  useEffect(() => {
    if (!ouverte) {
      winRef.current?.close();
      winRef.current = null;
      setConteneur(null);
      return;
    }
    if (winRef.current && !winRef.current.closed) {
      winRef.current.focus();
      return;
    }
    const win = window.open('', 'presentateur', 'width=1440,height=900');
    if (!win) {
      onFermee();
      return;
    }
    winRef.current = win;
    const doc = win.document;
    doc.title = 'Présentateur — soutenance';
    // base : les URL relatives des styles (dev) se résolvent contre la fenêtre mère
    const base = doc.createElement('base');
    base.href = window.location.href;
    doc.head.appendChild(base);
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach((n) => {
      doc.head.appendChild(n.cloneNode(true));
    });
    doc.body.style.margin = '0';
    doc.body.style.overflow = 'hidden';
    doc.body.style.background = '#0C0F16';
    const racine = doc.createElement('div');
    racine.style.width = '100vw';
    racine.style.height = '100vh';
    doc.body.appendChild(racine);
    setConteneur(racine);
    const detacher = onFenetre(win);
    const surFermeture = () => {
      detacher();
      winRef.current = null;
      setConteneur(null);
      onFermee();
    };
    win.addEventListener('pagehide', surFermeture);
    return () => {
      win.removeEventListener('pagehide', surFermeture);
    };
    // onFenetre/onFermee stables via refs côté appelant
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ouverte]);

  if (!conteneur) return null;
  return createPortal(children, conteneur);
}
