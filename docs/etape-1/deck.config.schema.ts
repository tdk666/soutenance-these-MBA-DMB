/**
 * Schéma des types de `content/deck.config.ts` (étape 1, pour validation).
 * Principe : le moteur est agnostique, tout le contenu (textes, chiffres,
 * timecodes, notes, doctrine coupes/réserves, hypothèses du simulateur)
 * vit dans le config, typé strictement. Aucune chaîne de contenu dans le code.
 */

/* ---------- identifiants ---------- */

export type ScreenId =
  | 'E01' | 'E02' | 'E03' | 'E04' | 'E05' | 'E06' | 'E07'
  | 'E08' | 'E09' | 'E10' | 'E11' | 'E12' | 'E13' | 'E14'
  | 'E15' | 'E16' | 'E17' | 'E18' | 'E19' | 'E20' | 'E21';

export type BlocId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** millisecondes depuis 0:00 (le config écrit "8:04", un parseur valide et convertit) */
export type TimecodeMs = number;

/* ---------- fonds et objet graphique ---------- */

export type Fond = 'noir' | 'bleu' | 'papier';

/** Les états de l'objet graphique persistant (la colonne vertébrale). */
export type ObjetEtat =
  | { kind: 'absent' }
  | { kind: 'barre'; jours: 10; joursFantomes: 0 | 5; position: 'centre' | 'pied' | 'retrait' }
  | { kind: 'strates'; etages: 4; etiquettes: boolean; position: 'centre' | 'retrait' }
  | { kind: 'frise'; segments: 4; allumes: 0 | 1 | 2 | 3 | 4 };

/* ---------- écrans et déclenchements ---------- */

/** Un déclenchement manuel à l'intérieur d'un écran. */
export interface Step {
  id: string;                    // "E09.divise-par-deux"
  /** ce que le déclenchement fait (le moteur mappe vers une animation nommée) */
  action:
    | { type: 'reveler'; cible: string }                       // élément du layout
    | { type: 'compteur'; cible: string; de: number; a: number; dureeMs: number }
    | { type: 'objet'; versEtat: ObjetEtat; dureeMs: number }  // métamorphoses
    | { type: 'simulateur'; geste: 1 | 2 | 3 }
    | { type: 'barrer'; cible: string };                       // les verrous
  /** règle DA : chaque animation se justifie en une phrase (champ obligatoire) */
  pourquoi: string;
  /** repère du script : la phrase sur laquelle on déclenche */
  repereParole: string;
}

export type TransitionIn =
  | { type: 'fondu'; dureeMs: number }
  | { type: 'masque-montant'; dureeMs: number }
  | { type: 'glissement'; direction: 'gauche' | 'haut'; dureeMs: number }
  | { type: 'bascule-fond'; vers: Fond; dureeMs: number }
  | { type: 'morph-objet'; dureeMs: number };   // la métamorphose EST la transition

export interface Screen {
  id: ScreenId;
  bloc: BlocId;
  titreInterne: string;            // pour la grille Échap et le mode présentateur
  fond: Fond;
  /** cible indicative d'entrée (dérivée du script à 120 mots/min) */
  entreeCibleMs: TimecodeMs;
  transitionIn: TransitionIn;
  /** état de l'objet à l'arrivée sur l'écran (le moteur interpole depuis l'état courant) */
  objet: ObjetEtat;
  /** composant de layout (le moteur résout par nom, le contenu vient de `donnees`) */
  layout:
    | 'noir-vide' | 'ligne-seule' | 'chiffre-verdict' | 'sommaire' | 'parcours'
    | 'citation-seule' | 'deux-cotes' | 'titre-plein' | 'arithmetique'
    | 'lignes-comptes' | 'figure-enquete' | 'terme-seul' | 'trois-colonnes'
    | 'pyramide-diamant' | 'simulateur' | 'quatre-etages' | 'verrous'
    | 'frise-24-mois' | 'trois-suites' | 'renversement';
  /** contenu du layout : textes et chiffres, tous sourcés script ou thèse */
  donnees: Record<string, string | number | Array<string | number | Record<string, string | number>>>;
  steps: Step[];
  /** notes présentateur : texte du script pour cet écran + consignes (silences, coupes) */
  notes: {
    script: string;
    silences: Array<'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7'>;
    consignes?: string;
  };
}

/* ---------- chrono, checkpoints, doctrine ---------- */

export interface Decision {
  /** avance positive, retard négatif, en secondes */
  condition: { type: 'avance' | 'retard'; seuilS: number };
  instruction: string;             // « ouvrir R1 », « armer C3 », phrase de raccord incluse
}

export interface Checkpoint {
  id: 'CP0' | 'CP1' | 'CP2' | 'CP3' | 'FIN';
  /** le checkpoint se constate à la SORTIE de cet écran */
  sortieDe: ScreenId;
  cibleMs: TimecodeMs;             // 8:04, 13:04, 16:26, 23:02, 30:04
  decisions: Decision[];
}

export interface Coupe {
  id: 'C3' | 'C5' | 'C6';
  bloc: BlocId;
  gainS: number;
  contenuSacrifie: string;
  phraseRaccord: string;
}

export interface Reserve {
  id: 'R1' | 'R2' | 'R3';
  bloc: BlocId;
  coutS: number;
  contenu: string;
  declencheur: string;             // « CP1 en avance ≥ 45 s »
}

/* ---------- simulateur (bloc 6) ---------- */

export interface SimulateurParams {
  /** état sain du contrat au TJM */
  contrat: {
    jours: number;                 // 10
    tjmEUR: number;                // 1500
    coutsDirectsEUR: number;       // par jour ou forfait, documenté dans le modèle
    fraisStructureTauxPct: number;
  };
  /**
   * Calibration contractuelle (arithmétique Kajman, thèse) :
   * à gain de productivité 50 %, hausse tentée du TJM de +13 à +20 %,
   * assiette divisée par 2, le revenu doit se contracter d'environ −40 %
   * (tolérance de test : −45 % à −38 %).
   */
  calibration: {
    gainPct: 50;
    hausseTjmPct: { min: 13; max: 20 };
    contractionRevenuAttendue: { minPct: -45; maxPct: -38 };
  };
  /** redistribution en prix étagé (geste 3) */
  etage: {
    conseilTempsPct: number;
    productionLivrablePct: number;
    droitsPct: number;
    effetVariable: { soclePct: number; couloir: { basPct: 90; hautPct: 110 } };
  };
  /** hypothèses affichables d'un clic, chacune sourcée */
  hypotheses: Array<{ cle: string; valeur: string; source: string }>;
}

/* ---------- racine ---------- */

export interface DeckConfig {
  meta: {
    titre: string;
    date: string;                  // « 4 septembre 2026 »
    dureeCibleMs: TimecodeMs;      // 30:04
    debitMotsParMin: 120;
  };
  screens: Screen[];               // ordonnés, E01 → E21
  checkpoints: Checkpoint[];
  coupes: Coupe[];
  reserves: Reserve[];
  simulateur: SimulateurParams;
}
