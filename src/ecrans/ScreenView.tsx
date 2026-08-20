import { AnimatePresence, motion } from 'motion/react';
import type { CSSProperties } from 'react';
import type { ObjetEtat, Screen, SimulateurParams } from '../types';
import { EASE_ENTREE, EASE_MORPH } from '../moteur/motion';
import { CompteurChiffre } from './CompteurChiffre';
import { Masque } from './Masque';
import { TitreAnime } from './TitreAnime';
import { Entree, estBarre, estRevele } from './utils';
import { Simulateur } from '../simulateur/Simulateur';

/*
 * Les écrans, version définitive (étape 4).
 * Règles : l’écran montre, la parole nomme; les chiffres entrent en
 * animation, jamais en pavé; un seul mouvement à la fois; aucun texte
 * au-dessous de 28 px; aucun tiret cadratin dans les textes affichés.
 */

const SERIF = 'var(--serif)';
const GROTESQUE = 'var(--grotesque)';

function serif(opsz: number, poids: string | number): CSSProperties {
  return {
    fontFamily: SERIF,
    fontVariationSettings: `'opsz' ${opsz}`,
    fontWeight: poids as CSSProperties['fontWeight'],
  };
}

/** opérateurs mathématiques recalibrés : opsz bas = traits pleins, lisibles au projecteur */
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

/** un chiffre-événement : les opérateurs posés, les chiffres qui comptent */
function ValeurAnimee({
  valeur,
  actif,
  dureeMs = 900,
}: {
  valeur: string;
  actif: boolean;
  dureeMs?: number;
}) {
  const m = /^([^0-9]*)(\d+(?:,\d+)?)(.*)$/.exec(valeur);
  if (!m) return <ValeurAvecOps valeur={valeur} />;
  const [, prefixe, nombre, suffixe] = m;
  const cible = parseFloat(nombre.replace(',', '.'));
  const decimales = nombre.includes(',') ? nombre.split(',')[1].length : 0;
  return (
    <>
      {prefixe && <ValeurAvecOps valeur={prefixe} />}
      <CompteurChiffre
        de={0}
        vers={cible}
        dureeMs={dureeMs}
        actif={actif}
        format={(n) => Math.abs(n).toFixed(decimales).replace('.', ',')}
      />
      {suffixe && <ValeurAvecOps valeur={suffixe} />}
    </>
  );
}

function parseNombre(valeur: string): number {
  const m = /-?−?\d+(?:,\d+)?/.exec(valeur.replace('−', '-'));
  return m ? parseFloat(m[0].replace('−', '-').replace(',', '.')) : 0;
}

function Kicker({ texte, sombre = false }: { texte: string; sombre?: boolean }) {
  return (
    <div
      className="etiquette absolute"
      style={{ left: 140, top: 92, color: sombre ? 'var(--gris)' : 'var(--gris-clair)' }}
    >
      {texte}
    </div>
  );
}

/* ---------- la pyramide de points qui devient diamant (E14) ---------- */

const DOT = 40;
const DOT_GAP_X = 18;
const DOT_PITCH_Y = 64;

function rangée(n: number, cx: number, y: number): { x: number; y: number }[] {
  const largeur = n * DOT + (n - 1) * DOT_GAP_X;
  return Array.from({ length: n }, (_, i) => ({ x: cx - largeur / 2 + i * (DOT + DOT_GAP_X), y }));
}

/** 36 points; la base est ordonnée centre d’abord, pour que les 7 fantômes
    (les recrutements qui ne se font pas) restent aux extrémités de la base */
function positionsPyramide(): { x: number; y: number }[] {
  const cx = 960;
  const y0 = 236;
  const pos: { x: number; y: number }[] = [];
  [1, 3, 5, 7, 9].forEach((n, r) => pos.push(...rangée(n, cx, y0 + r * DOT_PITCH_Y)));
  const base = rangée(11, cx, y0 + 5 * DOT_PITCH_Y);
  const ordre = [5, 4, 6, 3, 7, 2, 8, 1, 9, 0, 10]; // centre → extrémités
  ordre.forEach((i) => pos.push(base[i]));
  return pos;
}

/** 29 places du diamant : les 7 dernières unités de la pyramide n’y entrent pas */
function positionsDiamant(): { x: number; y: number }[] {
  const cx = 960;
  const y0 = 224;
  const pos: { x: number; y: number }[] = [];
  [1, 3, 6, 9, 6, 3, 1].forEach((n, r) => pos.push(...rangée(n, cx, y0 + r * (DOT_PITCH_Y - 6))));
  return pos;
}

