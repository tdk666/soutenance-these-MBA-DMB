import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import type { ObjetEtat, Screen, SimulateurParams } from '../types';
import { EASE_ENTREE, EASE_MORPH } from '../moteur/motion';
import { CompteurChiffre } from './CompteurChiffre';
import { Entree, estBarre, estRevele } from './utils';
import { Simulateur } from '../simulateur/Simulateur';

/*
 * Rendu des écrans. Étape 2 : les écrans typographiques simples sont
 * définitifs (E02, E03, E06, E08, E12, E15, E21, sommaire, suites);
 * les écrans denses (méthodo, comptes, enquête, colonnes, pyramide,
 * simulateur, étages, verrous, frise) sont des maquettes structurées,
 * finalisées aux étapes 3 et 4.
 */

const SERIF = 'var(--serif)';
const GROTESQUE = 'var(--grotesque)';

function serif(opsz: number, poids: string | number): CSSProperties {
  return {
    fontFamily: SERIF,
    fontVariationSettings: `'opsz' ${opsz}`,
    fontWeight: poids as CSSProperties['fontWeight'],
    color: 'currentcolor',
  };
}

/** opérateurs mathématiques recalibrés (opsz bas = traits pleins, lisibles au projecteur) */
function ValeurAvecOps({ valeur }: { valeur: string }) {
  const ops = new Set(['+', '÷', '≈', '−']);
  return (
    <>
      {[...valeur].map((c, i) =>
        ops.has(c) ? (
          <span
            key={i}
            style={{
              fontSize: '0.6em',
              fontVariationSettings: "'opsz' 18",
              fontWeight: 560,
              verticalAlign: '0.12em',
            }}
          >
            {c}
          </span>
        ) : (
          <span key={i}>{c}</span>
        ),
      )}
    </>
  );
}

function parseNombre(valeur: string): number {
  const m = /-?−?\d+(?:,\d+)?/.exec(valeur.replace('−', '-'));
  return m ? parseFloat(m[0].replace('−', '-').replace(',', '.')) : 0;
}

function Maquette({ screen, note }: { screen: Screen; note?: string }) {
  return (
    <div
      className="etiquette absolute"
      style={{ right: 60, bottom: 40, color: 'var(--gris)', opacity: 0.7 }}
    >
      {note ?? 'maquette · finalisé aux étapes 3-4'}
      <span className="ml-4">{screen.id}</span>
    </div>
  );
}

