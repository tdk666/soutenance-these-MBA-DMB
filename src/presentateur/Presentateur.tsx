import { Fragment } from 'react';
import type { DeckConfig } from '../types';
import type { Regie } from '../moteur/useRegie';
import type { Chrono } from '../moteur/useChrono';
import { formatEcart, msToTc, tcToMs } from '../moteur/timecode';
import { MiniEcran } from '../moteur/MiniEcran';

/**
 * Le mode présentateur : chrono à checkpoints, notes du script, prochain
 * geste, aperçus. Outil de pilotage, pas un écran de show : grotesque,
 * fond sombre neutre, information d’abord.
 */

const JAUNE = '#E8B400';
const GRIS = '#8A929E';
const CARTE = '#151A24';

/** met en évidence les marqueurs du script : silences ◆ Sx, (r), blocs ⟦...⟧ */
function NotesScript({ texte }: { texte: string }) {
  const morceaux = texte.split(/(\(r\)|◈|◆\s*\*{0,2}S\d\*{0,2}|⟦[^⟧]*⟧)/g);
  return (
    <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>
      {morceaux.map((m, i) => {
        if (m === '◈') {
          // phrase à dire au mot près
          return (
            <span key={i} style={{ color: JAUNE, fontWeight: 700 }}>
              ◈
            </span>
          );
        }
        if (/^◆/.test(m)) {
          return (
            <span
              key={i}
              style={{
                color: '#0C0F16',
                background: JAUNE,
                fontWeight: 700,
                padding: '1px 8px',
                borderRadius: 4,
                margin: '0 2px',
              }}
            >
              {m.replaceAll('*', '')}
            </span>
          );
        }
        if (/^⟦/.test(m)) {
          return (
            <span
              key={i}
              style={{
                display: 'inline',
                color: '#9FB4FF',
                borderBottom: '1px dotted #9FB4FF',
              }}
            >
              {m}
            </span>
          );
        }
        if (m === '(r)') {
          return (
            <span key={i} style={{ color: GRIS, fontWeight: 600 }}>
              ⏎
            </span>
          );
        }
        return <Fragment key={i}>{m}</Fragment>;
      })}
    </p>
  );
}