function PyramideDiamant({
  morph,
  live,
  avant,
  apres,
  centre,
}: {
  morph: boolean;
  live: boolean;
  avant: string;
  apres: string;
  centre: string;
}) {
  const pyr = positionsPyramide();
  const dia = positionsDiamant();
  return (
    <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
      <Kicker texte={morph ? apres : avant} />
      {pyr.map((p, i) => {
        const fantome = morph && i >= dia.length;
        const cible = morph && i < dia.length ? dia[i] : p;
        return (
          <motion.div
            key={i}
            className="absolute"
            initial={live && !morph ? { opacity: 0, y: p.y + 24, x: p.x } : false}
            animate={{
              x: cible.x,
              y: cible.y,
              opacity: 1,
              backgroundColor: fantome ? 'rgba(255,255,255,0)' : 'rgba(255,255,255,1)',
              boxShadow: fantome
                ? 'inset 0 0 0 1.5px rgba(185,189,196,0.5)'
                : 'inset 0 0 0 0px rgba(185,189,196,0)',
            }}
            transition={{ duration: live ? 1.6 : 0, ease: EASE_MORPH, delay: live ? i * 0.015 : 0 }}
            style={{ left: 0, top: 0, width: DOT, height: DOT }}
          />
        );
      })}
      {/* légendes de la pyramide, avant la métamorphose */}
      <motion.div
        className="absolute"
        initial={live ? { opacity: 0 } : false}
        animate={{ opacity: morph ? 0 : 1 }}
        transition={{ duration: 0.6, ease: EASE_ENTREE, delay: morph ? 0 : 0.9 }}
        style={{ left: 140, top: 690, width: 420 }}
      >
        <div style={{ fontFamily: GROTESQUE, fontSize: 30, color: 'var(--gris-clair)', lineHeight: 1.4 }}>
          La base large : les juniors, dont on vendait les journées avec marge.
        </div>
      </motion.div>
      <motion.div
        className="absolute"
        initial={live ? { opacity: 0 } : false}
        animate={{ opacity: morph ? 0 : 1 }}
        transition={{ duration: 0.6, ease: EASE_ENTREE, delay: morph ? 0 : 1.1 }}
        style={{ right: 140, top: 236, width: 380, textAlign: 'right' }}
      >
        <div style={{ fontFamily: GROTESQUE, fontSize: 30, color: 'var(--gris-clair)', lineHeight: 1.4 }}>
          Au sommet : les seniors.
        </div>
      </motion.div>
      <Entree visible={morph} live={live} delaiS={1.2} className="absolute" style={{ left: 140, top: 690, width: 420 }}>
        <div style={{ fontFamily: GROTESQUE, fontSize: 30, color: 'var(--gris-clair)', lineHeight: 1.4 }}>
          Aux extrémités de l’ancienne base : les recrutements qui ne se font pas.
        </div>
      </Entree>
      <Entree visible={morph} live={live} delaiS={1.5} className="absolute" style={{ right: 140, top: 690, width: 420, textAlign: 'right' }}>
        <div style={{ ...serif(44, 'var(--wght-titre)'), fontSize: 44 }}>{centre}</div>
        <div style={{ fontFamily: GROTESQUE, fontSize: 28, color: 'var(--gris-clair)', marginTop: 8 }}>
          au centre du diamant
        </div>
      </Entree>
    </div>
  );
}

