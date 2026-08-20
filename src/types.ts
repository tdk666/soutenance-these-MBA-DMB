/**
 * Types du deck — source de vérité.
 * (Le fichier docs/etape-1/deck.config.schema.ts est la version validée à
 * l’étape 1; toute évolution se fait ici.)
 *
 * Principe : le moteur est agnostique. Tout le contenu (textes, chiffres,
 * timecodes, notes présentateur, doctrine coupes/réserves, hypothèses du
 * simulateur) vit dans content/deck.config.ts, conforme à ces types.
 */

/* ---------- identifiants ---------- */

export type ScreenId =
  | 'E01' | 'E02' | 'E03' | 'E04' | 'E05' | 'E06' | 'E07'
  | 'E08' | 'E09' | 'E10' | 'E11' | 'E12' | 'E13' | 'E14'
  | 'E15' | 'E16' | 'E17' | 'E18' | 'E19' | 'E20' | 'E21'
  | 'E22' | 'E23'
  | 'E24'
  | 'E25';

export type BlocId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type SilenceId = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7';

/** Timecode "M:SS" ou "MM:SS", préfixe "~" autorisé pour les cibles indicatives. */
export type Timecode = string;

/* ---------- fonds et objet graphique ---------- */

export type Fond = 'noir' | 'bleu' | 'papier';

/** Les états de l’objet graphique persistant (la colonne vertébrale visuelle). */
export type ObjetEtat =
  | { kind: 'absent' }
  | { kind: 'barre'; joursFantomes: 0 | 5; position: 'centre' | 'pied' | 'retrait' }
  | { kind: 'strates'; etiquettes: boolean; position: 'centre' | 'retrait' }
  | { kind: 'frise'; allumes: 0 | 1 | 2 | 3 | 4 };

/* ---------- pas d’animation ---------- */

export type StepAction =
  | { type: 'reveler'; cible: string }
  | { type: 'compteur'; cible: string; de: number; a: number; dureeMs: number }
  | { type: 'objet'; versEtat: ObjetEtat; dureeMs: number }
  | { type: 'simulateur'; geste: 1 | 2 | 3 }
  | { type: 'barrer'; cible: string };

/**
 * Deux régimes :
 * - 'beat'   : déclenchement manuel (télécommande), ancré sur un mot du script.
 * - 'chaine' : lancé automatiquement par le pas précédent après `delaiMs`.
 * Budget contractuel : 33 beats sur toute la soutenance (entrées d’écran
 * incluses, E01 exclu car état initial).
 */
export interface Step {
  id: string;                    // "E09.divise-par-deux"
  mode: 'beat' | 'chaine';
  /** requis si mode 'chaine' : délai depuis le déclenchement du pas précédent */
  delaiMs?: number;
  action: StepAction;
  /** règle DA : chaque animation se justifie en une phrase */
  pourquoi: string;
  /** le mot ou groupe de mots du script sur lequel on déclenche */
  repereParole: string;
}

/* ---------- transitions ---------- */

export type TransitionIn =
  | { type: 'aucune' }
  | { type: 'fondu'; dureeMs: number }
  | { type: 'masque-montant'; dureeMs: number }
  | { type: 'glissement'; direction: 'gauche' | 'haut'; dureeMs: number }
  | { type: 'bascule-fond'; dureeMs: number }
  | { type: 'morph-objet'; dureeMs: number };

/* ---------- layouts et leurs données ---------- */

export type LayoutDonnees =
  | { layout: 'noir-vide'; donnees: Record<string, never> }
  | { layout: 'ligne-seule'; donnees: { texte: string } }
  | { layout: 'chiffre-verdict'; donnees: { de: string; valeur: string } }
  | { layout: 'sommaire'; donnees: { lignes: string[] } }
  | {
      layout: 'parcours';
      donnees: {
        etapes: { libelle: string; detail?: string }[];
        citation?: { texte: string; attribution: string };
      };
    }
  | { layout: 'citation-seule'; donnees: { texte: string } }
  | {
      layout: 'deux-cotes';
      donnees: {
        gauche: { titre: string; items: { nom: string; role: string }[] };
        droite: { titre: string; items: { nom: string; role: string }[] };
        pastilles: string[];
        transparence: string[];
      };
    }
  | { layout: 'titre-plein'; donnees: { titre: string } }
  | {
      layout: 'arithmetique';
      donnees: {
        kicker: string;
        lignes: { label: string; valeur: string }[];
        legendeBarre: { gauche: string; droite: string };
        source: string;
        citation?: { texte: string; attribution: string };
      };
    }
  | {
      layout: 'lignes-comptes';
      donnees: {
        kicker: string;
        lignes: { label: string; valeur: string }[];
        chute: string;
      };
    }
  | {
      layout: 'figure-enquete';
      donnees: {
        kicker: string;
        barres: { label: string; valeur: number; total: number }[];
        lecture: string;
        /** le baptême n° 1 (v3) : révélé par un step, jamais affiché avant la parole */
        terme: string;
      };
    }
  | {
      layout: 'terme-seul';
      donnees: {
        terme: string;
        sousLigne?: string;
        histoire?: { etiquette: string; texte: string };
      };
    }
  | {
      layout: 'trois-colonnes';
      donnees: { colonnes: { titre: string; montant: string; details: string[] }[] };
    }
  | { layout: 'pyramide-diamant'; donnees: { avant: string; apres: string; centre: string } }
  | { layout: 'simulateur'; donnees: Record<string, never> }
  | {
      layout: 'quatre-etages';
      donnees: {
        /** le baptême n° 3, prononcé en entrant sur cet écran */
        titre: string;
        etages: { nom: string; metrique: string; ancrage: string }[];
      };
    }
  | {
      layout: 'verrous';
      donnees: { verrous: { nom: string; objection: string; parade: string }[] };
    }
  | {
      layout: 'frise-24-mois';
      donnees: {
        segments: { nom: string; periode: string; decisions: string[] }[];
        ligneDeCrete: string;
      };
    }
  | { layout: 'trois-suites'; donnees: { suites: string[] } }
  | { layout: 'renversement'; donnees: { phrase1: string; phrase2: string } }
  | { layout: 'trois-fois-trois'; donnees: { colonnes: { titre: string; lignes: string[] }[] } }
  | { layout: 'colophon'; donnees: { merci: string; invitation: string; mentions: string[] } };