export function ScreenView({
  screen,
  faits,
  live,
  objetEtat,
  sim,
}: {
  screen: Screen;
  faits: Set<string>;
  live: boolean;
  objetEtat: ObjetEtat;
  sim?: SimulateurParams;
}) {
  const surPapier = screen.fond === 'papier';
  const couleurTexte = surPapier ? 'var(--encre)' : 'var(--blanc)';
  const couleurSecondaire = surPapier ? 'var(--gris)' : 'var(--gris-clair)';

  switch (screen.layout) {
    case 'noir-vide':
      return null;

    case 'ligne-seule':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div style={{ ...serif(80, 420), fontSize: 92, color: 'var(--blanc)' }}>
            {screen.donnees.texte}
          </div>
        </div>
      );

    case 'chiffre-verdict': {
      const vers = parseNombre(screen.donnees.valeur);
      return (
        <div
          className="absolute whitespace-nowrap"
          style={{
            left: 118,
            top: '50%',
            transform: 'translateY(-53%)',
            ...serif(144, 'var(--wght-verdict)'),
            fontSize: 588,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: 'var(--blanc)',
          }}
        >
          <CompteurChiffre
            de={0}
            vers={vers}
            dureeMs={900}
            actif={live}
            format={(n) => {
              const s = Math.abs(n).toFixed(2).replace('.', ',');
              return `${n < 0 ? '−' : ''}${s}`;
            }}
          />
          <span style={{ fontSize: '0.62em', marginLeft: '0.04em' }}>%</span>
        </div>
      );
    }

    case 'sommaire':
      return (
        <div className="absolute" style={{ left: 160, top: 300, color: couleurTexte }}>
          {screen.donnees.lignes.map((ligne, i) => (
            <Entree key={ligne} live={live} delaiS={0.15 + i * 0.22} className="mb-14 flex items-baseline">
              <span
                className="etiquette"
                style={{ color: couleurSecondaire, width: 110, display: 'inline-block' }}
              >
                0{i + 1}
              </span>
              <span style={{ ...serif(72, 'var(--wght-titre)'), fontSize: 84 }}>{ligne}</span>
            </Entree>
          ))}
        </div>
      );

    case 'parcours': {
      const etapes = screen.donnees.etapes;
      const x0 = 160;
      const x1 = 1760;
      const pas = (x1 - x0) / (etapes.length - 1);
      return (
        <div className="absolute inset-0" style={{ color: couleurTexte }}>
          <motion.div
            className="absolute"
            style={{
              left: x0,
              top: 560,
              width: x1 - x0,
              height: 2,
              background: 'var(--encre)',
              opacity: 0.25,
              transformOrigin: 'left center',
            }}
            initial={live ? { scaleX: 0 } : false}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: EASE_ENTREE }}
          />
          {etapes.map((e, i) => {
            const haut = i % 2 === 0;
            return (
              <Entree key={e.libelle} live={live} delaiS={0.2 + i * 0.14}>
                <div
                  className="absolute"
                  style={{ left: x0 + i * pas - 7, top: 553, width: 14, height: 14, borderRadius: 99, background: 'var(--encre)' }}
                />
                <div
                  className="absolute"
                  style={{
                    left: x0 + i * pas - 130,
                    top: haut ? 430 : 606,
                    width: 260,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontFamily: GROTESQUE, fontWeight: 600, fontSize: 30, lineHeight: 1.2 }}>
                    {e.libelle}
                  </div>
                  {e.detail && (
                    <div style={{ fontFamily: GROTESQUE, fontSize: 28, color: couleurSecondaire, marginTop: 6 }}>
                      {e.detail}
                    </div>
                  )}
                </div>
              </Entree>
            );
          })}
        </div>
      );
    }

    case 'citation-seule':
      return (
        <div
          className="absolute"
          style={{
            left: 160,
            top: '50%',
            transform: 'translateY(-50%)',
            maxWidth: 1560,
            ...serif(60, 'var(--wght-texte)'),
            fontSize: 66,
            lineHeight: 1.32,
            color: couleurTexte,
          }}
        >
          {screen.donnees.texte}
        </div>
      );

    case 'deux-cotes': {
      const d = screen.donnees;
      const transparence = estRevele(screen, faits, 'transparence');
      return (
        <div className="absolute inset-0" style={{ color: couleurTexte }}>
          {[
            { cote: d.gauche, x: 160 },
            { cote: d.droite, x: 1100 },
          ].map(({ cote, x }, ci) => (
            <Entree key={cote.titre} live={live} delaiS={0.15 + ci * 0.2} className="absolute" style={{ left: x, top: 160, width: 660 }}>
              <div className="etiquette" style={{ color: couleurSecondaire, marginBottom: 28 }}>
                {cote.titre}
              </div>
              {cote.items.map((it) => (
                <div key={it.nom} style={{ marginBottom: 22 }}>
                  <div style={{ ...serif(40, 'var(--wght-titre)'), fontSize: 44 }}>{it.nom}</div>
                  <div style={{ fontFamily: GROTESQUE, fontSize: 28, color: couleurSecondaire }}>{it.role}</div>
                </div>
              ))}
            </Entree>
          ))}
          <div
            className="absolute"
            style={{ left: 958, top: 170, width: 2, height: 380, background: 'var(--encre)', opacity: 0.15 }}
          />
          <Entree live={live} delaiS={0.55} className="absolute flex gap-6" style={{ left: 160, top: 640 }}>
            {d.pastilles.map((p) => (
              <div
                key={p}
                style={{
                  fontFamily: GROTESQUE,
                  fontSize: 28,
                  fontWeight: 500,
                  padding: '16px 28px',
                  border: '1.5px solid rgba(16,20,31,0.3)',
                  borderRadius: 999,
                }}
              >
                {p}
              </div>
            ))}
          </Entree>
          <Entree
            visible={transparence}
            live={live}
            className="absolute"
            style={{
              left: 160,
              top: 790,
              right: 160,
              borderTop: '2px solid var(--encre)',
              paddingTop: 30,
            }}
          >
            <div className="etiquette" style={{ color: couleurSecondaire, marginBottom: 18 }}>
              Transparence
            </div>
            <div className="flex gap-14">
              {d.transparence.map((t) => (
                <div key={t} style={{ fontFamily: GROTESQUE, fontSize: 30, maxWidth: 520 }}>
                  {t}
                </div>
              ))}
            </div>
          </Entree>
        </div>
      );
    }

    case 'titre-plein':
      return (
        <div
          className="absolute"
          style={{
            left: 140,
            top: '50%',
            transform: 'translateY(-50%)',
            maxWidth: 1640,
            ...serif(120, 'var(--wght-titre)'),
            fontSize: 128,
            lineHeight: 1.12,
            letterSpacing: '-0.015em',
            color: 'var(--blanc)',
          }}
        >
          {screen.donnees.titre}
        </div>
      );

    case 'arithmetique': {
      const d = screen.donnees;
      const cibles = ['ligne-1', 'ligne-2', 'ligne-3'];
      return (
        <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
          <div className="etiquette absolute" style={{ left: 140, top: 92, color: 'var(--gris-clair)' }}>
            {d.kicker}
          </div>
          <div className="absolute" style={{ left: 140, top: 178 }}>
            {d.lignes.map((ligne, i) => {
              const derniere = i === 2;
              return (
                <Entree key={ligne.label} visible={estRevele(screen, faits, cibles[i])} live={live} className="mb-12">
                  <div
                    className="etiquette"
                    style={{ color: derniere ? 'var(--blanc)' : 'var(--gris-clair)', marginBottom: 10 }}
                  >
                    {ligne.label}
                  </div>
                  <div
                    style={{
                      ...serif(144, derniere ? 500 : 'var(--wght-valeur)'),
                      fontSize: derniere ? 188 : 118,
                      lineHeight: 0.94,
                      letterSpacing: '-0.02em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <ValeurAvecOps valeur={ligne.valeur} />
                  </div>
                </Entree>
              );
            })}
          </div>
          <div className="absolute flex justify-between" style={{ left: 140, right: 140, top: 826 }}>
            <span className="etiquette" style={{ color: 'var(--gris-clair)' }}>{d.legendeBarre.gauche}</span>
            <span className="etiquette" style={{ color: 'var(--gris-clair)' }}>{d.legendeBarre.droite}</span>
          </div>
          <div
            className="absolute"
            style={{ left: 140, bottom: 44, fontFamily: GROTESQUE, fontSize: 28, color: 'var(--gris-clair)' }}
          >
            {d.source}
          </div>
        </div>
      );
    }

    case 'lignes-comptes': {
      const d = screen.donnees;
      return (
        <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
          <div className="etiquette absolute" style={{ left: 140, top: 92, color: 'var(--gris-clair)' }}>
            {d.kicker}
          </div>
          <div className="absolute" style={{ left: 140, right: 140, top: 190 }}>
            {d.lignes.map((l, i) => (
              <Entree key={l.label} live={live} delaiS={0.15 + i * 0.18}>
                <div
                  className="flex items-baseline justify-between"
                  style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.22)' }}
                >
                  <span style={{ fontFamily: GROTESQUE, fontSize: 34, color: 'var(--gris-clair)' }}>{l.label}</span>
                  <span style={{ ...serif(96, 'var(--wght-valeur)'), fontSize: 84, lineHeight: 1.15, whiteSpace: 'nowrap' }}>
                    <ValeurAvecOps valeur={l.valeur} />
                  </span>
                </div>
              </Entree>
            ))}
            <Entree live={live} delaiS={0.9}>
              <div style={{ ...serif(44, 'var(--wght-texte)'), fontStyle: 'italic', fontSize: 42, marginTop: 30, maxWidth: 1400 }}>
                {d.chute}
              </div>
            </Entree>
          </div>
        </div>
      );
    }

    case 'figure-enquete': {
      const d = screen.donnees;
      return (
        <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
          <div className="etiquette absolute" style={{ left: 140, top: 92, color: 'var(--gris-clair)' }}>
            {d.kicker}
          </div>
          <div className="absolute" style={{ left: 140, top: 220 }}>
            {d.barres.map((b, i) => (
              <Entree key={b.label} live={live} delaiS={0.2 + i * 0.25} className="mb-16">
                <div style={{ fontFamily: GROTESQUE, fontSize: 32, marginBottom: 16, maxWidth: 1300 }}>{b.label}</div>
                <div className="flex items-center gap-3">
                  {Array.from({ length: b.total }, (_, j) => (
                    <div
                      key={j}
                      style={{
                        width: 52,
                        height: 52,
                        background: j < b.valeur ? 'var(--blanc)' : 'transparent',
                        boxShadow: j < b.valeur ? 'none' : 'inset 0 0 0 1.5px rgba(185,189,196,0.5)',
                      }}
                    />
                  ))}
                  <span style={{ ...serif(56, 'var(--wght-valeur)'), fontSize: 56, marginLeft: 28 }}>
                    {b.valeur}/{b.total}
                  </span>
                </div>
              </Entree>
            ))}
            <Entree live={live} delaiS={1}>
              <div style={{ fontFamily: GROTESQUE, fontSize: 32, color: 'var(--gris-clair)', maxWidth: 1200, marginTop: 20 }}>
                {d.lecture}
              </div>
            </Entree>
          </div>
          {/* le baptême n° 1 (v3) : le terme n'apparaît qu'au moment où il est prononcé */}
          <Entree
            visible={estRevele(screen, faits, 'terme-deflation')}
            live={live}
            dureeS={0.9}
            className="absolute"
            style={{ left: 140, bottom: 100 }}
          >
            <div
              style={{
                ...serif(144, 'var(--wght-titre)'),
                fontSize: 128,
                letterSpacing: '-0.02em',
                color: 'var(--blanc)',
              }}
            >
              {d.terme}
            </div>
          </Entree>
          <Maquette screen={screen} note="figure D3 définitive à l'étape 4" />
        </div>
      );
    }

    case 'terme-seul':
      return (
        <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
          <div
            className="absolute"
            style={{
              left: 140,
              top: '46%',
              transform: 'translateY(-50%)',
              ...serif(144, 'var(--wght-titre)'),
              fontSize: 150,
              letterSpacing: '-0.02em',
            }}
          >
            {screen.donnees.terme}
          </div>
          {screen.donnees.sousLigne && (
            <div
              className="absolute"
              style={{ left: 144, top: '60%', fontFamily: GROTESQUE, fontSize: 32, color: 'var(--gris-clair)' }}
            >
              {screen.donnees.sousLigne}
            </div>
          )}
        </div>
      );

    case 'trois-colonnes': {
      const d = screen.donnees;
      return (
        <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
          {d.colonnes.map((c, i) => (
            <Entree
              key={c.titre}
              live={live}
              delaiS={0.15 + i * 0.18}
              className="absolute"
              style={{ left: 140 + i * 560, top: 200, width: 500 }}
            >
              <div className="etiquette" style={{ color: 'var(--gris-clair)', marginBottom: 24 }}>{c.titre}</div>
              <div style={{ ...serif(72, 'var(--wght-valeur)'), fontSize: 64, marginBottom: 34, minHeight: 150 }}>
                {c.montant}
              </div>
              {c.details.map((det) => (
                <div
                  key={det}
                  style={{
                    fontFamily: GROTESQUE,
                    fontSize: 29,
                    color: 'var(--gris-clair)',
                    padding: '14px 0',
                    borderTop: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {det}
                </div>
              ))}
            </Entree>
          ))}
          <Maquette screen={screen} />
        </div>
      );
    }

    case 'pyramide-diamant': {
      const morph = estRevele(screen, faits, 'morph-diamant');
      return (
        <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
          <div className="absolute" style={{ left: 460, top: 200, width: 1000, height: 620 }}>
            <svg viewBox="0 0 1000 620" width="1000" height="620">
              <motion.path
                initial={false}
                animate={{
                  d: morph
                    ? 'M 500 40 L 780 310 L 500 580 L 220 310 Z'
                    : 'M 500 40 L 860 580 L 140 580 Z',
                }}
                transition={{ duration: 1.6, ease: EASE_MORPH }}
                fill="none"
                stroke="white"
                strokeWidth="3"
              />
            </svg>
          </div>
          <div className="etiquette absolute" style={{ left: 140, top: 92, color: 'var(--gris-clair)' }}>
            {morph ? screen.donnees.apres : screen.donnees.avant}
          </div>
          <Entree visible={morph} live={live} delaiS={0.9} className="absolute" style={{ left: 0, right: 0, top: 486, textAlign: 'center' }}>
            <span style={{ ...serif(44, 'var(--wght-titre)'), fontSize: 44 }}>{screen.donnees.centre}</span>
          </Entree>
          <Maquette screen={screen} note="morphing définitif à l'étape 4" />
        </div>
      );
    }

    case 'simulateur':
      if (!sim) return null;
      return <Simulateur params={sim} live={live} />;

    case 'quatre-etages': {
      const d = screen.donnees;
      return (
        <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
          {d.etages.map((e, i) => (
            <Entree
              key={e.nom}
              live={live}
              delaiS={0.25 + i * 0.16}
              className="absolute"
              style={{ left: 920, top: 292 + i * 116, width: 860 }}
            >
              <div className="flex items-baseline gap-6">
                <span style={{ ...serif(52, 'var(--wght-titre)'), fontSize: 52 }}>{e.nom}</span>
                <span style={{ fontFamily: GROTESQUE, fontSize: 32, color: 'var(--gris-clair)' }}>{e.metrique}</span>
              </div>
              <div style={{ fontFamily: GROTESQUE, fontSize: 28, color: 'var(--gris-clair)', marginTop: 4 }}>
                {e.ancrage}
              </div>
            </Entree>
          ))}
          <Maquette screen={screen} />
        </div>
      );
    }

    case 'verrous': {
      const d = screen.donnees;
      return (
        <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
          {d.verrous.map((v, i) => {
            const barre = estBarre(screen, faits, `verrou-${i + 1}`);
            return (
              <Entree key={v.nom} live={live} delaiS={0.2 + i * 0.15} className="absolute" style={{ left: 520, top: 210 + i * 250, width: 1260 }}>
                <motion.div initial={false} animate={{ opacity: barre ? 0.38 : 1 }} transition={{ duration: 0.5, ease: EASE_ENTREE }}>
                  <div className="relative inline-block">
                    <span style={{ ...serif(64, 'var(--wght-titre)'), fontSize: 64 }}>{v.nom}</span>
                    <motion.div
                      className="absolute"
                      style={{ left: -8, right: -8, top: '54%', height: 4, background: 'var(--blanc)', transformOrigin: 'left center' }}
                      initial={false}
                      animate={{ scaleX: barre ? 1 : 0 }}
                      transition={{ duration: 0.45, ease: EASE_ENTREE }}
                    />
                  </div>
                  <div style={{ fontFamily: GROTESQUE, fontSize: 30, color: 'var(--gris-clair)', marginTop: 8 }}>
                    {v.objection}
                  </div>
                  <div style={{ fontFamily: GROTESQUE, fontSize: 32, marginTop: 6 }}>{v.parade}</div>
                </motion.div>
              </Entree>
            );
          })}
          <Maquette screen={screen} />
        </div>
      );
    }

    case 'frise-24-mois': {
      const d = screen.donnees;
      const allumes = objetEtat.kind === 'frise' ? objetEtat.allumes : 0;
      const parts = [3, 6, 3, 12];
      const total = 24;
      const w = 1640;
      const gap = 12;
      const unite = (w - 3 * gap) / total;
      let x = 0;
      return (
        <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
          <div className="etiquette absolute" style={{ left: 140, top: 92, color: 'var(--gris-clair)' }}>
            Vingt-quatre mois, quatre segments
          </div>
          {d.segments.map((s, i) => {
            const left = 140 + x;
            x += parts[i] * unite + gap;
            const actif = i < allumes;
            return (
              <div
                key={s.nom}
                className="absolute overflow-hidden"
                style={{ left, top: 600, width: parts[i] * unite, height: 300 }}
              >
                <motion.div initial={false} animate={{ opacity: actif ? 1 : 0.32 }} transition={{ duration: 0.5, ease: EASE_ENTREE }}>
                  <div style={{ fontFamily: GROTESQUE, fontWeight: 600, fontSize: 34 }}>{s.periode}</div>
                  {s.decisions.map((dec) => (
                    <div key={dec} style={{ fontFamily: GROTESQUE, fontSize: 28, lineHeight: 1.25, color: 'var(--gris-clair)', marginTop: 10, maxWidth: parts[i] * unite - 16 }}>
                      {dec}
                    </div>
                  ))}
                </motion.div>
              </div>
            );
          })}
          <Entree visible={estRevele(screen, faits, 'ligne-crete')} live={live} className="absolute" style={{ left: 140, top: 952, maxWidth: 1640 }}>
            <div style={{ ...serif(36, 'var(--wght-texte)'), fontStyle: 'italic', fontSize: 36 }}>
              {d.ligneDeCrete}
            </div>
          </Entree>
          <Maquette screen={screen} note="morphing et détail à l'étape 4" />
        </div>
      );
    }

    case 'trois-suites':
      return (
        <div className="absolute" style={{ left: 160, top: 300, color: couleurTexte }}>
          {screen.donnees.suites.map((s, i) => (
            <Entree key={s} live={live} delaiS={0.15 + i * 0.22} className="mb-16 flex items-baseline">
              <span className="etiquette" style={{ color: couleurSecondaire, width: 110, display: 'inline-block' }}>
                0{i + 1}
              </span>
              <span style={{ ...serif(52, 'var(--wght-titre)'), fontSize: 54, maxWidth: 1440, display: 'inline-block' }}>
                {s}
              </span>
            </Entree>
          ))}
        </div>
      );

    case 'renversement': {
      const p1 = estRevele(screen, faits, 'phrase-1');
      const p2 = estRevele(screen, faits, 'phrase-2');
      return (
        <div
          className="absolute"
          style={{
            left: 160,
            top: '50%',
            transform: 'translateY(-50%)',
            maxWidth: 1560,
            ...serif(60, 'var(--wght-texte)'),
            fontSize: 82,
            lineHeight: 1.24,
          }}
        >
          <Entree visible={p1} live={live} dureeS={0.9}>
            <motion.div
              initial={false}
              animate={{ color: p2 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,1)' }}
              transition={{ duration: 0.8, ease: EASE_ENTREE }}
              style={{ marginBottom: 64 }}
            >
              {screen.donnees.phrase1}
            </motion.div>
          </Entree>
          <Entree visible={p2} live={live} dureeS={0.9}>
            <div style={{ color: 'var(--blanc)', fontWeight: 400 }}>{screen.donnees.phrase2}</div>
          </Entree>
        </div>
      );
    }
  }
}
