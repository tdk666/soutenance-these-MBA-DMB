import type { DeckConfig } from '../src/types';

export const deckConfig: DeckConfig = {
  meta: {
    titre: 'Vendre du temps dans un monde où il ne vaut plus rien',
    orateur: 'Théophile Dequecker',
    date: '4 septembre 2026',
    dureeCible: '30:04',
    debitMotsParMin: 120,
  },

  salleClaire: {
    bleuFonce: '#18215F',
    grisSecondaire: '#D5D8DE',
    opaciteFantomesPct: 60,
    opacitePhraseReculPct: 65,
    gainGraisseVariable: 60,
    grain: false,
  },

  screens: [
    /* ---------- E01 · Bloc 1 · L'adresse, noir total ---------- */
    {
      id: 'E01',
      bloc: 1,
      titreInterne: "Noir — l'adresse",
      fond: 'noir',
      entreeCible: '0:00',
      transitionIn: { type: 'aucune' },
      objet: { kind: 'absent' },
      layout: 'noir-vide',
      donnees: {},
      steps: [],
      notes: {
        script: `Monsieur, vous avez lu ces cent vingt pages, et je ne vais pas vous les relire. Ce que je vous propose, c'est le tri que la thèse ne pouvait pas faire : les quelques chiffres qui portent toute ma démonstration, et ce que j'en fais à partir de lundi matin. (r) Et pour commencer, je vous ramène au 3 février 2026.`,
        silences: [],
      },
    },

    /* ---------- E02 · Bloc 1 · « 3 février 2026 » ---------- */
    {
      id: 'E02',
      bloc: 1,
      titreInterne: '3 février 2026',
      fond: 'noir',
      entreeCible: '~0:35',
      transitionIn: { type: 'fondu', dureeMs: 600 },
      objet: { kind: 'absent' },
      layout: 'ligne-seule',
      donnees: { texte: '3 février 2026' },
      steps: [],
      notes: {
        script: `Ce matin-là, tout annonce pour Publicis une excellente journée. Le premier groupe de communication mondial publie ses résultats annuels, et tout dépasse les attentes : 5,9 % de croissance organique au quatrième trimestre là où le consensus espérait 5,1, et la meilleure marge de son histoire, 18,2 %. Et pourtant, à la clôture, l'action perd 9,24 %. Plus forte chute du CAC 40 de la séance. ◆ S1`,
        silences: ['S1'],
      },
    },

    /* ---------- E03 · Bloc 1 · Le verdict −9,24 % ---------- */
    {
      id: 'E03',
      bloc: 1,
      titreInterne: '−9,24 %',
      fond: 'noir',
      entreeCible: '~1:15',
      transitionIn: { type: 'fondu', dureeMs: 600 },
      objet: { kind: 'absent' },
      layout: 'chiffre-verdict',
      donnees: { de: '0,00 %', valeur: '−9,24 %' },
      steps: [],
      notes: {
        script: `Et le même jour, l'annonce d'un simple outil d'IA juridique fait perdre 14 % à RELX et 12 % à Wolters Kluwer, deux géants que rien, dans leurs comptes, ne condamnait. (r) Alors que s'est-il passé entre le communiqué du matin et le cours du soir ? Rien qui concerne les résultats, et c'est justement le point. La Bourse n'achète jamais le passé : elle achète des promesses. Or ce jour-là, une crainte s'est glissée dans toutes les promesses du secteur : et si une intelligence artificielle savait bientôt produire, en quelques minutes et pour presque rien, ce que ces entreprises vendent cher et fabriquent lentement ? (r) Ce que la séance a sanctionné, ce ne sont donc pas les résultats, c'est la machine qui les produit : le modèle économique. Ce 3 février n'était pas un accident de séance, c'était un verdict anticipé. Et mon travail s'est donné une seule tâche : comprendre sur quoi porte ce verdict, et y répondre.`,
        silences: [],
        consignes: "Entrer juste après S1. Le chiffre reste affiché pendant toute l'explication.",
      },
    },

    /* ---------- E04 · Bloc 2 · Sommaire ---------- */
    {
      id: 'E04',
      bloc: 2,
      titreInterne: 'Sommaire',
      fond: 'papier',
      entreeCible: '2:30',
      transitionIn: { type: 'bascule-fond', dureeMs: 700 },
      objet: { kind: 'absent' },
      layout: 'sommaire',
      donnees: {
        lignes: [
          "D'où vient ce sujet",
          "Comment je l'ai instruit",
          "Ce que j'ai trouvé",
          "Ce que j'en fais",
        ],
      },
      steps: [],
      notes: {
        script: `Voici donc le chemin que je vous propose : d'où vient ce sujet, comment je l'ai instruit, ce que j'ai trouvé, et ce que j'en fais maintenant.`,
        silences: [],
      },
    },

    /* ---------- E05 · Bloc 2 · Ligne de parcours ---------- */
    {
      id: 'E05',
      bloc: 2,
      titreInterne: 'Parcours',
      fond: 'papier',
      entreeCible: '~2:45',
      transitionIn: { type: 'glissement', direction: 'gauche', dureeMs: 700 },
      objet: { kind: 'absent' },
      layout: 'parcours',
      donnees: {
        etapes: [
          { libelle: 'Double licence', detail: 'Histoire, Sorbonne · Info-Média, Assas' },
          { libelle: 'Master IAE Aix', detail: 'Césure à McGill, Montréal' },
          { libelle: 'Les Échos - Le Parisien', detail: 'Régie publicitaire' },
          { libelle: 'Air Liquide', detail: 'JO de Paris' },
          { libelle: 'Havas Paris Social', detail: 'Alternance, consultant social media' },
          { libelle: 'MBA DMB', detail: 'Spécialisation IA & Data' },
        ],
      },
      steps: [],
      notes: {
        script: `Deux mots sur moi, parce qu'ils expliquent la question. Je suis un littéraire devenu communicant. J’ai d’abord suivi une double licence en Histoire à la Sorbonne et en Information Média à Panthéon Assas, dans le but de faire du journalisme. Mais je me suis finalement tourné vers les métiers de la communication, et je suis parti suivre un master en Communication et conduite du changement à l’IAE d’Aix en Provence, avec un semestre de césure à l’université McGill, à Montréal. Ce master m’a permis de faire plusieurs stages. Passé par la régie publicitaire des Échos - Le Parisien Média, je suis ensuite allé couvrir le partenariat avec les JO de Paris chez Air Liquide. J’ai enfin décidé de reprendre une année d’étude pour être en alternance Havas Paris Social, comme consultant social media. Et j'ai choisi ce MBA, spécialisation IA et Data, précisément pour ajouter un bagage technique à ce profil. La démarche DMB, vous allez la voir à l'œuvre : partir de son terrain, y trouver une question de transformation, et la conduire jusqu'à des recommandations applicables lundi matin. Or mon terrain m'a placé à l'endroit exact où la valeur se négocie. (r)

Parce que mon sujet initial n'était pas celui-ci. Je voulais écrire sur la créativité : l'IA générative, menace ou moteur pour les créatifs en agence ? C'est mon coach, Bastien Jaffre, qui m'a poussé vers plus dense, plus économique. Et le terrain a fini le travail, le jour où un directeur financier m'a dit, à propos d'une idée créative : « Une super idée, ça peut se trouver en deux jours. Et ça va générer un chiffre d'affaires de malade. » Quand deux jours de travail peuvent produire un chiffre d'affaires de malade, l'unité qui facture les deux jours ne mesure plus rien de ce qui compte. (r) Moi qui me demandais si l'IA allait remplacer les créatifs, j’ai compris que la question urgente était de savoir ce qu'elle allait remplacer dans le modèle économique qui permettait de les payer. ◆ S2`,
        silences: ['S2'],
      },
    },

    /* ---------- E06 · Bloc 2 · La problématique ---------- */
    {
      id: 'E06',
      bloc: 2,
      titreInterne: 'Problématique',
      fond: 'papier',
      entreeCible: '~4:45',
      transitionIn: { type: 'masque-montant', dureeMs: 600 },
      objet: { kind: 'absent' },
      layout: 'citation-seule',
      donnees: {
        texte:
          "Comment l'intelligence artificielle générative contraint-elle les agences de communication à restructurer leur modèle économique historique pour survivre à un choc déflationniste technologique ?",
      },
      steps: [],
      notes: {
        script: `D'où ma problématique : comment l'intelligence artificielle générative contraint-elle les agences de communication à restructurer leur modèle économique historique pour survivre à un choc déflationniste technologique ?`,
        silences: [],
      },
    },

    /* ---------- E07 · Bloc 3 · Deux côtés de la table ---------- */
    {
      id: 'E07',
      bloc: 3,
      titreInterne: 'Deux côtés de la table',
      fond: 'papier',
      entreeCible: '5:00',
      transitionIn: { type: 'glissement', direction: 'gauche', dureeMs: 500 },
      objet: { kind: 'absent' },
      layout: 'deux-cotes',
      donnees: {
        gauche: {
          titre: 'Côté agence',
          items: [
            { nom: 'Jean-Jacques Rebouil', role: 'Directeur associé · relation client' },
            { nom: 'Ludovic Chevallier', role: 'Partner · mécanique commerciale' },
            { nom: 'David Kajman', role: 'DAF · traduction comptable et tarifaire' },
          ],
        },
        droite: {
          titre: 'Côté annonceur',
          items: [{ nom: 'Élise Pierin', role: 'Acheteuse · FDJ United' }],
        },
        pastilles: [
          '3 regards de conférence',
          'Enquête : 34 répondants',
          'Comptes 2024-2026 : Publicis, Havas, WPP',
        ],
        transparence: [
          '4 entretiens sur 10 demandés, assumé',
          "Rédigé avec l'IA, sous supervision",
          "Audit indépendant de l'appareil de notes",
        ],
      },
      steps: [
        {
          id: 'E07.transparence',
          mode: 'beat',
          action: { type: 'reveler', cible: 'transparence' },
          pourquoi:
            "Le panneau de transparence n'apparaît qu'au moment où l'orateur l'assume, pour que l'aveu reste un geste et non un décor.",
          repereParole: 'Un mot de transparence',
        },
      ],
      notes: {
        script: `Pour répondre à une question économique, je suis allé m'asseoir des deux côtés de la table.

Le cœur du dispositif, ce sont quatre entretiens semi-directifs, choisis pour couvrir quatre fonctions de la chaîne de décision. Côté agence, un directeur associé, Jean-Jacques Rebouil, pour la relation client, en entretien exploratoire dès décembre 2025 ; un partner et directeur d'entité, Ludovic Chevallier, pour la mécanique commerciale d'un métier de volume ; et un directeur administratif et financier, David Kajman, pour la traduction comptable et tarifaire du choc, un regard rare, et vous verrez qu'il est décisif. (r) Et côté annonceur, une acheteuse, Élise Pierin, chez FDJ United, c'est-à-dire la fonction même que les agences décrivent comme leur principal verrou, que j'ai interrogée en direct plutôt que par ouï-dire.

S'y ajoutent trois regards de conférence, en janvier 2026 : un fondateur d'agence indépendante, une créative de BETC Fullsix, et un responsable innovation de Prodigious, la société de production du groupe Publicis. En miroir, une enquête quantitative de trente-quatre répondants, douze annonceurs et onze producteurs interrogés sur les mêmes objets, close le 2 août : un échantillon de convenance, que j'exploite en nombres absolus, jamais en pourcentages trompeurs. Enfin, le troisième pilier est documentaire : les comptes 2024-2026 de Publicis, Havas et WPP, les textes réglementaires et la littérature académique, soit vingt-six sources, deux cent trente et une notes, et un benchmark de dispositifs comparés.

Un mot de transparence, parce qu'il structure tout le reste. Le référentiel demandait dix entretiens, et j'en ai conduit quatre, plus les trois intervenants de conférence. Je l'assume, et je l'ai compensé par deux choix : d'abord la couverture fonctionnelle, les deux côtés de la table y compris les achats ; ensuite le benchmark financier, qui fait parler les comptes là où les discours se taisent. Et l'entretien le plus différenciant qui me manque, un directeur achats de grand compte, est identifié comme tel dans mes limites. (r)

Dernière précision : ce mémoire a été rédigé avec l'IA comme moteur de rédaction, sous ma supervision. La note méthodologique y consacre un chapitre, les annexes documentent les interactions, et un audit indépendant que j'ai commandé a vérifié l'appareil de notes. J'y reviendrai avec plaisir en questions.`,
        silences: [],
      },
    },

    /* ---------- E08 · Bloc 4 · Titre du diagnostic ---------- */
    {
      id: 'E08',
      bloc: 4,
      titreInterne: 'Mesuré partout, facturé nulle part',
      fond: 'bleu',
      entreeCible: '8:04',
      transitionIn: { type: 'bascule-fond', dureeMs: 700 },
      objet: { kind: 'absent' },
      layout: 'titre-plein',
      donnees: { titre: 'Mesuré partout, facturé nulle part' },
      steps: [],
      notes: {
        script: `Premier mouvement : le diagnostic. Le marché français pèse 35,2 milliards d'euros en 2025, et pourtant le choc que je vais vous décrire ne se lit sur aucune facture. Je le nomme déflation latente : une pression baissière continue sur le prix de l'exécution, qui n'apparaît pas dans les barèmes mais opère dans les grilles, les ratios et les recrutements. J'en donne trois preuves : une scène de négociation, des comptes publiés, et mon enquête.`,
        silences: [],
      },
    },

    /* ---------- E09 · Bloc 4 · L'arithmétique Kajman ---------- */
    {
      id: 'E09',
      bloc: 4,
      titreInterne: 'Arithmétique Kajman',
      fond: 'bleu',
      entreeCible: '~8:50',
      transitionIn: { type: 'fondu', dureeMs: 500 },
      objet: { kind: 'barre', joursFantomes: 0, position: 'centre' },
      layout: 'arithmetique',
      donnees: {
        kicker: "La négociation annuelle · l'arithmétique",
        lignes: [
          { label: 'Tenté sur le prix unitaire', valeur: '+13 à 20 %' },
          { label: 'Imposé sur les jours', valeur: '÷ 2' },
          { label: 'Résultat sur le revenu', valeur: '≈ −40 %' },
        ],
        legendeBarre: {
          gauche: 'La mission facturée, en journées',
          droite: '−50 % des jours',
        },
        source: 'David Kajman, directeur administratif et financier, Havas Paris',
      },
      steps: [
        {
          id: 'E09.ligne-1',
          mode: 'beat',
          action: { type: 'reveler', cible: 'ligne-1' },
          pourquoi: 'Le premier chiffre tombe exactement sur le mot qui le prononce.',
          repereParole: '13 à 20 %',
        },
        {
          id: 'E09.ligne-2',
          mode: 'beat',
          action: { type: 'reveler', cible: 'ligne-2' },
          pourquoi: "La riposte du client s'affiche au moment où elle est citée.",
          repereParole: 'divisez le nombre de jours par deux',
        },
        {
          id: 'E09.amputation',
          mode: 'chaine',
          delaiMs: 600,
          action: {
            type: 'objet',
            versEtat: { kind: 'barre', joursFantomes: 5, position: 'centre' },
            dureeMs: 1400,
          },
          pourquoi:
            "La barre perd la moitié de ses journées sous les yeux du jury : l'amputation se vit en direct au lieu de se décrire.",
          repereParole: "Posons l'arithmétique",
        },
        {
          id: 'E09.ligne-3',
          mode: 'beat',
          action: { type: 'reveler', cible: 'ligne-3' },
          pourquoi: "Le verdict de −40 % conclut l'arithmétique au moment où il est chiffré.",
          repereParole: "de l'ordre de 40 %",
        },
      ],
      notes: {
        script: `La scène d'abord, restituée par David Kajman, le directeur financier d'Havas Paris. La discussion annuelle des tarifs a changé de nature, parce que le client arrive désormais outillé, et qu'il ouvre par un constat : « avec l'IA, vous mettez trois fois moins de temps ». L'agence, dont les coûts ne baissent pas d'autant, tente alors de revaloriser sa journée, de mille cinq cents euros vers mille sept cents ou mille huit cents. Et la réponse tombe : « vous me divisez le nombre de jours par deux ». (r) Posons l'arithmétique, parce qu'elle chiffre toute ma thèse. La hausse tentée, c'est 13 à 20 % sur le prix unitaire. La riposte, elle, divise l'assiette par deux. Ce qui fait que sur le périmètre concerné, le revenu se contracte de l'ordre de 40 %. Ce sont des ordres de grandeur de témoignage, mais la structure ne dépend pas des décimales : tant que l'unité de compte reste la journée, la partie est perdue, parce que le client contrôle le nombre de journées quand l'agence ne contrôle que leur prix. Et le verdict du directeur financier tombe : « ce n'est même pas une bonne réponse ». Il n'existe pas de bonne réponse à l'intérieur du système de prix hérité. ◆ S3`,
        silences: ['S3'],
      },
    },

    /* ---------- E10 · Bloc 4 · Les quatre lignes Havas ---------- */
    {
      id: 'E10',
      bloc: 4,
      titreInterne: 'Quatre lignes Havas',
      fond: 'bleu',
      entreeCible: '~10:40',
      transitionIn: { type: 'glissement', direction: 'haut', dureeMs: 600 },
      objet: { kind: 'barre', joursFantomes: 5, position: 'pied' },
      layout: 'lignes-comptes',
      donnees: {
        kicker: 'Havas, premier semestre 2026 — quatre lignes',
        lignes: [
          { label: 'Revenu net', valeur: '+2,5 %' },
          { label: 'Coûts refacturés aux clients', valeur: '−12,9 %' },
          { label: 'Masse salariale', valeur: '932 M€, stable' },
          { label: 'Marge', valeur: '11 %' },
        ],
        chute: "L'IA n'apparaît sur aucune ligne. Elle apparaît dans tous les ratios.",
      },
      steps: [],
      notes: {
        script: `Les comptes ensuite, publiés par Havas en juillet 2026, et quatre lignes suffisent. Le revenu net progresse de 2,5 % en organique. Les coûts refacturés aux clients reculent de 12,9 %. La masse salariale reste stable à 932 millions pour des effectifs en légère baisse. Et la marge progresse, à 11 %. Or aucune de ces lignes ne s'intitule « intelligence artificielle », et c'est toute la leçon : la productivité de l'IA n'apparaît sur aucune ligne, mais elle apparaît dans tous les ratios.

⟦RÉSERVE R2 — à prononcer seulement si avance au checkpoint 1⟧ Et la recherche confirme le mécanisme là où rien ne l'amortit : sur les places de marché de freelances, une étude d'Organization Science mesure une baisse significative de l'emploi et des revenus des métiers exposés. Ce que l'on observe en agence n'est donc pas l'absence du choc, c'est son amortissement par la marque, le contrat et la relation.`,
        silences: [],
        consignes: 'R2 se décide au CP0 (avance ≥ 45 s).',
      },
    },

    /* ---------- E11 · Bloc 4 · Figure d'enquête ---------- */
    {
      id: 'E11',
      bloc: 4,
      titreInterne: "Figure d'enquête",
      fond: 'bleu',
      entreeCible: '~11:20',
      transitionIn: { type: 'fondu', dureeMs: 500 },
      objet: { kind: 'barre', joursFantomes: 5, position: 'pied' },
      layout: 'figure-enquete',
      donnees: {
        kicker: "L'enquête — 34 répondants, en nombres absolus",
        barres: [
          {
            label: "Agences : temps de production réduit d'au moins un quart",
            valeur: 8,
            total: 11,
          },
          { label: 'Agences : gain restitué au client', valeur: 0, total: 11 },
          {
            label: "Annonceurs : attendent d'abord une baisse de prix",
            valeur: 3,
            total: 11,
          },
        ],
        lecture:
          "La négociation frontale n'a pas lieu. La déflation opère ailleurs : volumes, ratios, recrutements.",
      },
      steps: [],
      notes: {
        script: `Mon enquête referme le système, et son premier résultat est un silence symétrique : presque personne ne demande, et presque personne ne subit, de baisse de prix frontale au motif de l'IA. Et pourtant, huit répondants d'agence sur onze déclarent un temps de production réduit d'au moins un quart. Et quand je demande où va ce gain, la réponse est nette : aucun des onze ne le restitue au client, pendant qu'en face trois annonceurs sur onze attendent, en priorité, une baisse des prix. La négociation frontale n'a donc pas lieu, et c'est précisément pour cela que la déflation opère ailleurs : dans les volumes, les ratios, les recrutements.`,
        silences: [],
      },
    },

    /* ---------- E12 · Bloc 4 · Dette de vérification ---------- */
    {
      id: 'E12',
      bloc: 4,
      titreInterne: 'Dette de vérification',
      fond: 'bleu',
      entreeCible: '~12:15',
      transitionIn: { type: 'masque-montant', dureeMs: 600 },
      objet: { kind: 'barre', joursFantomes: 5, position: 'pied' },
      layout: 'terme-seul',
      donnees: {
        terme: 'Dette de vérification',
        sousLigne: "Deloitte, Australie : le premier remboursement de l'ère générative",
      },
      steps: [],
      notes: {
        script: `Ce diagnostic a enfin un coût caché, et je le nomme dette de vérification : le coût croissant du contrôle, du sourçage et de la correction des contenus générés, que personne ne facturait et que quelqu'un paie toujours. L'accident fondateur existe déjà : Deloitte, en Australie, a été contraint de rembourser un rapport truffé de références générées. Le premier remboursement de l'ère générative. (r) Et une nuance, parce qu'elle conditionne tout le reste : cette déflation trie, elle ne rase pas. L'idée dont personne ne garantit le succès, la responsabilité qu'un annonceur ne peut pas internaliser, la singularité prouvée : tout cela résiste. Ce qui s'évide, c'est le temps d'exécution codifiable.`,
        silences: [],
      },
    },

    /* ---------- E13 · Bloc 5 · Trois plans en trois colonnes ---------- */
    {
      id: 'E13',
      bloc: 5,
      titreInterne: 'Trois plans',
      fond: 'bleu',
      entreeCible: '13:04',
      transitionIn: { type: 'glissement', direction: 'gauche', dureeMs: 500 },
      objet: { kind: 'barre', joursFantomes: 5, position: 'pied' },
      layout: 'trois-colonnes',
      donnees: {
        colonnes: [
          {
            titre: 'Publicis · CoreAI',
            montant: '300 M€ sur 3 ans',
            details: [
              '12 Md€ déjà investis dans la donnée',
              'LiveRamp rachetée : 2,2 Md$',
              'S1 2026 : +4,7 %, marge 17,5 %',
            ],
          },
          {
            titre: 'Havas · Converged',
            montant: '400 M€ sur 4 ans',
            details: [
              'Parti pris inverse : système agnostique',
              'Interopérable avec les outils clients',
            ],
          },
          {
            titre: 'WPP · Open Pro',
            montant: "L'usine mise en vente",
            details: ["L'accès à sa production, vendu", "L'outil est devenu l'actif"],
          },
        ],
      },
      steps: [],
      notes: {
        script: `Deuxième mouvement. Les groupes n'ont pas attendu, mais regardez bien où ils ont répondu : dans le bilan, pas dans la facture. C'est un pivot d'une économie de main-d'œuvre, des charges, vers une économie d'actifs technologiques, du capital.

Publicis d'abord. En janvier 2024, le groupe annonce le plan CoreAI : 300 millions d'euros sur trois ans, moitié talents, moitié technologie, sur un socle de 12 milliards déjà investis dans la donnée, dont Epsilon et ses 2,3 milliards de profils. Et il poursuit par le capital, en rachetant LiveRamp en mai 2026 pour 2,2 milliards de dollars. Or les résultats suivent : au premier semestre 2026, la croissance organique atteint 4,7 %, la marge 17,5 %, et le groupe revendique son vingtième trimestre consécutif de surperformance. Je reste prudent sur l'attribution, mais le marché a tranché : dans un secteur dont les revenus reculent, le groupe qui a le plus investi dans l'actif est aussi celui qui croît. Et Havas comme WPP suivent, chacun à sa manière : 400 millions pour l'un, la vente de sa propre usine pour l'autre.

⟦RÉSERVE R1 — à prononcer seulement si avance au checkpoint 1⟧ Havas emprunte un chemin voisin avec Converged, 400 millions sur quatre ans, mais avec un parti pris inverse : un système agnostique, interopérable avec les outils des clients. Et WPP pousse la logique au bout avec Open Pro, en vendant l'accès à sa propre usine de production : le jour où l'agence a vendu son outil, elle a admis que l'outil était devenu l'actif.`,
        silences: [],
        consignes: 'R1 se décide au CP1 (avance ≥ 45 s).',
      },
    },

    /* ---------- E14 · Bloc 5 · Pyramide → diamant ---------- */
    {
      id: 'E14',
      bloc: 5,
      titreInterne: 'Pyramide → diamant',
      fond: 'bleu',
      entreeCible: '~14:25',
      transitionIn: { type: 'fondu', dureeMs: 500 },
      objet: { kind: 'barre', joursFantomes: 5, position: 'pied' },
      layout: 'pyramide-diamant',
      donnees: {
        avant: 'La pyramide',
        apres: 'Le diamant',
        centre: 'Le senior augmenté',
      },
      steps: [
        {
          id: 'E14.morph',
          mode: 'beat',
          action: { type: 'reveler', cible: 'morph-diamant' },
          pourquoi:
            'La pyramide se déforme en diamant pendant que la phrase le dit : la transformation est vue, pas annoncée.',
          repereParole: 'devient un diamant',
        },
      ],
      notes: {
        script: `Ce pivot a une traduction humaine : la pyramide des talents devient un diamant. Le modèle historique des firmes de services finançait tout sur une base large de juniors, dont on vendait les journées avec marge et qui apprenaient en exécutant. Or l'IA vide précisément le travail d'exécution codifiable qu'on leur confiait, et c'est tout le levier économique du modèle qui casse. Sur le terrain, cela ne donne pas des plans sociaux : cela donne des recrutements qui ne se font pas. C'est une déflation latente de l'emploi, qui inverse la pyramide d'apprentissage. Et au centre du diamant apparaît le senior augmenté : moins de bras, plus de direction d'outils, plus de vérification.

Le troisième chantier, c'est l'industrialisation : produire beaucoup plus pour le même budget, la parade volumétrique. Mais elle rencontre une contre-force : c'est l'acheteur qui devient le régulateur du volume, parce que produire plus ne vaut que si quelqu'un veut acheter plus. (r)`,
        silences: [],
      },
    },

    /* ---------- E15 · Bloc 5 · Une usine sans caisse enregistreuse ---------- */
    {
      id: 'E15',
      bloc: 5,
      titreInterne: 'Usine sans caisse',
      fond: 'noir',
      entreeCible: '~16:05',
      transitionIn: { type: 'bascule-fond', dureeMs: 700 },
      objet: { kind: 'absent' },
      layout: 'titre-plein',
      donnees: { titre: 'Une usine sans caisse enregistreuse' },
      steps: [],
      notes: {
        script: `Voilà où en est le secteur : trois chantiers réels, financés, documentés dans les comptes, et qui transforment tous l'outil de production. Mais aucun ne transforme la facture. À la fin de ce deuxième mouvement, l'agence est devenue une usine sans caisse enregistreuse. ◆ S4 Il reste à construire la caisse, et c'est ma troisième partie, le cœur de ma thèse.`,
        silences: ['S4'],
      },
    },

    /* ---------- E16 · Bloc 6 · Le simulateur ---------- */
    {
      id: 'E16',
      bloc: 6,
      titreInterne: 'Simulateur',
      fond: 'bleu',
      entreeCible: '16:26',
      transitionIn: { type: 'bascule-fond', dureeMs: 700 },
      objet: { kind: 'barre', joursFantomes: 0, position: 'centre' },
      layout: 'simulateur',
      donnees: {},
      steps: [],
      notes: {
        script: `Avant de vous donner ma réponse, je veux vous montrer le problème.

[SIMULATEUR — 60 à 90 secondes de manipulation. Parole minimale, gestes lents, laisser le jury lire l'écran. Séquence :]

1. Contrat type affiché : mission facturée au taux journalier, marge visible.

> Voici un contrat au temps passé, classique, rentable.

2. Monter lentement le curseur « gain de productivité IA » de 0 à 50 %. Les jours facturés fondent, le revenu s'effondre, à valeur créée constante pour le client.

> Je monte le gain de productivité. Regardez le revenu. ◆ S5 La valeur créée pour le client n'a pas bougé, et pourtant le revenu de l'agence a disparu.

3. Basculer l'interrupteur « prix étagé ». La même mission se redistribue en quatre lignes, la marge tient.

> Même mission, autre unité de compte : la marge tient. Voilà ce que je vais vous détailler.`,
        silences: ['S5'],
        consignes: 'Gestes lents. Laisser le jury lire. Le simulateur absorbe ±15 s.',
      },
    },

    /* ---------- E17 · Bloc 6 · Les quatre étages ---------- */
    {
      id: 'E17',
      bloc: 6,
      titreInterne: 'Quatre étages',
      fond: 'bleu',
      entreeCible: '~17:45',
      transitionIn: { type: 'morph-objet', dureeMs: 800 },
      objet: { kind: 'strates', etiquettes: true, position: 'centre' },
      layout: 'quatre-etages',
      donnees: {
        etages: [
          {
            nom: 'Le conseil',
            metrique: 'au temps',
            ancrage: '« tous les consultants restent au temps passé »',
          },
          {
            nom: 'La production',
            metrique: 'au livrable',
            ancrage: 'déjà opérant sur les gros contrats',
          },
          {
            nom: 'La création',
            metrique: 'aux droits',
            ancrage: 'CSPLA, juillet 2026 : direction créative humaine démontrable',
          },
          {
            nom: "L'effet",
            metrique: 'au variable, couloir 90/110',
            ancrage: "« Havas Delta, c'est de la rémunération »",
          },
        ],
      },
      steps: [],
      notes: {
        script: `Ma thèse tient en une phrase : on ne remplace pas le modèle au temps, on le stratifie. Quatre étages, une métrique par nature de travail. Et chacun de ces étages existe déjà dans mon corpus.

Le premier étage garde le conseil au temps, parce que l'erreur historique n'était pas de vendre du temps : c'était de tout vendre en temps. Le directeur financier le confirme : tous les consultants restent au temps passé. (r) Le deuxième étage bascule la production au livrable : un coût en face d'un visuel, un coût en face d'une animation. Cette palette, Ludovic Chevallier la décrit déjà opérante sur les gros contrats. Le troisième étage vend la création en droits et en usage, et le droit vient de basculer : depuis les travaux du CSPLA de juillet 2026, protéger une œuvre assistée par IA suppose une direction créative humaine démontrable. Le dossier de création devient donc une pièce contractuelle, donc une licence, donc un revenu. (r) Et le quatrième étage indexe l'effet sur un variable symétrique. Havas a déjà l'outil, Delta, et son directeur financier le dit : « Havas Delta, c'est de la rémunération ». Avec cette conséquence : « là, on est partenaires ».`,
        silences: [],
      },
    },

    /* ---------- E18 · Bloc 6 · Les trois verrous ---------- */
    {
      id: 'E18',
      bloc: 6,
      titreInterne: 'Trois verrous',
      fond: 'bleu',
      entreeCible: '~19:25',
      transitionIn: { type: 'fondu', dureeMs: 500 },
      objet: { kind: 'strates', etiquettes: false, position: 'retrait' },
      layout: 'verrous',
      donnees: {
        verrous: [
          {
            nom: 'La trésorerie',
            objection: '−76 M€ au 30 juin 2026',
            parade: 'Quatre garde-fous : socle fixe, plafonds, avance, trimestres',
          },
          {
            nom: "L'audit",
            objection: "Qui prouve l'effet ?",
            parade: "Un indicateur attribuable, jamais le chiffre d'affaires global",
          },
          {
            nom: 'Les achats',
            objection: 'Le verrou historique',
            parade: "Le mur s'est retourné : 3 marques sur 4 veulent changer",
          },
        ],
      },
      steps: [
        {
          id: 'E18.verrou-1-tombe',
          mode: 'beat',
          action: { type: 'barrer', cible: 'verrou-1' },
          pourquoi:
            "Le verrou de trésorerie se barre quand l'orateur passe au suivant : la parade vient d'être donnée.",
          repereParole: "Le verrou de l'audit ensuite",
        },
        {
          id: 'E18.verrou-2-tombe',
          mode: 'beat',
          action: { type: 'barrer', cible: 'verrou-2' },
          pourquoi: "Le verrou de l'audit se barre quand l'orateur attaque le mur des achats.",
          repereParole: 'Le mur des achats, enfin',
        },
      ],
      notes: {
        script: `Restent trois verrous, et je les prends dans l'ordre, avec la parade pour chacun.

Le verrou de trésorerie d'abord, et il est fondé : au 30 juin 2026, Havas affiche une trésorerie nette négative de 76 millions, et un fonds de roulement qui a absorbé 212 millions sur le semestre. Un success fee intégral serait donc irresponsable. Mais l'objection tombe contre un variable architecturé, en quatre clauses : un socle fixe au livrable, qui couvre les coûts directs, de sorte que le risque porte sur la marge, jamais sur les salaires ; un variable plafonné dans les deux sens ; une avance sur résultats, qui finance le cycle ; et une constatation trimestrielle, qui fractionne le différé. ⟦COUPE C5 — début⟧ Sur un dispositif d'un million d'euros, cela donne quatre-vingt-dix pour cent de socle et un couloir symétrique de plus ou moins cent mille : quoi qu'il arrive, l'exercice n'est pas déficitaire. ⟦COUPE C5 — fin⟧

Le verrou de l'audit ensuite : comment indexer un paiement sur une performance que personne ne sait attribuer ? Or la théorie des incitations en a fait un cahier des charges. Holmström, prix Nobel 2016, impose un indicateur attribuable, jamais le chiffre d'affaires global de l'annonceur ; Milgrom ajoute un panier restreint, avec une composante de marque ; et le variable reste minoritaire, par construction de l'étagement. Et mon acheteuse pose elle-même la clause type : pas de supplément déclaratif « parce que tu participes à l'IA », mais des gains cherchés ensemble, un co-investissement documenté, un prorata. (r)

Le mur des achats, enfin, et c'est mon résultat le plus contre-intuitif : ce mur s'est retourné. La World Federation of Advertisers, fin 2024, sur plus de quatre-vingts annonceurs multinationaux : trois marques sur quatre veulent changer de modèle sous trois ans, 58 % veulent davantage de rémunération à l'effet, et 87 % jugent les modèles actuels opaques. Et la preuve française vient de mon terrain : dans les appels d'offres, les acheteurs exigent désormais une grille IA, en livrables et en coûts d'outillage. Élise Pierin le dit : « ce qu'on avait précédemment négocié, ça ne marche plus du tout ». L'objection des achats n'est donc pas une objection au principe, c'est une objection à l'outillage. Et une objection d'outillage, ça se lève avec de l'outillage.`,
        silences: [],
        consignes: 'Le verrou 3 se barre dans la transition vers la frise.',
      },
    },

    /* ---------- E19 · Bloc 7 · La frise 24 mois ---------- */
    {
      id: 'E19',
      bloc: 7,
      titreInterne: 'Frise 24 mois',
      fond: 'bleu',
      entreeCible: '23:02',
      transitionIn: { type: 'morph-objet', dureeMs: 1800 },
      objet: { kind: 'frise', allumes: 0 },
      layout: 'frise-24-mois',
      donnees: {
        segments: [
          {
            nom: 'T1',
            periode: 'Trimestre 1',
            decisions: [
              'Plus aucune réponse au seul temps passé : double grille',
              'Inventaire : trois listes',
              'Reconversion : un poste de contrôle pour chaque poste vidé',
            ],
          },
          {
            nom: 'T2-T3',
            periode: 'Trimestres 2-3',
            decisions: [
              'La preuve devient un produit (article 50)',
              "Premier couloir à l'effet : 90/110, revoyure trimestrielle",
            ],
          },
          {
            nom: 'T4',
            periode: 'Trimestre 4',
            decisions: [
              "Bilan de bascule : 15 à 25 % du chiffre d'affaires hors temps passé",
              'Le sort du couloir décide de la suite',
            ],
          },
          {
            nom: 'Année 2',
            periode: 'Deuxième année',
            decisions: [
              "L'étage des droits, généralisé",
              "L'interface : le catalogue lisible par les acheteurs",
            ],
          },
        ],
        ligneDeCrete:
          "La grille finance la preuve, la preuve finance le couloir, le couloir finance les droits, les droits financent l'interface.",
      },
      steps: [
        {
          id: 'E19.t1',
          mode: 'beat',
          action: { type: 'objet', versEtat: { kind: 'frise', allumes: 1 }, dureeMs: 700 },
          pourquoi: "Le premier segment s'allume quand le trimestre est nommé : l'écran suit la parole.",
          repereParole: 'Au premier trimestre',
        },
        {
          id: 'E19.t2-t3',
          mode: 'beat',
          action: { type: 'objet', versEtat: { kind: 'frise', allumes: 2 }, dureeMs: 700 },
          pourquoi: "Le deuxième segment s'allume à la nomination des trimestres deux et trois.",
          repereParole: 'Aux trimestres deux et trois',
        },
        {
          id: 'E19.t4',
          mode: 'beat',
          action: { type: 'objet', versEtat: { kind: 'frise', allumes: 3 }, dureeMs: 700 },
          pourquoi: "Le troisième segment s'allume au moment du bilan de bascule.",
          repereParole: 'Au quatrième trimestre',
        },
        {
          id: 'E19.annee-2',
          mode: 'beat',
          action: { type: 'objet', versEtat: { kind: 'frise', allumes: 4 }, dureeMs: 700 },
          pourquoi: "Le dernier segment s'allume quand la deuxième année ouvre les chantiers lourds.",
          repereParole: 'La deuxième année',
        },
        {
          id: 'E19.ligne-de-crete',
          mode: 'chaine',
          delaiMs: 1200,
          action: { type: 'reveler', cible: 'ligne-crete' },
          pourquoi:
            "La ligne de crête se révèle d'elle-même une fois la frise entièrement allumée, pour clore le bloc sans clic.",
          repereParole: 'une ligne de crête traverse ces vingt-quatre mois',
        },
      ],
      notes: {
        script: `Des principes ne valent que traduits en décisions datées. Voici donc la feuille de route : vingt-quatre mois, pensée pour Havas Paris, transposable à toute structure qui vend encore du temps.

Au premier trimestre, deux décisions, dont la première ne coûte rien et conditionne tout : plus aucun appel d'offres ne reçoit de réponse au seul temps passé. Chaque proposition sort en double colonne, grille classique et grille par livrable, coûts d'outillage détaillés : on devance la grille IA que les acheteurs demandent déjà. En parallèle, un inventaire arrête trois listes : les livrables standardisables, le conseil légitimement au temps, les productions qui peuvent porter un dossier de droits. (r) La seconde décision est sociale, et je la considère non négociable : un plan de reconversion des profils d'exécution vers les deux fonctions croissantes du diagnostic, la vérification et la direction des outils, financé par la rente de formation. Et la cible se vérifie : chaque poste d'exécution que la machine vide doit trouver, dans le même exercice, sa contrepartie en poste de contrôle. Parce qu'à défaut, le diamant n'est pas une transformation, c'est un plan social qui ne dit pas son nom.

Aux trimestres deux et trois, la preuve et le premier couloir. ⟦COUPE C3 — début⟧ D'un côté, on industrialise la preuve : la conformité à l'article 50 du règlement européen, d'application depuis le 2 août 2026, marquage, registres, certificats. Et pas la conformité minimale : le produit vendable, l'aval humain facturé en prime, avec pour premier contrat cible un annonceur régulé, banque, santé ou jeux d'argent. ⟦COUPE C3 — fin⟧ De l'autre, on ouvre le premier couloir à l'effet, sur un périmètre unique : quatre-vingt-dix, cent dix, revoyure trimestrielle. Et le contrat cible n'est pas le plus gros client, c'est le plus instrumenté, parce que l'objectif n'est pas le revenu : c'est le précédent.

Au quatrième trimestre, le bilan de bascule, sur trois indicateurs : la part du chiffre d'affaires hors temps passé, cible de 15 à 25 % à un an ; le sort du couloir ; et l'évolution de la rente de formation. Et si le couloir finit en litige, on ne s'arrête pas : on rétrograde vers l'instrumentation, parce qu'un deuxième précédent contesté vaudrait jurisprudence contre l'agence.

La deuxième année ouvre les deux chantiers lourds : l'étage des droits, généralisé sur les productions majeures avec les premières licences d'usage, et l'interface : exposer le catalogue, grilles, certificats et mesures, dans des formats lisibles par les systèmes d'achat des annonceurs, à mesure que les protocoles agentiques se standardisent. (r)

Et une ligne de crête traverse ces vingt-quatre mois : à aucun moment on n'abandonne le temps passé. On le cantonne, pièce par pièce, aux missions où il reste l'étalon honnête. Et chaque pièce déménagée est payée par la précédente : la grille finance la preuve, la preuve finance le couloir, le couloir finance les droits, et les droits financent l'interface. Ce qui fait qu'au terme des vingt-quatre mois, l'agence n'a renoncé à aucun revenu, et elle a quatre étages là où elle n'avait qu'un guichet.`,
        silences: [],
        consignes: 'C3/C6/C5 se décident au CP3.',
      },
    },

    /* ---------- E20 · Bloc 8 · Trois suites ---------- */
    {
      id: 'E20',
      bloc: 8,
      titreInterne: 'Trois suites',
      fond: 'papier',
      entreeCible: '27:18',
      transitionIn: { type: 'bascule-fond', dureeMs: 700 },
      objet: { kind: 'absent' },
      layout: 'trois-suites',
      donnees: {
        suites: [
          "Havas Paris Social, en poste fin septembre : la feuille de route a un terrain d'épreuve",
          'Trois concepts livrés : déflation latente, dette de vérification, prix étagé',
          "D'autres travaux devront tester ces mécanismes ailleurs",
        ],
      },
      steps: [],
      notes: {
        script: `Trois convictions résument ce parcours. La contrainte s'exerce par trois canaux : le prix, qui opère en silence ; le travail, frappé par les recrutements qui ne se font pas ; et la confiance, grevée par la dette de vérification. Et la survie passe par trois déplacements : comptable, des charges vers les actifs ; tarifaire, le prix étagé ; et commercial, la preuve devenue produit.

Les limites bornent la portée de ce travail, et je les dis : un corpus riche mais resserré, ancré dans un grand groupe et chez un annonceur unique ; une enquête qui éclaire des mécanismes plus qu'elle ne mesure un marché ; et une fenêtre brûlante : ce mémoire s'écrit au milieu de l'événement, entre un règlement appliqué seize jours avant le dépôt et des semestriels intégrés le matin de leur publication. C'est ce qui lui donne sa valeur documentaire, et c'est ce qui lui interdit la prétention au recul.

Les suites maintenant, et elles sont déjà engagées. Fin septembre, je rejoins Havas Paris Social en poste, ce qui veut dire que la feuille de route que je viens de vous présenter cesse d'être un exercice académique : elle a un terrain d'épreuve réel, et je compte bien la confronter, trimestre par trimestre, à la maison qui me l'a inspirée.

⟦RÉSERVE R3 — à prononcer seulement si avance au checkpoint 3⟧ Deuxième suite : proposer la tripartition comptable de ce mémoire à une revue professionnelle, pour la soumettre à plus compétent que moi.

Et la dernière suite est plus modeste : d'autres travaux devront tester ces mécanismes sur d'autres groupes, d'autres marchés, d'autres années. Je livre des concepts, la déflation latente, la dette de vérification, le prix étagé, et une méthode : à trois reprises, le terrain a corrigé mon plan, et ces corrections valent mieux que les hypothèses qu'elles ont remplacées. (r)

S'il fallait tout résumer en une phrase, ce serait celle-ci. ◆ S6`,
        silences: ['S6'],
        consignes:
          "R3 se décide au CP3 (avance ≥ 30 s). Si l'avance persiste : ralentir, allonger les silences.",
      },
    },

    /* ---------- E21 · Bloc 8 · Le renversement ---------- */
    {
      id: 'E21',
      bloc: 8,
      titreInterne: 'Renversement',
      fond: 'noir',
      entreeCible: '~29:40',
      transitionIn: { type: 'bascule-fond', dureeMs: 900 },
      objet: { kind: 'absent' },
      layout: 'renversement',
      donnees: {
        phrase1: "Ce n'est pas l'intelligence artificielle qui tue l'agence.",
        phrase2:
          "C'est l'agence qui continue de vendre du temps, dans un monde où il ne vaut plus rien.",
      },
      steps: [
        {
          id: 'E21.phrase-1',
          mode: 'beat',
          action: { type: 'reveler', cible: 'phrase-1' },
          pourquoi:
            "La première phrase apparaît en même temps qu'elle est prononcée, jamais avant.",
          repereParole: "Ce n'est pas l'intelligence artificielle",
        },
        {
          id: 'E21.phrase-2',
          mode: 'beat',
          action: { type: 'reveler', cible: 'phrase-2' },
          pourquoi: 'La seconde phrase entre sur la parole et fait reculer la première.',
          repereParole: "C'est l'agence qui continue",
        },
      ],
      notes: {
        script: `Ce n'est pas l'intelligence artificielle qui tue l'agence. C'est l'agence qui continue de vendre du temps, dans un monde où il ne vaut plus rien. ◆ S7

[Tenir le regard du jury, deux secondes pleines. Ne pas bouger. Puis :]

Je vous remercie.

[Se taire. Ne rien ajouter. Pas de « voilà ». Attendre les questions debout, mains libres.]`,
        silences: ['S7'],
        consignes:
          "Débit lent. Chaque phrase apparaît en même temps qu'elle est prononcée. Tenir le regard deux secondes après S7.",
      },
    },
  ],

  checkpoints: [
    {
      id: 'CP0',
      libelle: 'Fin bloc 3',
      sortieDe: 'E07',
      cible: '8:04',
      decisions: [
        {
          condition: { type: 'avance', seuilS: 45 },
          instruction: 'Ouvrir R2 dans le bloc 4 : la preuve Organization Science.',
        },
      ],
    },
    {
      id: 'CP1',
      libelle: 'Fin bloc 4',
      sortieDe: 'E12',
      cible: '13:04',
      decisions: [
        {
          condition: { type: 'avance', seuilS: 45 },
          instruction: 'Ouvrir R1 : Converged et Open Pro détaillés.',
        },
        {
          condition: { type: 'retard', seuilS: 45 },
          instruction:
            "Armer C3 : au bloc 7, couper le détail article 50. Raccord : « D'un côté, on industrialise la preuve de conformité, désormais obligatoire, et on la vend en prime. De l'autre... »",
        },
      ],
    },
    {
      id: 'CP2',
      libelle: 'Fin bloc 5',
      sortieDe: 'E15',
      cible: '16:26',
      decisions: [
        {
          condition: { type: 'retard', seuilS: 45 },
          instruction: 'Confirmer C3. Ne pas toucher au bloc 6 : le simulateur absorbe ±15 s.',
        },
      ],
    },
    {
      id: 'CP3',
      libelle: 'Fin bloc 6',
      sortieDe: 'E18',
      cible: '23:02',
      decisions: [
        {
          condition: { type: 'retard', seuilS: 90 },
          instruction: 'Activer C3 + C6 + C5. C5 en dernier recours : ce chiffre parle à Diagne.',
        },
        {
          condition: { type: 'retard', seuilS: 45 },
          instruction: 'Activer C3 + C6.',
        },
        {
          condition: { type: 'avance', seuilS: 30 },
          instruction: 'Ouvrir R3 : la tripartition comptable, pour une revue professionnelle.',
        },
      ],
    },
    {
      id: 'CP4',
      libelle: 'Fin bloc 7',
      sortieDe: 'E19',
      cible: '27:18',
      decisions: [
        {
          condition: { type: 'avance', seuilS: 30 },
          instruction:
            "R3 déjà décidé au CP3. Si l'avance persiste : ne rien rajouter, ralentir, allonger les deux silences finaux.",
        },
      ],
    },
    {
      id: 'FIN',
      libelle: 'Atterrissage',
      sortieDe: null,
      cible: '30:04',
      decisions: [],
    },
  ],

  coupes: [
    {
      id: 'C3',
      bloc: 7,
      gainS: 40,
      contenuSacrifie: 'Détail article 50 / client régulé',
      phraseRaccord:
        "« D'un côté, on industrialise la preuve de conformité, désormais obligatoire, et on la vend en prime. De l'autre... »",
    },
    {
      id: 'C5',
      bloc: 6,
      gainS: 30,
      contenuSacrifie: 'Exemple chiffré 1 M€ du couloir',
      phraseRaccord:
        "Enchaîner directement sur « Le verrou de l'audit ensuite... » — dernier recours, ce chiffre parle à Diagne",
    },
    {
      id: 'C6',
      bloc: 7,
      gainS: 35,
      contenuSacrifie: 'Compression du trimestre 4 en une phrase',
      phraseRaccord:
        "« À douze mois, trois indicateurs décident de la suite, avec une cible de 15 à 25 % du chiffre d'affaires hors temps passé. »",
    },
  ],

  reserves: [
    {
      id: 'R1',
      bloc: 5,
      coutS: 30,
      contenu: 'Converged + WPP Open Pro détaillés',
      declencheur: 'Checkpoint 1 en avance ≥ 45 s',
    },
    {
      id: 'R2',
      bloc: 4,
      coutS: 30,
      contenu: 'Preuve académique Organization Science',
      declencheur:
        "Checkpoint 1 en avance ≥ 45 s (R2 se décide en entrant dans le bloc 4, donc sur l'avance constatée à la fin du bloc 3)",
    },
    {
      id: 'R3',
      bloc: 8,
      coutS: 15,
      contenu: 'Tripartition comptable / revue professionnelle',
      declencheur: 'Checkpoint 3 en avance ≥ 30 s',
    },
  ],
};
