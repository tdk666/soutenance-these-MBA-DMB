import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { SimulateurParams } from '../types';
import { EASE_ENTREE, EASE_MORPH } from '../moteur/motion';
import { etatEtage, etatTjm, formatEUR, formatPct, valeurClientEUR } from './modele';

/*
 * Le simulateur (E16, bloc 6) : le seul moment interactif de la soutenance.
 * Trois gestes à la souris, tenus à 60 secondes :
 *   1. le contrat au temps passé, sain;
 *   2. le curseur « gain de productivité IA » monte de 0 à 50 % : les jours
 *      fondent, le revenu s'effondre, la valeur client (jaune) ne bouge pas;
 *   3. l'interrupteur NEUTRE (« autre unité de compte ») : la même mission
 *      se redistribue en quatre lignes, la marge tient (elle passe au jaune).
 * Les hypothèses de calcul s'affichent d'un clic (un opérateur P&L demandera
 * d'où sortent les chiffres).
 */

const GROTESQUE = 'var(--grotesque)';

function Compteur({ valeur, format, taille, couleur = 'var(--blanc)', poids = 500 }: {
  valeur: number;
  format: (n: number) => string;
  taille: number;
  couleur?: string;
  poids?: number;
}) {
  // interpolation continue vers la valeur courante (suit le curseur sans sauts)
  const [affiche, setAffiche] = useState(valeur);
  const cible = useRef(valeur);
  cible.current = valeur;
  useEffect(() => {
    let vivant = true;
    const pas = () => {
      if (!vivant) return;
      setAffiche((a) => {
        const d = cible.current - a;
        if (Math.abs(d) < 0.5) return cible.current;
        return a + d * 0.25;
      });
      requestAnimationFrame(pas);
    };
    const id = requestAnimationFrame(pas);
    return () => {
      vivant = false;
      cancelAnimationFrame(id);
    };
  }, []);
  return (
    <span
      style={{
        fontFamily: GROTESQUE,
        fontWeight: poids,
        fontSize: taille,
        color: couleur,
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
      }}
    >
      {format(affiche)}
    </span>
  );
}

function Ligne({ label, children, forte = false }: { label: string; children: React.ReactNode; forte?: boolean }) {
  return (
    <div
      className="flex items-baseline justify-between"
      style={{
        padding: '14px 0',
        borderBottom: '1px solid rgba(255,255,255,0.18)',
        opacity: forte ? 1 : 0.92,
      }}
    >
      <span style={{ fontFamily: GROTESQUE, fontSize: 30, color: 'var(--gris-clair)' }}>{label}</span>
      {children}
    </div>
  );
}