/* ---------- le composant principal ---------- */

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
          <Masque live={live}>
            <motion.div
              initial={live ? { letterSpacing: '0.1em' } : false}
              animate={{ letterSpacing: '0.005em' }}
              transition={{ duration: 1.4, ease: EASE_ENTREE }}
              style={{ ...serif(80, 420), fontSize: 92, color: 'var(--blanc)' }}
            >
              {screen.donnees.texte}
            </motion.div>
          </Masque>
        </div>
      );

    case 'chiffre-verdict': {
      const vers = parseNombre(screen.donnees.valeur);
      return (
        <motion.div
          className="absolute whitespace-nowrap"
          initial={live ? { scale: 1.035, fontWeight: 320 } : false}
          animate={{ scale: 1, fontWeight: 560 }}
          transition={{ duration: 1.3, ease: EASE_ENTREE }}
          style={{
            left: 118,
            top: '50%',
            translateY: '-53%',
            ...serif(144, 'var(--wght-verdict)'),
            fontSize: 588,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: 'var(--blanc)',
            transformOrigin: '30% 50%',
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
        </motion.div>
      );
    }

    case 'sommaire':
    case 'trois-suites': {
      const lignes = screen.layout === 'sommaire' ? screen.donnees.lignes : screen.donnees.suites;
      const taille = screen.layout === 'sommaire' ? 84 : 54;
      return (
        <div className="absolute" style={{ left: 160, top: 280, right: 160, color: couleurTexte }}>
          {lignes.map((ligne, i) => (
            <div key={ligne} style={{ marginBottom: 26 }}>
              <div className="flex items-baseline">
                <span
                  className="etiquette"
                  style={{ color: couleurSecondaire, width: 110, flex: '0 0 auto' }}
                >
                  0{i + 1}
                </span>
                <Masque live={live} delaiS={0.15 + i * 0.18}>
                  <span style={{ ...serif(72, 'var(--wght-titre)'), fontSize: taille, lineHeight: 1.18, display: 'inline-block', maxWidth: 1440 }}>
                    {ligne}
                  </span>
                </Masque>
              </div>
              <motion.div
                initial={live ? { scaleX: 0 } : false}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, ease: EASE_ENTREE, delay: 0.35 + i * 0.18 }}
                style={{
                  height: 1.5,
                  marginTop: 24,
                  background: surPapier ? 'rgba(16,20,31,0.18)' : 'rgba(255,255,255,0.2)',
                  transformOrigin: 'left center',
                }}
              />
            </div>
          ))}
        </div>
      );
    }

    case 'parcours': {
      const etapes = screen.donnees.etapes;
      const x0 = 170;
      const x1 = 1750;
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
              opacity: 0.22,
              transformOrigin: 'left center',
            }}
            initial={live ? { scaleX: 0 } : false}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: EASE_ENTREE }}
          />
          {etapes.map((e, i) => {
            const haut = i % 2 === 0;
            return (
              <Entree key={e.libelle} live={live} delaiS={0.25 + i * 0.13}>
                <div
                  className="absolute"
                  style={{ left: x0 + i * pas - 9, top: 552, width: 18, height: 18, background: 'var(--encre)' }}
                />
                <div
                  className="absolute"
                  style={
                    haut
                      ? { left: x0 + i * pas - 140, bottom: 1080 - 538, width: 280, textAlign: 'center' }
                      : { left: x0 + i * pas - 140, top: 608, width: 280, textAlign: 'center' }
                  }
                >
                  <div style={{ ...serif(36, 'var(--wght-titre)'), fontSize: 34, lineHeight: 1.22 }}>{e.libelle}</div>
                  {e.detail && (
                    <div style={{ fontFamily: GROTESQUE, fontSize: 28, color: couleurSecondaire, marginTop: 8, lineHeight: 1.3 }}>
                      {e.detail}
                    </div>
                  )}
                </div>
              </Entree>
            );
          })}
          {screen.donnees.citation && (
            <Entree
              visible={estRevele(screen, faits, 'citation')}
              live={live}
              className="absolute"
              style={{ left: 170, top: 824, maxWidth: 1580 }}
            >
              <div style={{ ...serif(46, 'var(--wght-texte)'), fontStyle: 'italic', fontSize: 46, lineHeight: 1.3 }}>
                {screen.donnees.citation.texte}
              </div>
              <div style={{ fontFamily: GROTESQUE, fontSize: 28, color: couleurSecondaire, marginTop: 14 }}>
                {screen.donnees.citation.attribution}
              </div>
            </Entree>
          )}
        </div>
      );
    }

    case 'citation-seule': {
      // la question entre mot à mot, comme la page de garde : cinétique, jamais une glissade
      const mots = screen.donnees.texte.split(' ');
      return (
        <div className="absolute inset-0" style={{ color: couleurTexte }}>
          <div className="etiquette absolute" style={{ left: 160, top: 150, color: couleurSecondaire }}>
            La problématique
          </div>
          <div className="absolute" style={{ left: 160, top: '50%', transform: 'translateY(-50%)', maxWidth: 1580 }}>
            <div style={{ ...serif(60, 'var(--wght-texte)'), fontSize: 64, lineHeight: 1.34 }} aria-label={screen.donnees.texte} role="text">
              {mots.map((m, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    overflow: 'hidden',
                    verticalAlign: 'top',
                    whiteSpace: 'pre',
                    padding: '0.08em 0.03em 0.16em',
                    margin: '-0.08em -0.03em -0.16em',
                  }}
                >
                  <motion.span
                    style={{ display: 'inline-block' }}
                    initial={live ? { y: '112%', opacity: 0 } : false}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{ duration: 0.6, ease: EASE_ENTREE, delay: 0.08 + i * 0.038 }}
                  >
                    {m + (i < mots.length - 1 ? ' ' : '')}
                  </motion.span>
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case 'deux-cotes': {
      const d = screen.donnees;
      const transparence = estRevele(screen, faits, 'transparence');
      return (
        <div className="absolute inset-0" style={{ color: couleurTexte }}>
          {[
            { cote: d.gauche, x: 160, dir: -1 },
            { cote: d.droite, x: 1140, dir: 1 },
          ].map(({ cote, x, dir }) => (
            <motion.div
              key={cote.titre}
              className="absolute"
              initial={live ? { opacity: 0, x: x + dir * -46 } : false}
              animate={{ opacity: 1, x }}
              transition={{ duration: 0.8, ease: EASE_ENTREE, delay: 0.15 }}
              style={{ left: 0, top: 150, width: 620 }}
            >
              <div className="etiquette" style={{ color: couleurSecondaire, marginBottom: 34 }}>
                {cote.titre}
              </div>
              {cote.items.map((it) => (
                <div key={it.nom} style={{ marginBottom: 30 }}>
                  <div style={{ ...serif(44, 'var(--wght-titre)'), fontSize: 46 }}>{it.nom}</div>
                  <div style={{ fontFamily: GROTESQUE, fontSize: 28, color: couleurSecondaire, marginTop: 4 }}>
                    {it.role}
                  </div>
                </div>
              ))}
            </motion.div>
          ))}
          <motion.div
            className="absolute"
            initial={live ? { scaleY: 0 } : false}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.9, ease: EASE_ENTREE, delay: 0.4 }}
            style={{ left: 952, top: 160, width: 1.5, height: 420, background: 'var(--encre)', opacity: 0.25, transformOrigin: 'top center' }}
          />
          <motion.div
            className="absolute"
            initial={live ? { scaleY: 0 } : false}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.9, ease: EASE_ENTREE, delay: 0.5 }}
            style={{ left: 964, top: 160, width: 1.5, height: 420, background: 'var(--encre)', opacity: 0.25, transformOrigin: 'top center' }}
          />
          <Entree live={live} delaiS={0.6} className="absolute flex gap-6" style={{ left: 160, top: 680 }}>
            {d.pastilles.map((p) => (
              <div
                key={p}
                style={{
                  fontFamily: GROTESQUE,
                  fontSize: 29,
                  fontWeight: 500,
                  padding: '16px 30px',
                  border: '1.5px solid rgba(16,20,31,0.32)',
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
            style={{ left: 160, top: 810, right: 160, borderTop: '2px solid var(--encre)', paddingTop: 32 }}
          >
            <div className="etiquette" style={{ color: couleurSecondaire, marginBottom: 20 }}>
              Transparence
            </div>
            <div className="flex gap-14">
              {d.transparence.map((t) => (
                <div key={t} style={{ fontFamily: GROTESQUE, fontSize: 30, maxWidth: 520, lineHeight: 1.35 }}>
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
          style={{ left: 140, top: '50%', transform: 'translateY(-50%)', maxWidth: 1640, color: 'var(--blanc)' }}
        >
          <TitreAnime
            texte={screen.donnees.titre}
            live={live}
            style={{
              ...serif(120, 'var(--wght-titre)'),
              fontSize: 128,
              lineHeight: 1.12,
              letterSpacing: '-0.015em',
            }}
          />
        </div>
      );

    case 'arithmetique': {
      const d = screen.donnees;
      const cibles = ['ligne-1', 'ligne-2', 'ligne-3'];
      return (
        <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
          <Kicker texte={d.kicker} />
          <div className="absolute" style={{ left: 140, top: 178 }}>
            {d.lignes.map((ligne, i) => {
              const derniere = i === 2;
              const visible = estRevele(screen, faits, cibles[i]);
              return (
                <Entree key={ligne.label} visible={visible} live={live} className="mb-12">
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
                    <ValeurAnimee valeur={ligne.valeur} actif={live} />
                  </div>
                </Entree>
              );
            })}
          </div>
          {d.citation && (
            <Entree
              visible={estRevele(screen, faits, 'citation')}
              live={live}
              className="absolute"
              style={{ left: 1000, top: 186, width: 780 }}
            >
              <div style={{ ...serif(52, 'var(--wght-texte)'), fontStyle: 'italic', fontSize: 52, lineHeight: 1.3 }}>
                {d.citation.texte}
              </div>
              <div style={{ fontFamily: GROTESQUE, fontSize: 28, color: 'var(--gris-clair)', marginTop: 16 }}>
                {d.citation.attribution}
              </div>
            </Entree>
          )}
          <div className="absolute flex justify-between" style={{ left: 140, right: 140, top: 826 }}>
            <span className="etiquette" style={{ color: 'var(--gris-clair)' }}>{d.legendeBarre.gauche}</span>
            <span className="etiquette" style={{ color: 'var(--gris-clair)' }}>{d.legendeBarre.droite}</span>
          </div>
          <div className="absolute" style={{ left: 140, bottom: 44, fontFamily: GROTESQUE, fontSize: 28, color: 'var(--gris-clair)' }}>
            {d.source}
          </div>
        </div>
      );
    }

    case 'lignes-comptes': {
      const d = screen.donnees;
      return (
        <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
          <Kicker texte={d.kicker} />
          <div className="absolute" style={{ left: 140, right: 140, top: 210 }}>
            {d.lignes.map((l, i) => (
              <Entree key={l.label} live={live} delaiS={0.15 + i * 0.22}>
                <div
                  className="flex items-baseline justify-between"
                  style={{ padding: '34px 0', borderBottom: '1px solid rgba(255,255,255,0.22)' }}
                >
                  <span style={{ fontFamily: GROTESQUE, fontSize: 36, color: 'var(--gris-clair)', maxWidth: 1000 }}>
                    {l.label}
                  </span>
                  <span style={{ ...serif(110, 'var(--wght-valeur)'), fontSize: 110, lineHeight: 1, whiteSpace: 'nowrap', fontStyle: /\d/.test(l.valeur) ? 'normal' : 'italic' }}>
                    <ValeurAnimee valeur={l.valeur} actif={live} />
                  </span>
                </div>
              </Entree>
            ))}
            <Entree live={live} delaiS={0.8}>
              <div style={{ ...serif(48, 'var(--wght-texte)'), fontStyle: 'italic', fontSize: 48, marginTop: 56, maxWidth: 1450, lineHeight: 1.3 }}>
                {d.chute}
              </div>
            </Entree>
          </div>
        </div>
      );
    }

    case 'figure-enquete': {
      const d = screen.donnees;
      const bapteme = estRevele(screen, faits, 'terme-deflation');
      return (
        <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
          <Kicker texte={d.kicker} />
          <motion.div
            className="absolute"
            initial={false}
            animate={{ opacity: bapteme ? 0.42 : 1 }}
            transition={{ duration: 0.8, ease: EASE_ENTREE }}
            style={{ left: 140, top: 200 }}
          >
            {d.barres.map((b, i) => (
              <Entree key={b.label} live={live} delaiS={0.2 + i * 0.3} className="mb-14">
                <div style={{ fontFamily: GROTESQUE, fontSize: 32, marginBottom: 18, maxWidth: 1300 }}>{b.label}</div>
                <div className="flex items-center" style={{ gap: 10 }}>
                  {Array.from({ length: b.total }, (_, j) => (
                    <motion.div
                      key={j}
                      initial={live ? { opacity: 0, scale: 0.6 } : false}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, ease: EASE_ENTREE, delay: live ? 0.35 + i * 0.3 + j * 0.05 : 0 }}
                      style={{
                        width: 56,
                        height: 56,
                        background: j < b.valeur ? 'var(--blanc)' : 'transparent',
                        boxShadow: j < b.valeur ? 'none' : 'inset 0 0 0 1.5px rgba(185,189,196,0.5)',
                      }}
                    />
                  ))}
                  <span style={{ fontFamily: GROTESQUE, fontWeight: 500, fontSize: 60, marginLeft: 30, fontVariantNumeric: 'tabular-nums' }}>
                    <CompteurChiffre de={0} vers={b.valeur} dureeMs={900} actif={live} format={(n) => `${Math.round(n)}`} />
                    <span style={{ color: 'var(--gris-clair)' }}>/{b.total}</span>
                  </span>
                </div>
              </Entree>
            ))}
            <Entree live={live} delaiS={1}>
              <div style={{ fontFamily: GROTESQUE, fontSize: 32, color: 'var(--gris-clair)', maxWidth: 1250, marginTop: 12, lineHeight: 1.4 }}>
                {d.lecture}
              </div>
            </Entree>
          </motion.div>
          {/* le baptême n° 1 : le terme n’apparaît qu’au moment où il est prononcé */}
          <div className="absolute" style={{ left: 140, bottom: 96 }}>
            {bapteme && (
              <TitreAnime
                texte={d.terme}
                live={live}
                dureeS={0.8}
                decalageS={0.024}
                style={{ ...serif(144, 'var(--wght-titre)'), fontSize: 136, letterSpacing: '-0.02em' }}
              />
            )}
          </div>
        </div>
      );
    }

    case 'terme-seul': {
      const d = screen.donnees;
      // le baptême : quand une histoire précède le terme, il n’apparaît qu’à sa nomination
      const termeVisible = screen.steps.length === 0 || estRevele(screen, faits, 'terme');
      return (
        <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
          {d.histoire && (
            <Entree live={live} className="absolute" style={{ left: 140, top: 140, maxWidth: 1640 }}>
              <div className="etiquette" style={{ color: 'var(--gris-clair)' }}>{d.histoire.etiquette}</div>
              <div style={{ ...serif(64, 'var(--wght-texte)'), fontStyle: 'italic', fontSize: 62, lineHeight: 1.25, marginTop: 20 }}>
                {d.histoire.texte}
              </div>
            </Entree>
          )}
          {termeVisible && (
            <div className="absolute" style={{ left: 140, top: d.histoire ? '54%' : '46%', transform: 'translateY(-50%)' }}>
              <motion.div
                initial={live ? { fontWeight: 300 } : false}
                animate={{ fontWeight: 470 }}
                transition={{ duration: 1.4, ease: EASE_ENTREE }}
                style={{
                  fontFamily: SERIF,
                  fontVariationSettings: "'opsz' 144",
                  fontSize: 150,
                  letterSpacing: '-0.02em',
                }}
              >
                <TitreAnime texte={d.terme} live={live} dureeS={0.85} decalageS={0.022} />
              </motion.div>
            </div>
          )}
          {d.sousLigne && termeVisible && (
            <Entree live={live} delaiS={0.7} className="absolute" style={{ left: 144, top: '61%' }}>
              <div style={{ fontFamily: GROTESQUE, fontSize: 32, color: 'var(--gris-clair)' }}>
                {d.sousLigne}
              </div>
            </Entree>
          )}
        </div>
      );
    }

    case 'trois-colonnes': {
      const d = screen.donnees;
      const filet = surPapier ? 'rgba(16,20,31,0.22)' : 'rgba(255,255,255,0.2)';
      return (
        <div className="absolute inset-0" style={{ color: couleurTexte }}>
          {d.colonnes.map((c, i) => (
            <Entree
              key={c.titre}
              live={live}
              delaiS={0.15 + i * 0.18}
              className="absolute"
              style={{ left: 140 + i * 560, top: 220, width: 500 }}
            >
              <div className="etiquette" style={{ color: couleurSecondaire, marginBottom: 28 }}>{c.titre}</div>
              <div style={{ ...serif(72, 'var(--wght-valeur)'), fontSize: 66, lineHeight: 1.05, marginBottom: 40, minHeight: 100 }}>
                <ValeurAnimee valeur={c.montant} actif={live} />
              </div>
              {c.details.map((det) => (
                <div
                  key={det}
                  style={{
                    fontFamily: GROTESQUE,
                    fontSize: 30,
                    color: couleurSecondaire,
                    padding: '18px 0',
                    borderTop: `1px solid ${filet}`,
                    lineHeight: 1.35,
                  }}
                >
                  {det}
                </div>
              ))}
            </Entree>
          ))}
        </div>
      );
    }

    case 'pyramide-diamant':
      return (
        <PyramideDiamant
          morph={estRevele(screen, faits, 'morph-diamant')}
          live={live}
          avant={screen.donnees.avant}
          apres={screen.donnees.apres}
          centre={screen.donnees.centre}
        />
      );

    case 'simulateur':
      if (!sim) return null;
      return <Simulateur params={sim} live={live} />;

    case 'quatre-etages': {
      const d = screen.donnees;
      return (
        <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
          {/* le baptême n° 3 : « prix étagé », prononcé en entrant sur cet écran */}
          <div className="absolute" style={{ left: 140, top: 80 }}>
            <TitreAnime
              texte={d.titre}
              live={live}
              dureeS={0.8}
              decalageS={0.022}
              style={{ ...serif(96, 'var(--wght-titre)'), fontSize: 96, letterSpacing: '-0.015em' }}
            />
          </div>
          {d.etages.map((e, i) => (
            <Entree
              key={e.nom}
              live={live}
              delaiS={0.5 + i * 0.16}
              className="absolute"
              style={{ left: 920, top: 296 + i * 116, width: 860 }}
            >
              <div className="flex items-baseline gap-6">
                <span style={{ ...serif(52, 'var(--wght-titre)'), fontSize: 52 }}>{e.nom}</span>
                <span style={{ fontFamily: GROTESQUE, fontSize: 32, color: 'var(--gris-clair)' }}>{e.metrique}</span>
              </div>
              <div style={{ fontFamily: GROTESQUE, fontSize: 28, color: 'var(--gris-clair)', marginTop: 6 }}>
                {e.ancrage}
              </div>
            </Entree>
          ))}
        </div>
      );
    }

    case 'verrous': {
      const d = screen.donnees;
      const barres = d.verrous.map((_, i) => estBarre(screen, faits, `verrou-${i + 1}`));
      const actif = barres.findIndex((b) => !b);
      const indexActif = actif === -1 ? d.verrous.length - 1 : actif;
      return (
        <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
          <Kicker texte="Trois verrous, trois parades" />
          {d.verrous.map((v, i) => {
            const barre = barres[i];
            const estActif = i === indexActif;
            return (
              <Entree key={v.nom} live={live} delaiS={0.15 + i * 0.14} className="absolute" style={{ left: 140, top: 250 + i * 230 }}>
                <motion.div
                  initial={false}
                  animate={{ opacity: barre ? 0.35 : estActif ? 1 : 0.55 }}
                  transition={{ duration: 0.5, ease: EASE_ENTREE }}
                >
                  <div className="relative inline-block">
                    <span style={{ ...serif(72, 'var(--wght-titre)'), fontSize: 72, whiteSpace: 'nowrap' }}>{v.nom}</span>
                    <motion.div
                      className="absolute"
                      style={{ left: -10, right: -10, top: '55%', height: 4, background: 'var(--blanc)', transformOrigin: 'left center' }}
                      initial={false}
                      animate={{ scaleX: barre ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: EASE_ENTREE }}
                    />
                  </div>
                </motion.div>
              </Entree>
            );
          })}
          <AnimatePresence mode="wait">
            <motion.div
              key={indexActif}
              className="absolute"
              initial={live ? { opacity: 0, y: 30 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              transition={{ duration: 0.6, ease: EASE_ENTREE }}
              style={{ left: 860, top: 260, width: 920 }}
            >
              <div className="etiquette" style={{ color: 'var(--gris-clair)', marginBottom: 22 }}>
                {d.verrous[indexActif].objection}
              </div>
              <div style={{ ...serif(44, 'var(--wght-texte)'), fontSize: 46, lineHeight: 1.32 }}>
                {d.verrous[indexActif].parade}
              </div>
            </motion.div>
          </AnimatePresence>
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
      const actif = allumes > 0 ? allumes - 1 : null;
      return (
        <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
          <Kicker texte="Vingt-quatre mois, quatre segments" />
          {d.segments.map((s, i) => {
            const left = 140 + x;
            x += parts[i] * unite + gap;
            return (
              <motion.div
                key={s.nom}
                className="absolute"
                initial={false}
                animate={{ opacity: i < allumes ? 1 : 0.4 }}
                transition={{ duration: 0.5, ease: EASE_ENTREE }}
                style={{ left, top: 600, width: parts[i] * unite }}
              >
                <div style={{ fontFamily: GROTESQUE, fontWeight: 600, fontSize: 32 }}>{s.periode}</div>
              </motion.div>
            );
          })}
          <AnimatePresence mode="wait">
            {actif !== null && (
              <motion.div
                key={actif}
                className="absolute"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                transition={{ duration: 0.6, ease: EASE_ENTREE }}
                style={{ left: 140, top: 690, width: 1640 }}
              >
                {d.segments[actif].decisions.map((dec, j) => (
                  <motion.div
                    key={dec}
                    className="flex items-baseline"
                    initial={{ opacity: 0, y: 12, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.45, ease: EASE_ENTREE, delay: 0.08 + j * 0.09 }}
                    style={{ padding: '16px 0', borderBottom: j < d.segments[actif].decisions.length - 1 ? '1px solid rgba(255,255,255,0.18)' : 'none' }}
                  >
                    <span className="etiquette" style={{ color: 'var(--gris-clair)', width: 90, flex: '0 0 auto' }}>
                      {String(j + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontFamily: GROTESQUE, fontSize: 38, lineHeight: 1.3 }}>{dec}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute" style={{ left: 140, bottom: 52, maxWidth: 1640 }}>
            <Masque visible={estRevele(screen, faits, 'ligne-crete')} live={live}>
              <div style={{ ...serif(38, 'var(--wght-texte)'), fontStyle: 'italic', fontSize: 38, lineHeight: 1.3 }}>
                {d.ligneDeCrete}
              </div>
            </Masque>
          </div>
        </div>
      );
    }

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
          <Masque visible={p1} live={live} dureeS={1.1}>
            <motion.div
              initial={false}
              animate={{ color: p2 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,1)' }}
              transition={{ duration: 0.8, ease: EASE_ENTREE }}
              style={{ marginBottom: 64, paddingBottom: 6 }}
            >
              {screen.donnees.phrase1}
            </motion.div>
          </Masque>
          <Masque visible={p2} live={live} dureeS={1.1}>
            <div style={{ color: 'var(--blanc)', fontWeight: 400, paddingBottom: 6 }}>
              {screen.donnees.phrase2}
            </div>
          </Masque>
        </div>
      );
    }

    case 'trois-fois-trois': {
      const cols = screen.donnees.colonnes;
      const filet = surPapier ? 'rgba(16,20,31,0.18)' : 'rgba(255,255,255,0.2)';
      return (
        <div className="absolute inset-0" style={{ color: couleurTexte }}>
          {cols.map((c, ci) => (
            <div key={c.titre} className="absolute" style={{ left: ci === 0 ? 160 : 1040, top: 226, width: 720 }}>
              <Entree live={live} delaiS={ci * 0.14}>
                <div className="etiquette" style={{ color: couleurSecondaire, marginBottom: 26 }}>{c.titre}</div>
              </Entree>
              {c.lignes.map((l, i) => (
                <Entree key={l} live={live} delaiS={0.22 + ci * 0.14 + i * 0.13}>
                  <div
                    style={{
                      ...serif(44, 'var(--wght-texte)'),
                      fontSize: 46,
                      lineHeight: 1.28,
                      padding: '26px 0',
                      borderTop: `1px solid ${filet}`,
                    }}
                  >
                    {l}
                  </div>
                </Entree>
              ))}
            </div>
          ))}
          <motion.div
            className="absolute"
            initial={live ? { scaleY: 0 } : false}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.9, ease: EASE_ENTREE, delay: 0.3 }}
            style={{ left: 960, top: 250, width: 1, height: 560, background: filet, transformOrigin: 'top center' }}
          />
        </div>
      );
    }

    case 'colophon': {
      const d = screen.donnees;
      return (
        <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
          <div className="absolute" style={{ left: 160, top: 330 }}>
            <div
              style={{
                fontFamily: SERIF,
                fontVariationSettings: "'opsz' 144",
                fontWeight: 400,
                fontSize: 200,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              <TitreAnime texte={d.merci} live={live} dureeS={0.8} decalageS={0.045} />
            </div>
            <Entree live={live} delaiS={0.65}>
              <div className="etiquette" style={{ color: 'var(--gris-clair)', marginTop: 44 }}>{d.invitation}</div>
            </Entree>
          </div>
          {/* la barre-signature : les dix unités de l’objet, au repos */}
          <div className="absolute flex" style={{ left: 160, right: 160, bottom: 300, gap: 8 }}>
            {Array.from({ length: 10 }, (_, i) => (
              <motion.div
                key={i}
                initial={live ? { opacity: 0, y: 14 } : false}
                animate={{ opacity: i < 5 ? 1 : 0.32, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_ENTREE, delay: 0.5 + i * 0.05 }}
                style={{
                  flex: 1,
                  height: 10,
                  background: i < 5 ? 'var(--blanc)' : 'transparent',
                  border: i < 5 ? 'none' : '1px solid rgba(255,255,255,0.55)',
                }}
              />
            ))}
          </div>
          <div className="absolute" style={{ left: 160, bottom: 150 }}>
            {d.mentions.map((m, i) => (
              <Entree key={m} live={live} delaiS={0.8 + i * 0.1}>
                <div
                  style={{
                    fontFamily: GROTESQUE,
                    fontSize: 28,
                    color: i === 0 ? 'var(--blanc)' : 'var(--gris-clair)',
                    lineHeight: 1.7,
                  }}
                >
                  {m}
                </div>
              </Entree>
            ))}
          </div>
        </div>
      );
    }
  }
}