export function Presentateur({
  config,
  regie,
  chrono,
  couverture = false,
}: {
  config: DeckConfig;
  regie: Regie;
  chrono: Chrono;
  couverture?: boolean;
}) {
  const screen = regie.screen;
  const prochainEcranIndex = regie.seq
    .slice(regie.beatIndex + 1)
    .find((b) => b.screenIndex !== regie.screenIndex)?.screenIndex;
  // prochain checkpoint : le premier dont l’écran de sortie n’est pas encore passé
  const indexEcran = (id: string) => config.screens.findIndex((s) => s.id === id);
  const cp =
    config.checkpoints.find(
      (c) => c.sortieDe !== null && indexEcran(c.sortieDe) >= regie.screenIndex,
    ) ??
    config.checkpoints.find((c) => c.id === 'FIN') ??
    null;
  const versCp = cp ? tcToMs(cp.cible) - chrono.elapsedMs : null;
  const capture = chrono.derniereCapture;

  return (
    <div
      className="grid h-full w-full overflow-hidden"
      style={{
        gridTemplateColumns: '300px 1fr 380px',
        background: '#0C0F16',
        color: '#E7EAF0',
        fontFamily: 'var(--grotesque)',
      }}
    >
      {/* ----- colonne chrono ----- */}
      <div className="flex flex-col gap-4 p-6" style={{ borderRight: '1px solid #232936' }}>
        <div style={{ color: GRIS, fontSize: 13, letterSpacing: '0.12em' }}>CHRONO</div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
            color: chrono.enMarche ? '#FFFFFF' : GRIS,
          }}
        >
          {msToTc(chrono.elapsedMs)}
        </div>
        <div style={{ color: GRIS, fontSize: 14 }}>
          {chrono.enMarche ? 'en marche' : chrono.demarre ? 'en pause' : 'S : démarrer au premier mot'}
          {' · cible '}
          {config.meta.dureeCible}
        </div>

        {cp && (
          <div style={{ background: CARTE, borderRadius: 10, padding: 16 }}>
            <div style={{ color: GRIS, fontSize: 13, letterSpacing: '0.12em', marginBottom: 8 }}>
              PROCHAIN CHECKPOINT
            </div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>
              {cp.id} · {cp.libelle}
            </div>
            <div style={{ fontSize: 16, color: GRIS, marginTop: 4 }}>
              cible {cp.cible}
              {chrono.demarre && versCp !== null && (
                <span style={{ color: versCp < 0 ? JAUNE : '#8FD48F', marginLeft: 10 }}>
                  {versCp >= 0 ? `dans ${msToTc(versCp)}` : `dépassé de ${msToTc(-versCp)}`}
                </span>
              )}
            </div>
          </div>
        )}

        <div
          style={{
            background: CARTE,
            borderRadius: 10,
            padding: 16,
            border: capture?.instruction ? `1.5px solid ${JAUNE}` : '1.5px solid transparent',
          }}
        >
          <div style={{ color: GRIS, fontSize: 13, letterSpacing: '0.12em', marginBottom: 8 }}>
            DERNIER CONSTAT
          </div>
          {capture ? (
            <>
              <div style={{ fontSize: 22, fontWeight: 600 }}>
                {capture.checkpoint.id} · {formatEcart(capture.ecartMs)}
              </div>
              <div
                style={{
                  fontSize: 17,
                  marginTop: 8,
                  lineHeight: 1.45,
                  color: capture.instruction ? JAUNE : '#8FD48F',
                }}
              >
                {capture.instruction ?? 'Dans les clous. Ne rien changer.'}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 16, color: GRIS }}>aucun checkpoint franchi</div>
          )}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ color: GRIS, fontSize: 13, letterSpacing: '0.12em', marginBottom: 10 }}>
            CIBLES
          </div>
          {config.checkpoints.map((c) => {
            const faite = chrono.captures.find((x) => x.checkpoint.id === c.id);
            return (
              <div
                key={c.id}
                className="flex items-baseline justify-between"
                style={{ fontSize: 15, padding: '5px 0', color: faite ? '#E7EAF0' : GRIS }}
              >
                <span>
                  {c.id} · {c.libelle}
                </span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {faite ? formatEcart(faite.ecartMs) : c.cible}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ----- colonne script ----- */}
      <div className="flex min-h-0 flex-col p-6">
        <div className="flex items-baseline gap-4">
          <span style={{ fontSize: 26, fontWeight: 700 }}>
            {screen.id}
          </span>
          <span style={{ fontSize: 20, color: GRIS }}>
            bloc {screen.bloc} · {screen.titreInterne} · entrée {screen.entreeCible}
          </span>
          {screen.notes.silences.map((s) => (
            <span key={s} style={{ color: JAUNE, fontSize: 16, fontWeight: 700 }}>
              ◆ {s}
            </span>
          ))}
        </div>

        <div
          style={{
            background: CARTE,
            borderRadius: 10,
            padding: '14px 18px',
            marginTop: 14,
            borderLeft: `4px solid ${JAUNE}`,
          }}
        >
          <div style={{ color: GRIS, fontSize: 13, letterSpacing: '0.12em', marginBottom: 6 }}>
            PROCHAIN GESTE
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.3 }}>
            {couverture
              ? 'Page de garde affichée · → pour ouvrir le noir de l’adresse'
              : regie.chainesEnAttente > 0
                ? `chaîne en cours (${regie.chainesEnAttente}) · → pour terminer`
                : regie.prochain
                  ? regie.prochain.kind === 'entree'
                    ? regie.prochain.libelle
                    : `« ${regie.prochain.libelle} »`
                  : 'fin de la soutenance'}
          </div>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto"
          style={{ marginTop: 16, fontSize: 18, color: '#D3D8E2', paddingRight: 12, lineHeight: 1.5 }}
        >
          <NotesScript texte={screen.notes.script} />
          {screen.notes.consignes && (
            <div style={{ marginTop: 16, color: '#9FB4FF', fontSize: 16 }}>
              Consigne : {screen.notes.consignes}
            </div>
          )}
        </div>
      </div>

      {/* ----- colonne aperçus ----- */}
      <div className="flex flex-col gap-5 p-6" style={{ borderLeft: '1px solid #232936' }}>
        <div>
          <div style={{ color: GRIS, fontSize: 13, letterSpacing: '0.12em', marginBottom: 8 }}>
            À L’ÉCRAN
          </div>
          <div style={{ border: '1px solid #232936' }}>
            <MiniEcran
              config={config}
              screenIndex={regie.screenIndex}
              largeur={332}
              faits={regie.faits}
              objet={regie.objetEtat}
            />
          </div>
        </div>
        {prochainEcranIndex !== undefined && (
          <div>
            <div style={{ color: GRIS, fontSize: 13, letterSpacing: '0.12em', marginBottom: 8 }}>
              ÉCRAN SUIVANT · {config.screens[prochainEcranIndex].id}
            </div>
            <div style={{ border: '1px solid #232936' }}>
              <MiniEcran config={config} screenIndex={prochainEcranIndex} largeur={332} />
            </div>
            <div style={{ color: GRIS, fontSize: 15, marginTop: 8 }}>
              {config.screens[prochainEcranIndex].titreInterne}
            </div>
          </div>
        )}
        <div style={{ marginTop: 'auto', color: GRIS, fontSize: 13, lineHeight: 1.8 }}>
          → / espace : avancer · ← : reculer · Échap : grille
          <br />
          1-23 puis Entrée : aller à · S : chrono · Maj+R : zéro
          <br />
          F : plein écran · L : salle claire · P : présentateur
        </div>
      </div>
    </div>
  );
}