export function Simulateur({ params, live }: { params: SimulateurParams; live: boolean }) {
  const [gainPct, setGainPct] = useState(0);
  const [bascule, setBascule] = useState(false);
  const [hypotheses, setHypotheses] = useState(false);

  const tjm = etatTjm(params, gainPct);
  const etage = etatEtage(params, gainPct);
  const valeurClient = valeurClientEUR(params);
  const revenuAffiche = bascule ? etage.totalAttenduEUR : tjm.revenuEUR;

  // pilotage externe : captures Playwright et dépannage
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__sim = {
      gain: (pct: number) => setGainPct(Math.max(0, Math.min(params.gainMaxPct, pct))),
      bascule: (v: boolean) => setBascule(v),
      hypotheses: (v: boolean) => setHypotheses(v),
    };
    return () => {
      delete (window as unknown as Record<string, unknown>).__sim;
    };
  }, [params]);

  const hauteurBarre = (montant: number) => (montant / valeurClient) * 460;

  return (
    <div className="absolute inset-0" style={{ color: 'var(--blanc)' }}>
      <div className="etiquette absolute" style={{ left: 140, top: 92, color: 'var(--gris-clair)' }}>
        {bascule ? 'La même mission, autrement comptée' : 'Un contrat au temps passé'}
      </div>

      {/* ----- colonne gauche : le contrat ----- */}
      <div className="absolute" style={{ left: 140, top: 190, width: 880 }}>
        <AnimatePresence mode="wait" initial={false}>
          {!bascule ? (
            <motion.div
              key="tjm"
              initial={live ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_ENTREE }}
            >
              <Ligne label="Jours facturés">
                <Compteur valeur={tjm.joursFactures} format={(n) => `${n.toFixed(1).replace('.', ',').replace(',0', '')} j`} taille={44} />
              </Ligne>
              <Ligne label="Prix de journée">
                <Compteur valeur={tjm.tjmEUR} format={formatEUR} taille={44} />
              </Ligne>
              <Ligne label="Revenu de la mission" forte>
                <Compteur valeur={tjm.revenuEUR} format={formatEUR} taille={84} />
              </Ligne>
              <Ligne label="Coûts (équipe, structure, outils)">
                <Compteur valeur={tjm.coutsEUR} format={formatEUR} taille={44} />
              </Ligne>
              <Ligne label="Marge" forte>
                <Compteur valeur={tjm.margePct} format={(n) => formatPct(n)} taille={84} />
              </Ligne>
            </motion.div>
          ) : (
            <motion.div
              key="etage"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE_MORPH }}
            >
              {etage.lignes.map((l) => (
                <Ligne key={l.nom} label={`${l.nom} · ${l.metrique}`}>
                  <span style={{ fontFamily: GROTESQUE, fontWeight: 500, fontSize: 40 }}>
                    {l.nature === 'variable'
                      ? `${formatEUR(l.montantEUR * (params.etage.couloir.basPct / 100))} à ${formatEUR(l.montantEUR * (params.etage.couloir.hautPct / 100))}`
                      : formatEUR(l.montantEUR)}
                  </span>
                </Ligne>
              ))}
              <Ligne label="Revenu de la mission" forte>
                <Compteur valeur={etage.totalAttenduEUR} format={formatEUR} taille={64} />
              </Ligne>
              <Ligne label="Marge" forte>
                <Compteur valeur={etage.margePct} format={(n) => formatPct(n)} taille={84} couleur="var(--jaune)" />
              </Ligne>
            </motion.div>
          )}
        </AnimatePresence>

        {/* curseur du gain de productivité */}
        <div style={{ marginTop: 44 }}>
          <div className="flex items-baseline justify-between" style={{ marginBottom: 14 }}>
            <span className="etiquette" style={{ color: 'var(--gris-clair)' }}>{params.etiquetteCurseur}</span>
            <span style={{ fontFamily: GROTESQUE, fontWeight: 600, fontSize: 36, fontVariantNumeric: 'tabular-nums' }}>
              +{Math.round(gainPct)} %
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={params.gainMaxPct}
            step={1}
            value={gainPct}
            onChange={(e) => setGainPct(Number(e.target.value))}
            onPointerUp={(e) => (e.target as HTMLInputElement).blur()}
            className="curseur-sim"
            style={{ width: '100%' }}
            aria-label={params.etiquetteCurseur}
          />
        </div>

        {/* hypothèses affichables d'un clic */}
        <button
          onClick={() => setHypotheses((h) => !h)}
          style={{
            marginTop: 36,
            fontFamily: GROTESQUE,
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--gris-clair)',
            background: 'none',
            border: '1.5px solid rgba(255,255,255,0.35)',
            borderRadius: 999,
            padding: '10px 26px',
            cursor: 'pointer',
          }}
        >
          Hypothèses de calcul
        </button>
      </div>

      {/* ----- colonne droite : agence vs client ----- */}
      <div className="absolute" style={{ left: 1160, top: 190, width: 620 }}>
        <div className="flex items-end gap-16" style={{ height: 560 }}>
          {/* revenu agence : blanc, il fond; en étagé il devient quatre strates */}
          <div className="flex flex-col items-center" style={{ width: 220 }}>
            <div className="flex w-full flex-col-reverse items-stretch justify-start" style={{ height: 460 }}>
              {bascule ? (
                etage.lignes.map((l, i) => (
                  <motion.div
                    key={l.nom}
                    initial={{ height: 0 }}
                    animate={{ height: hauteurBarre(l.montantEUR) - 6 }}
                    transition={{ duration: 0.9, ease: EASE_MORPH, delay: i * 0.1 }}
                    style={{ background: 'var(--blanc)', marginTop: 6 }}
                  />
                ))
              ) : (
                <motion.div
                  initial={false}
                  animate={{ height: hauteurBarre(tjm.revenuEUR) }}
                  transition={{ duration: 0.3, ease: EASE_ENTREE }}
                  style={{ background: 'var(--blanc)' }}
                />
              )}
            </div>
            <div style={{ marginTop: 18, textAlign: 'center', height: 150 }}>
              <Compteur valeur={revenuAffiche} format={formatEUR} taille={40} />
              <div className="etiquette" style={{ color: 'var(--gris-clair)', fontSize: 28, marginTop: 6 }}>
                L'agence
              </div>
            </div>
          </div>
          {/* valeur client : jaune, immobile — la seule chose qui ne bouge pas */}
          <div className="flex flex-col items-center" style={{ width: 220 }}>
            <div className="flex w-full flex-col justify-end" style={{ height: 460 }}>
              <div style={{ height: hauteurBarre(valeurClient), background: 'var(--jaune)' }} />
            </div>
            <div style={{ marginTop: 18, textAlign: 'center', height: 150 }}>
              <span style={{ fontFamily: GROTESQUE, fontWeight: 500, fontSize: 40, color: 'var(--jaune)' }}>
                {formatEUR(valeurClient)}
              </span>
              <div className="etiquette" style={{ color: 'var(--gris-clair)', fontSize: 28, marginTop: 6 }}>
                {params.etiquetteValeurClient}
              </div>
            </div>
          </div>
        </div>

        {/* l'interrupteur neutre */}
        <div className="flex items-center gap-6" style={{ marginTop: 60 }}>
          <button
            onClick={() => setBascule((b) => !b)}
            aria-label={params.etiquetteBascule}
            style={{
              width: 96,
              height: 52,
              borderRadius: 999,
              border: '1.5px solid rgba(255,255,255,0.5)',
              background: bascule ? 'var(--blanc)' : 'transparent',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 400ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <motion.span
              initial={false}
              animate={{ left: bascule ? 50 : 6 }}
              transition={{ duration: 0.4, ease: EASE_ENTREE }}
              style={{
                position: 'absolute',
                top: 5,
                width: 40,
                height: 40,
                borderRadius: 999,
                background: bascule ? 'var(--bleu)' : 'var(--blanc)',
              }}
            />
          </button>
          <span className="etiquette" style={{ color: 'var(--blanc)' }}>{params.etiquetteBascule}</span>
        </div>
      </div>

      {/* ----- panneau des hypothèses ----- */}
      <AnimatePresence>
        {hypotheses && (
          <motion.div
            className="absolute"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_ENTREE }}
            style={{
              left: 140,
              right: 140,
              bottom: 60,
              background: 'rgba(0, 0, 0, 0.45)',
              padding: '30px 40px',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div className="etiquette" style={{ color: 'var(--gris-clair)', marginBottom: 18 }}>
              Hypothèses de calcul, chacune sourcée
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-3">
              {params.hypotheses.map((h) => (
                <div key={h.cle} style={{ fontFamily: GROTESQUE, fontSize: 28, lineHeight: 1.35 }}>
                  <span style={{ color: 'var(--gris-clair)' }}>{h.cle} : </span>
                  <span>{h.valeur}</span>
                  <span style={{ color: 'var(--gris)', fontSize: 28 }}> · {h.source}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