/* ---------- écran ---------- */

export interface ScreenCommun {
  id: ScreenId;
  bloc: BlocId;
  /** pour la grille Échap et le mode présentateur */
  titreInterne: string;
  fond: Fond;
  /** cible indicative d’entrée, dérivée du script à 120 mots/min */
  entreeCible: Timecode;
  transitionIn: TransitionIn;
  /** état de l’objet à l’arrivée sur l’écran */
  objet: ObjetEtat;
  steps: Step[];
  notes: {
    /** le texte du script pour cet écran, verbatim (marqueurs ◆ Sx et ⟦...⟧ conservés) */
    script: string;
    silences: SilenceId[];
    consignes?: string;
  };
}

export type Screen = ScreenCommun & LayoutDonnees;

/* ---------- chrono, checkpoints, doctrine ---------- */

export interface Decision {
  condition: { type: 'avance' | 'retard'; seuilS: number };
  instruction: string;
}

export interface Checkpoint {
  id: 'CP0' | 'CP1' | 'CP2' | 'CP3' | 'CP4' | 'FIN';
  libelle: string;
  /** le checkpoint se constate à la SORTIE de cet écran (null pour FIN) */
  sortieDe: ScreenId | null;
  cible: Timecode;
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
  declencheur: string;
}

/* ---------- affichage ---------- */

/** Mode salle claire (touche L) : mêmes teintes, contraste de luminance renforcé. */
export interface ModeSalleClaire {
  bleuFonce: string;
  grisSecondaire: string;
  opaciteFantomesPct: number;
  opacitePhraseReculPct: number;
  gainGraisseVariable: number;
  grain: false;
}

/* ---------- simulateur (étape 3) ---------- */

export interface SimulateurParams {
  /** l’état sain du contrat au temps passé */
  contrat: {
    jours: number;                 // 10
    tjmEUR: number;                // 1500
    /** coût complet d’une journée travaillée (salaires chargés) */
    coutJourEUR: number;
    /** part de frais fixes de l’agence allouée à la mission (ne fond pas avec les jours) */
    structureEUR: number;
    /** coût des outils IA à plein gain (croît linéairement avec le curseur) */
    outilsPleinGainEUR: number;
  };
  /** borne du curseur « gain de productivité IA » */
  gainMaxPct: number;              // 50
  /** hausse du prix de journée tentée par l’agence, atteinte à gain max (v3 : ≈ +15 %) */
  hausseTjmMaxPct: number;
  /** la redistribution en prix étagé de la même mission */
  etage: {
    lignes: {
      nom: string;
      metrique: string;            // « au temps », « au livrable »...
      montantEUR: number;          // pour la ligne à l’effet : montant attendu
      nature: 'temps' | 'livrable' | 'droits' | 'variable';
    }[];
    couloir: { basPct: number; hautPct: number };  // 90 / 110 sur la ligne variable
  };
  /** calibration contractuelle : l’arithmétique Kajman, vérifiée par les tests */
  calibration: {
    aGainPct: number;              // 50
    contractionRevenu: { minPct: number; maxPct: number };  // [-45, -38]
  };
  /** hypothèses affichables d’un clic, chacune sourcée */
  hypotheses: { cle: string; valeur: string; source: string }[];
  /** étiquette NEUTRE de l’interrupteur (jamais « prix étagé » avant la parole) */
  etiquetteBascule: string;
  etiquetteCurseur: string;
  etiquetteValeurClient: string;
}

/* ---------- racine ---------- */

export interface DeckConfig {
  meta: {
    titre: string;
    orateur: string;
    date: string;
    lieu: string;
    jury: string;
    dureeCible: Timecode;      // "30:08"
    debitMotsParMin: number;
    /** la page de garde, affichée avant le noir de l’adresse (hors régie) */
    couverture: {
      surtitre: string;
      titre: string;
      mentions: string[];
    };
    /** noms courts des blocs, pour le chrome éditorial (section, folio) */
    blocs: { id: BlocId; nom: string }[];
  };
  salleClaire: ModeSalleClaire;
  screens: Screen[];           // ordonnés, E01 → E21
  checkpoints: Checkpoint[];
  coupes: Coupe[];
  reserves: Reserve[];
  simulateur?: SimulateurParams;
}
