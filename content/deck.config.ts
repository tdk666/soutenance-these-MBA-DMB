import type { DeckConfig } from '../src/types';

export const deckConfig: DeckConfig = {
  meta: {
    titre: 'Vendre du temps dans un monde où il ne vaut plus rien',
    orateur: 'Théophile Dequecker',
    date: '4 septembre 2026',
    dureeCible: '30:08',
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
      titreInterne: "Noir, l'adresse",
      fond: 'noir',
      entreeCible: '0:00',
      transitionIn: { type: 'aucune' },
      objet: { kind: 'absent' },
      layout: 'noir-vide',
      donnees: {},
      steps: [],
      notes: {
        script: `◈ Monsieur, vous avez lu ces cent vingt pages, et je ne vais pas vous les relire. Ce que je vous propose, c'est le tri que la thèse ne pouvait pas faire : les quelques chiffres qui portent toute ma démonstration, et ce que j'en fais à partir de lundi matin. (r) Et pour commencer, je vous ramène au 3 février 2026.`,
        silences: [],
      },
    },

    /* ---------- E02 · Bloc 1 · « 3 février 2026 » ---------- */
    {
      id: 'E02',
      bloc: 1,
      titreInterne: '3 février 2026',
      fond: 'noir',
      entreeCible: '~0:34',
      transitionIn: { type: 'fondu', dureeMs: 600 },
      objet: { kind: 'absent' },
      layout: 'ligne-seule',
      donnees: { texte: '3 février 2026' },
      steps: [],
      notes: {
        script: `Ce matin-là, tout annonce pour Publicis une excellente journée. Le premier groupe de communication mondial publie ses résultats annuels, tout dépasse les attentes des analystes, et la marge est la meilleure de son histoire. Et pourtant, à la clôture, l'action perd 9,24 %. Plus forte chute du CAC 40 de la séance. ◆ S1`,
        silences: ['S1'],
      },
    },

    /* ---------- E03 · Bloc 1 · Le verdict −9,24 % ---------- */
    {
      id: 'E03',
      bloc: 1,
      titreInterne: '−9,24 %',
      fond: 'noir',
      entreeCible: '~1:12',
      transitionIn: { type: 'fondu', dureeMs: 600 },
      objet: { kind: 'absent' },
      layout: 'chiffre-verdict',
      donnees: { de: '0,00 %', valeur: '−9,24 %' },
      steps: [],
      notes: {
        script: `Et le même jour, l'annonce d'un simple outil d'IA juridique fait perdre plus de 10 % chacun à RELX et à Wolters Kluwer, deux géants de l'information professionnelle que rien, dans leurs comptes, ne condamnait. (r) Alors que s'est-il passé entre le communiqué du matin et le cours du soir ? Rien qui concerne les résultats, et c'est justement le point. La Bourse n'achète jamais le passé : elle achète des promesses. Or ce jour-là, une crainte s'est glissée dans toutes les promesses du secteur : et si une intelligence artificielle savait bientôt produire, en quelques minutes et pour presque rien, ce que ces entreprises vendent cher et fabriquent lentement ? (r) Ce que la séance a sanctionné, ce ne sont donc pas les résultats, c'est la machine qui les produit : le modèle économique. Ce 3 février n'était pas un accident de séance, c'était un verdict anticipé. Et mon travail s'est donné une seule tâche : comprendre sur quoi porte ce verdict, et y répondre.`,
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
      entreeCible: '2:24',
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
      entreeCible: '~2:35',
      transitionIn: { type: 'glissement', direction: 'gauche', dureeMs: 700 },
      objet: { kind: 'absent' },
      layout: 'parcours',
      donnees: {
        etapes: [
          { libelle: 'Double licence', detail: 'Histoire à la Sorbonne · Information média à Assas' },
          { libelle: 'Master IAE Aix', detail: 'Conduite du changement' },
          { libelle: 'Les Échos - Le Parisien', detail: 'Régie publicitaire' },
          { libelle: 'Air Liquide', detail: 'Le partenariat avec les Jeux de Paris' },
          { libelle: 'Havas Paris Social', detail: 'Alternance, consultant social media' },
          { libelle: 'MBA DMB', detail: 'Spécialisation IA & Data' },
        ],
      },
      steps: [],
      notes: {
        script: `Deux mots sur moi, parce qu'ils expliquent la question. Je suis un littéraire devenu communicant. J'ai d'abord suivi une double licence, histoire à la Sorbonne et information média à Assas, dans l'idée de faire du journalisme. Puis je me suis tourné vers la communication, avec un master en conduite du changement à l'IAE d'Aix-en-Provence, et ses stages : la régie publicitaire des Échos - Le Parisien, puis le partenariat avec les Jeux de Paris chez Air Liquide. Et j'ai repris une année d'études pour partir en alternance chez Havas Paris Social, comme consultant social media. (r) Si j'ai choisi ce MBA, spécialisation IA et Data, c'est précisément pour ajouter un bagage technique à ce profil. Et la démarche DMB, vous allez la voir à l'œuvre : partir de son terrain, y trouver une question de transformation, et la conduire jusqu'à des recommandations applicables lundi matin. Or mon terrain m'a placé à l'endroit exact où la valeur se négocie. (r)

Parce que mon sujet initial n'était pas celui-ci. Je voulais écrire sur la créativité : l'IA générative, menace ou moteur pour les créatifs en agence ? C'est mon coach, Bastien Jaffre, qui m'a poussé vers plus dense, plus économique. Et le terrain a fini le travail, le jour où un directeur financier m'a dit, à propos d'une idée créative : « Une super idée, ça peut se trouver en deux jours. Et ça va générer un chiffre d'affaires de malade. » Quand deux jours de travail peuvent produire un chiffre d'affaires de malade, l'unité qui facture les deux jours ne mesure plus rien de ce qui compte. (r) ◈ Je me demandais si l'IA allait remplacer les créatifs. J'ai compris que la question urgente était de savoir ce qu'elle allait remplacer dans le modèle économique qui permettait de les payer. ◆ S2`,
        silences: ['S2'],
      },
    },

    /* ---------- E06 · Bloc 2 · La problématique ---------- */
    {
      id: 'E06',
      bloc: 2,
      titreInterne: 'Problématique',
      fond: 'papier',
      entreeCible: '~5:08',
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
      entreeCible: '5:26',
      transitionIn: { type: 'glissement', direction: 'gauche', dureeMs: 500 },
      objet: { kind: 'absent' },
      layout: 'deux-cotes',
      donnees: {
        gauche: {
          titre: 'Côté agence',
          items: [
            { nom: 'Jean-Jacques Rebouil', role: 'Directeur associé · la relation client' },
            { nom: 'Ludovic Chevallier', role: "Directeur d'entité · la mécanique commerciale" },
            { nom: 'David Kajman', role: 'Directeur financier · le choc dans les comptes et les prix' },
          ],
        },
        droite: {
          titre: 'Côté annonceur',
          items: [{ nom: 'Élise Pierin', role: 'Acheteuse · FDJ United' }],
        },
        pastilles: [
          '3 regards de conférence',
          'Enquête : 34 répondants',
          'Les comptes des trois groupes',
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

Le cœur du dispositif, ce sont quatre entretiens semi-directifs, choisis pour couvrir quatre fonctions de la chaîne de décision. Côté agence : un directeur associé, Jean-Jacques Rebouil, pour la relation client, dès décembre 2025 ; un directeur d'entité, Ludovic Chevallier, pour la mécanique commerciale d'un métier de volume ; et un directeur financier, David Kajman, pour la traduction du choc dans les comptes et dans les prix, un regard rare, et vous verrez qu'il est décisif. (r) Et côté annonceur, une acheteuse, Élise Pierin, chez FDJ United, c'est-à-dire la fonction même que les agences décrivent comme leur principal verrou, que j'ai interrogée en direct plutôt que par ouï-dire.

S'y ajoutent trois regards de conférence, en janvier 2026 : un fondateur d'agence indépendante, une créative de BETC Fullsix, et un responsable innovation de Prodigious, la production du groupe Publicis. En miroir, une enquête de trente-quatre répondants, moitié annonceurs, moitié producteurs, interrogés sur les mêmes objets et close le 2 août : un échantillon de proximité, qui éclaire des mécanismes sans prétendre représenter le marché, et que j'exploite en nombres absolus, jamais en pourcentages trompeurs. Enfin, le troisième pilier est documentaire : les comptes 2024-2026 de Publicis, Havas et WPP, les textes réglementaires, la littérature académique, et plus de deux cents notes de bas de page pour tenir le tout.

Un mot de transparence, parce qu'il structure tout le reste. Le référentiel demandait dix entretiens, et j'en ai conduit quatre, plus les trois intervenants de conférence. Je l'assume, et je l'ai compensé par deux choix : la couverture des fonctions, les deux côtés de la table y compris les achats ; et les comptes publiés, qui parlent là où les discours se taisent. L'entretien le plus différenciant qui me manque, un directeur achats de grand compte, est identifié comme tel dans mes limites. (r)

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
      entreeCible: '8:28',
      transitionIn: { type: 'bascule-fond', dureeMs: 700 },
      objet: { kind: 'absent' },
      layout: 'titre-plein',
      donnees: { titre: 'Mesuré partout, facturé nulle part' },
      steps: [],
      notes: {
        script: `Premier mouvement : le diagnostic. Et je commence par une scène, parce qu'elle contient tout.

Chez Havas Paris, la discussion annuelle des tarifs a changé de nature, et c'est le directeur financier, David Kajman, qui me l'a racontée. Le client arrive désormais outillé, il a essayé les mêmes technologies que l'agence, et il ouvre par un constat : « avec l'IA, vous mettez trois fois moins de temps [pour produire des contenus] ». L'agence, dont les coûts ne baissent pas d'autant, tente alors de monter son prix de journée, de mille cinq cents euros vers mille sept cents ou mille huit cents. Et la réponse tombe : « vous me divisez le nombre de jours par deux ».`,
        silences: [],
      },
    },

    /* ---------- E09 · Bloc 4 · L'arithmétique Kajman ---------- */
    {
      id: 'E09',
      bloc: 4,
      titreInterne: 'Arithmétique Kajman',
      fond: 'bleu',
      entreeCible: '~9:35',
      transitionIn: { type: 'fondu', dureeMs: 500 },
      objet: { kind: 'barre', joursFantomes: 0, position: 'centre' },
      layout: 'arithmetique',
      donnees: {
        kicker: "La négociation annuelle · l'arithmétique",
        lignes: [
          { label: 'Tenté sur le prix', valeur: '≈ +15 %' },
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
          repereParole: 'environ 15 % sur le prix',
        },
        {
          id: 'E09.ligne-2',
          mode: 'beat',
          action: { type: 'reveler', cible: 'ligne-2' },
          pourquoi: "La riposte du client s'affiche au moment où elle est citée.",
          repereParole: 'divise le nombre de jours par deux',
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
          repereParole: "fond de l'ordre de 40 %",
        },
      ],
      notes: {
        script: `◈ Posons l'arithmétique, parce qu'elle chiffre toute ma thèse. La hausse tentée, c'est environ 15 % sur le prix. La riposte, elle, divise le nombre de jours par deux. Ce qui fait que sur les missions concernées, le revenu fond de l'ordre de 40 %. (r) Et tant que l'on compte en journées, la partie est perdue, parce que le client contrôle le nombre de journées quand l'agence ne contrôle que leur prix. Le verdict du directeur financier tombe : « ce n'est même pas une bonne réponse ». Il n'existe pas de bonne réponse à l'intérieur de ce système de prix. ◆ S3`,
        silences: ['S3'],
      },
    },

    /* ---------- E10 · Bloc 4 · Les comptes Havas ---------- */
    {
      id: 'E10',
      bloc: 4,
      titreInterne: 'Les comptes Havas',
      fond: 'bleu',
      entreeCible: '~10:55',
      transitionIn: { type: 'glissement', direction: 'haut', dureeMs: 600 },
      objet: { kind: 'barre', joursFantomes: 5, position: 'pied' },
      layout: 'lignes-comptes',
      donnees: {
        kicker: 'Havas, juillet 2026 · les comptes',
        lignes: [
          {
            label: "Tout ce que le groupe achetait à l'extérieur pour produire",
            valeur: '−13 %',
          },
          { label: 'La masse salariale', valeur: 'inchangée' },
        ],
        chute: "L'IA n'apparaît sur aucune ligne. Elle apparaît dans tous les ratios.",
      },
      steps: [],
      notes: {
        script: `Deuxième preuve : les comptes, publiés par Havas en juillet 2026. Tout ce que le groupe achetait à l'extérieur pour produire recule de 13 % : la production rentre à la maison. La masse salariale, elle, n'a pas bougé, autrement dit personne n'a été licencié. Et pourtant, la marge monte. Or aucune ligne de ces comptes ne s'intitule « intelligence artificielle », et c'est toute la leçon : la productivité de l'IA n'apparaît sur aucune ligne, mais elle apparaît dans tous les ratios.

⟦RÉSERVE R2 — à prononcer seulement si avance à la fin du bloc 3⟧ Et la recherche confirme le mécanisme là où rien ne l'amortit : sur les places de marché de freelances, une étude d'Organization Science mesure une baisse significative de l'emploi et des revenus des métiers exposés. Ce que l'on observe en agence n'est donc pas l'absence du choc, c'est son amortissement par la marque, le contrat et la relation.`,
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
      entreeCible: '~11:45',
      transitionIn: { type: 'fondu', dureeMs: 500 },
      objet: { kind: 'barre', joursFantomes: 5, position: 'pied' },
      layout: 'figure-enquete',
      donnees: {
        kicker: "L'enquête · 34 répondants, en nombres absolus",
        barres: [
          {
            label: "Agences : temps de production réduit d'au moins un quart",
            valeur: 8,
            total: 11,
          },
          { label: 'Agences : gain restitué au client', valeur: 0, total: 11 },
        ],
        lecture:
          "Personne ne demande de baisse, personne n'en subit. Et le gain de temps ne redescend jamais.",
        terme: 'Déflation latente',
      },
      steps: [
        {
          id: 'E11.bapteme-deflation',
          mode: 'beat',
          action: { type: 'reveler', cible: 'terme-deflation' },
          pourquoi:
            "Le baptême n° 1 : le terme n'apparaît qu'au moment où il est prononcé, après les trois preuves.",
          repereParole: 'que je nomme déflation latente',
        },
      ],
      notes: {
        script: `Troisième preuve : mon enquête, et son premier résultat est un silence symétrique. Presque personne ne demande, et presque personne ne subit, de baisse de prix frontale au motif de l'IA. Et pourtant, huit répondants d'agence sur onze déclarent un temps de production réduit d'au moins un quart. Et quand je demande où va ce gain, la réponse est nette : aucun ne le restitue au client, pendant qu'en face, les annonceurs, eux, attendent d'abord des prix. (r) Alors rassemblons les trois preuves : une négociation qui détruit 40 % de revenu, des comptes qui bougent dans tous leurs ratios, et un gain de temps massif que personne ne rend. Ce choc est mesuré partout, et facturé nulle part.

C'est ce phénomène que je nomme déflation latente : une baisse continue du prix réel de l'exécution, qui ne s'écrit pas dans les barèmes, mais qui opère dans les grilles, dans les ratios et dans les recrutements.

Et ce diagnostic a un dernier étage, que je raconte aussi par une histoire. Deloitte, en Australie, a livré à un gouvernement un rapport truffé de références inventées par l'IA, et a dû en rembourser une partie. Le premier remboursement de l'ère générative.`,
        silences: [],
      },
    },

    /* ---------- E12 · Bloc 4 · Dette de vérification ---------- */
    {
      id: 'E12',
      bloc: 4,
      titreInterne: 'Dette de vérification',
      fond: 'bleu',
      entreeCible: '~12:50',
      transitionIn: { type: 'masque-montant', dureeMs: 600 },
      objet: { kind: 'barre', joursFantomes: 5, position: 'pied' },
      layout: 'terme-seul',
      donnees: {
        terme: 'Dette de vérification',
      },
      steps: [],
      notes: {
        script: `Ce que cette histoire révèle, c'est un coût que personne ne facturait : celui de tout contrôler, tout sourcer, tout corriger derrière la machine. Je le nomme dette de vérification, et quelqu'un la paie toujours. (r) Et une nuance, avant d'avancer, parce qu'elle conditionne tout le reste : cette déflation trie, elle ne rase pas. L'idée dont personne ne garantit le succès, la responsabilité qu'un annonceur ne peut pas internaliser, la singularité prouvée : tout cela résiste. Ce qui s'évide, c'est le temps d'exécution codifiable.`,
        silences: [],
      },
    },

    /* ---------- E13 · Bloc 5 · Trois plans en trois colonnes ---------- */
    {
      id: 'E13',
      bloc: 5,
      titreInterne: 'Trois plans',
      fond: 'bleu',
      entreeCible: '13:24',
      transitionIn: { type: 'glissement', direction: 'gauche', dureeMs: 500 },
      objet: { kind: 'barre', joursFantomes: 5, position: 'pied' },
      layout: 'trois-colonnes',
      donnees: {
        colonnes: [
          {
            titre: 'Publicis · CoreAI',
            montant: '300 M€ sur 3 ans',
            details: [
              "20e trimestre d'affilée au-dessus de son marché",
              'Des milliards déjà investis dans la donnée',
            ],
          },
          {
            titre: 'Havas · Converged',
            montant: 'Un système ouvert',
            details: ['Branché sur les outils des clients'],
          },
          {
            titre: 'WPP · Open Pro',
            montant: "L'usine mise en vente",
            details: ["L'outil est devenu l'actif"],
          },
        ],
      },
      steps: [],
      notes: {
        script: `Deuxième mouvement. Les groupes n'ont pas attendu, mais regardez bien où ils ont répondu : dans le bilan, pas dans la facture. Ils ont déplacé l'argent : moins de salaires achetés à l'heure, plus de machines et de données possédées.

Publicis, par exemple, a mis 300 millions d'euros sur trois ans dans son système interne, CoreAI, par-dessus les milliards déjà investis dans la donnée depuis dix ans, et il continue d'acheter des briques de données au prix fort. Et pendant que les revenus du secteur reculent, Publicis vient d'aligner son vingtième trimestre d'affilée au-dessus de son marché. Je reste prudent sur les causes, mais le message est clair : le groupe qui possède le plus d'actifs est aussi celui qui croît. Et Havas comme WPP suivent, chacun à sa manière : quelques centaines de millions pour l'un, la vente de sa propre usine pour l'autre.

⟦RÉSERVE R1 — à prononcer seulement si avance au checkpoint 1⟧ Havas emprunte un chemin voisin avec Converged, mais avec un parti pris inverse : un système ouvert, qui se branche sur les outils des clients. Et WPP pousse la logique au bout en vendant l'accès à sa propre usine de production : le jour où l'agence a vendu son outil, elle a admis que l'outil était devenu l'actif.`,
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
      entreeCible: '~14:40',
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
        script: `Ce déplacement a une traduction humaine : la pyramide des talents devient un diamant. Le modèle historique finançait tout sur une base large de juniors, dont on vendait les journées avec marge et qui apprenaient en exécutant. Or l'IA vide précisément le travail qu'on leur confiait, et c'est tout le levier économique du modèle qui casse. Sur le terrain, cela ne donne pas des plans sociaux : cela donne des recrutements qui ne se font pas. Une déflation latente de l'emploi, cette fois. Et au centre du diamant apparaît le senior augmenté : moins de bras, plus de direction d'outils, plus de vérification.

Le troisième chantier, c'est l'usine elle-même : produire beaucoup plus pour le même budget, noyer la baisse des prix sous le volume. Mais cette parade rencontre une contre-force : c'est l'acheteur qui décide du volume, parce que produire plus ne vaut que si quelqu'un veut acheter plus. (r)`,
        silences: [],
      },
    },

    /* ---------- E15 · Bloc 5 · Une usine sans caisse enregistreuse ---------- */
    {
      id: 'E15',
      bloc: 5,
      titreInterne: 'Usine sans caisse',
      fond: 'noir',
      entreeCible: '~16:07',
      transitionIn: { type: 'bascule-fond', dureeMs: 700 },
      objet: { kind: 'absent' },
      layout: 'titre-plein',
      donnees: { titre: 'Une usine sans caisse enregistreuse' },
      steps: [],
      notes: {
        script: `Voilà où en est le secteur : trois chantiers réels, financés, visibles dans les comptes, et qui transforment tous l'outil de production. Mais aucun ne transforme la facture. À la fin de ce deuxième mouvement, ◈ l'agence est devenue une usine sans caisse enregistreuse. ◆ S4 Il reste à construire la caisse, et c'est ma troisième partie, le cœur de ma thèse.`,
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
      objet: { kind: 'absent' },
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

3. Basculer l'interrupteur neutre. La même mission se redistribue en quatre lignes, la marge tient.

> Même mission, autre unité de compte : la marge tient.`,
        silences: ['S5'],
        consignes:
          "60 s = arrivée à 30:00; 90 s = C3 s'arme au CP3. Gestes lents, laisser lire.",
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
        titre: 'Le prix étagé',
        etages: [
          {
            nom: 'Le conseil',
            metrique: 'au temps',
            ancrage: '« tous les consultants restent au temps passé »',
          },
          {
            nom: 'La production',
            metrique: 'au livrable',
            ancrage: 'la palette déjà en place sur les gros contrats',
          },
          {
            nom: 'La création',
            metrique: 'en droits et en usage',
            ancrage: 'depuis cet été, le droit exige une direction créative humaine',
          },
          {
            nom: "L'effet",
            metrique: 'en variable, dans les deux sens',
            ancrage: "« Havas Delta, c'est de la rémunération »",
          },
        ],
      },
      steps: [],
      notes: {
        script: `Cette autre unité de compte, je l'appelle le prix étagé, et ma thèse tient en une phrase : on ne remplace pas le modèle au temps, on le stratifie. ◈ Quatre étages, une métrique par nature de travail. Et chacun de ces étages existe déjà dans mon corpus.

Le premier étage garde le conseil au temps, parce que l'erreur historique n'était pas de vendre du temps : c'était de tout vendre en temps. Le directeur financier le confirme : tous les consultants restent au temps passé. (r) Le deuxième étage vend la production au livrable : un prix en face d'un visuel, un prix en face d'une animation. Ludovic Chevallier décrit cette palette déjà en place sur les gros contrats. Le troisième étage vend la création en droits et en usage, et le droit vient de basculer : depuis cet été, protéger une œuvre assistée par IA suppose de démontrer une direction créative humaine. Le dossier de création devient donc une pièce de contrat, donc une licence, donc un revenu. (r) Et le quatrième étage paie l'effet, en variable qui joue dans les deux sens. Havas a déjà l'outil, Delta, et son directeur financier le dit : « Havas Delta, c'est de la rémunération ». Avec cette conséquence : « là, on est partenaires ».`,
        silences: [],
      },
    },

    /* ---------- E18 · Bloc 6 · Les trois verrous ---------- */
    {
      id: 'E18',
      bloc: 6,
      titreInterne: 'Trois verrous',
      fond: 'bleu',
      entreeCible: '~19:35',
      transitionIn: { type: 'fondu', dureeMs: 500 },
      objet: { kind: 'strates', etiquettes: false, position: 'retrait' },
      layout: 'verrous',
      donnees: {
        verrous: [
          {
            nom: "L'argent",
            objection: 'Trésorerie négative : −76 M€ au 30 juin',
            parade:
              'Quatre clauses : une base fixe qui couvre les coûts, un plafond dans les deux sens, une avance à la signature, des comptes tous les trois mois',
          },
          {
            nom: 'La mesure',
            objection: 'Comment payer ce que personne ne sait attribuer ?',
            parade:
              "On ne paie jamais quelqu'un sur ce qu'il ne contrôle pas (Bengt Holmström, prix Nobel 2016)",
          },
          {
            nom: 'Le mur des achats',
            objection: 'Le verrou historique',
            parade:
              "Il s'est retourné : 3 marques sur 4 veulent changer, 87 % jugent les modèles opaques",
          },
        ],
      },
      steps: [
        {
          id: 'E18.verrou-1-tombe',
          mode: 'beat',
          action: { type: 'barrer', cible: 'verrou-1' },
          pourquoi:
            "Le verrou de l'argent se barre quand l'orateur passe au suivant : la parade vient d'être donnée.",
          repereParole: "Le deuxième verrou, c'est la mesure",
        },
        {
          id: 'E18.verrou-2-tombe',
          mode: 'beat',
          action: { type: 'barrer', cible: 'verrou-2' },
          pourquoi: "Le verrou de la mesure se barre quand l'orateur attaque le mur des achats.",
          repereParole: "Le troisième verrou, c'est le mur des achats",
        },
      ],
      notes: {
        script: `Restent trois verrous, et je les prends dans l'ordre, avec la parade pour chacun.

Le premier verrou, c'est l'argent. Au 30 juin, Havas affiche une trésorerie négative de 76 millions : il sort plus d'argent qu'il n'en rentre. Greffer là-dessus une rémunération entièrement au résultat serait irresponsable. Mais l'objection tombe devant un variable bien construit, en quatre clauses : une base fixe, payée au livrable, qui couvre tous les coûts, pour que le risque porte sur la marge, jamais sur les salaires ; un variable plafonné dans les deux sens ; une avance versée à la signature ; et des comptes faits tous les trois mois, au lieu d'attendre un an. ⟦COUPE C5 — début⟧ Sur un contrat d'un million d'euros : une base qui couvre tout, et une facture finale entre neuf cent mille et un million cent mille selon les résultats mesurés. Quoi qu'il arrive, l'année n'est jamais déficitaire. ⟦COUPE C5 — fin⟧

Le deuxième verrou, c'est la mesure : comment payer sur une performance que personne ne sait attribuer ? Bengt Holmström, prix Nobel d'économie 2016, l'a démontré : on ne paie jamais quelqu'un sur ce qu'il ne contrôle pas. Traduit en contrat : un indicateur que l'agence peut réellement influencer, jamais le chiffre d'affaires global de l'annonceur ; un petit nombre d'indicateurs, dont un de long terme sur la marque ; et un variable minoritaire, ce que les étages garantissent d'eux-mêmes. Et mon acheteuse pose elle-même la clause type : ◈ pas de supplément déclaratif « parce que tu participes à l'IA », mais des gains cherchés ensemble, un co-investissement documenté, un prorata. (r)

Le troisième verrou, c'est le mur des achats, et c'est mon résultat le plus contre-intuitif : ce mur s'est retourné. Fin 2024, la fédération mondiale des annonceurs interroge plus de quatre-vingts grands comptes : trois marques sur quatre veulent changer de modèle sous trois ans, et 87 % jugent les modèles actuels opaques. Et la preuve française vient de mon terrain : dans les appels d'offres, ce sont les acheteurs qui exigent désormais une grille IA, en livrables et en coûts d'outils. Élise Pierin le dit : « ce qu'on avait précédemment négocié, ça ne marche plus du tout ». L'objection des achats n'est donc pas une objection au principe, c'est une objection à l'outillage. Et une objection d'outillage, ça se lève avec de l'outillage.`,
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
      entreeCible: '23:08',
      transitionIn: { type: 'morph-objet', dureeMs: 1800 },
      objet: { kind: 'frise', allumes: 0 },
      layout: 'frise-24-mois',
      donnees: {
        segments: [
          {
            nom: 'T1',
            periode: 'Trimestre 1',
            decisions: [
              'Plus aucune réponse au seul temps passé : la double colonne',
              "Reconvertir l'exécution vers la vérification et la direction d'outils",
            ],
          },
          {
            nom: 'T2-T3',
            periode: 'Trimestres 2-3',
            decisions: [
              "La preuve devient un produit, l'aval humain facturé en plus",
              "Le premier contrat payé à l'effet : entre 90 et 110, comptes tous les trois mois",
            ],
          },
          {
            nom: 'T4',
            periode: 'Trimestre 4',
            decisions: [
              "15 à 25 % du chiffre d'affaires facturé autrement qu'au temps",
              "En cas de litige : on redescend d'un cran, on ré-équipe la mesure",
            ],
          },
          {
            nom: 'Année 2',
            periode: 'Deuxième année',
            decisions: [
              'Les droits, généralisés sur les grandes productions',
              'Le catalogue lisible par les machines des acheteurs',
            ],
          },
        ],
        ligneDeCrete:
          'La grille paie la preuve, la preuve paie le premier contrat, ce contrat paie les droits, et les droits paient le catalogue.',
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
          pourquoi: "Le troisième segment s'allume au moment du bilan.",
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

Au premier trimestre, deux décisions, dont la première ne coûte rien et conditionne tout : plus aucun appel d'offres ne reçoit de réponse au seul temps passé. Chaque proposition sort en double colonne, grille classique et grille par livrable, coût des outils détaillé : on devance la grille IA que les acheteurs demandent déjà. En parallèle, un inventaire arrête trois listes : ce qui se standardise, ce qui reste légitimement au temps, ce qui peut porter des droits. (r) La seconde décision est sociale, et je la considère non négociable : reconvertir les profils d'exécution vers les deux métiers qui montent, la vérification et la direction des outils, en le payant avec l'argent qu'on gagne aujourd'hui à former les autres, tant que cette fenêtre est ouverte. Et la cible se vérifie : chaque poste que la machine vide doit trouver, la même année, sa contrepartie en poste de contrôle. Parce qu'à défaut, le diamant n'est pas une transformation, c'est un plan social qui ne dit pas son nom.

Aux trimestres deux et trois, la preuve, et le premier contrat à l'effet. ⟦COUPE C3 — début⟧ D'un côté, on vend la preuve : le règlement européen oblige désormais, depuis cet été, à marquer les contenus générés. Alors on ne fait pas le minimum : on en fait un produit, avec l'aval humain facturé en plus, et pour premier client cible un annonceur régulé, banque, santé ou jeux d'argent. ⟦COUPE C3 — fin⟧ De l'autre, on ouvre le premier contrat payé à l'effet, un seul, choisi exprès : chez le client dont on mesure déjà tout, avec une facture qui joue entre quatre-vingt-dix et cent dix, et des comptes tous les trois mois. L'objectif n'est pas le revenu, c'est le précédent : un cas signé, mesuré, réglé sans litige.

Au quatrième trimestre, le bilan : viser 15 à 25 % du chiffre d'affaires facturé autrement qu'au temps. Et si le contrat à l'effet finit en litige, on ne s'arrête pas : on redescend d'un cran, on ré-équipe la mesure avant de retenter, parce qu'un deuxième précédent contesté ferait jurisprudence contre l'agence.

La deuxième année ouvre les deux chantiers lourds : les droits, généralisés sur les grandes productions ; et le catalogue de l'agence rendu lisible par les machines, à mesure que les annonceurs commenceront à acheter via leurs propres systèmes automatiques. (r)

Et une ligne de crête traverse ces vingt-quatre mois : à aucun moment on n'abandonne le temps passé. On le cantonne, pièce par pièce, aux missions où il reste l'étalon honnête. Et chaque pièce déménagée paie la suivante : la grille paie la preuve, la preuve paie le premier contrat à l'effet, ce contrat paie les droits, et les droits paient le catalogue. Ce qui fait qu'au terme des vingt-quatre mois, l'agence n'a renoncé à aucun revenu, et elle a quatre étages là où elle n'avait qu'un guichet.`,
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
      entreeCible: '27:23',
      transitionIn: { type: 'bascule-fond', dureeMs: 700 },
      objet: { kind: 'absent' },
      layout: 'trois-suites',
      donnees: {
        suites: [
          "Havas Paris Social, en poste fin septembre : un terrain d'épreuve trimestriel",
          'La présentation des comptes en trois volets, proposée à une revue professionnelle',
          "D'autres travaux, sur d'autres groupes et d'autres marchés : trois concepts livrés",
        ],
      },
      steps: [],
      notes: {
        script: `Trois convictions résument ce parcours. La contrainte s'exerce par trois canaux : le prix, qui opère en silence ; le travail, frappé par les recrutements qui ne se font pas ; et la confiance, grevée par la dette de vérification. Et la survie passe par trois déplacements : comptable, des salaires vers les actifs ; tarifaire, le prix étagé ; et commercial, la preuve devenue produit.

Les limites bornent la portée de ce travail, et je les dis : un corpus riche mais resserré, ancré dans un grand groupe et chez un annonceur unique ; une enquête qui éclaire des mécanismes plus qu'elle ne mesure un marché ; et une fenêtre brûlante : ce mémoire s'écrit au milieu de l'événement, entre un règlement appliqué seize jours avant le dépôt et des comptes semestriels intégrés le matin de leur publication. C'est ce qui lui donne sa valeur documentaire, et c'est ce qui lui interdit la prétention au recul.

Les suites maintenant, et elles sont déjà engagées. Fin septembre, je rejoins Havas Paris Social en poste. La feuille de route que je viens de vous présenter cesse donc d'être un exercice académique : elle a un terrain d'épreuve réel, et je compte bien la confronter, trimestre par trimestre, à la maison qui me l'a inspirée.

⟦RÉSERVE R3 — à prononcer seulement si avance au checkpoint 3⟧ Deuxième suite : proposer à une revue professionnelle la présentation des comptes en trois volets que ce mémoire esquisse, pour la soumettre à plus compétent que moi.

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
      entreeCible: '~29:45',
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
        script: `◈ Ce n'est pas l'intelligence artificielle qui tue l'agence. C'est l'agence qui continue de vendre du temps, dans un monde où il ne vaut plus rien. ◆ S7

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
      cible: '8:28',
      decisions: [
        {
          condition: { type: 'avance', seuilS: 45 },
          instruction:
            "Ouvrir R2 dans le bloc 4 : l'étude sur les freelances (Organization Science).",
        },
      ],
    },
    {
      id: 'CP1',
      libelle: 'Fin bloc 4',
      sortieDe: 'E12',
      cible: '13:24',
      decisions: [
        {
          condition: { type: 'avance', seuilS: 45 },
          instruction: 'Ouvrir R1 : Havas Converged + WPP vend son usine.',
        },
        {
          condition: { type: 'retard', seuilS: 45 },
          instruction:
            "Armer C3. Raccord : « D'un côté, on industrialise la preuve de conformité, désormais obligatoire, et on la vend en plus. De l'autre... »",
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
      cible: '23:08',
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
          instruction:
            'Ouvrir R3 : la présentation des comptes en trois volets, pour une revue professionnelle.',
        },
      ],
    },
    {
      id: 'CP4',
      libelle: 'Fin bloc 7',
      sortieDe: 'E19',
      cible: '27:23',
      decisions: [
        {
          condition: { type: 'avance', seuilS: 30 },
          instruction: 'Ne rien rajouter : ralentir, allonger les deux silences finaux.',
        },
      ],
    },
    {
      id: 'FIN',
      libelle: 'Atterrissage',
      sortieDe: null,
      cible: '30:08',
      decisions: [],
    },
  ],

  coupes: [
    {
      id: 'C3',
      bloc: 7,
      gainS: 40,
      contenuSacrifie: 'Vendre la preuve / article 50 / client régulé',
      phraseRaccord:
        "« D'un côté, on industrialise la preuve de conformité, désormais obligatoire, et on la vend en plus. De l'autre... »",
    },
    {
      id: 'C5',
      bloc: 6,
      gainS: 30,
      contenuSacrifie: "Exemple du contrat d'un million",
      phraseRaccord:
        "Enchaîner directement sur « Le deuxième verrou, c'est la mesure... » — dernier recours, ce chiffre parle à Diagne",
    },
    {
      id: 'C6',
      bloc: 7,
      gainS: 35,
      contenuSacrifie: 'Compression du trimestre 4 en une phrase',
      phraseRaccord:
        "« À douze mois, trois indicateurs décident de la suite, avec une cible de 15 à 25 % du chiffre d'affaires facturé autrement qu'au temps. »",
    },
  ],

  reserves: [
    {
      id: 'R1',
      bloc: 5,
      coutS: 30,
      contenu: 'Havas Converged + WPP vend son usine',
      declencheur: 'CP1 en avance ≥ 45 s',
    },
    {
      id: 'R2',
      bloc: 4,
      coutS: 30,
      contenu: "L'étude sur les freelances (Organization Science)",
      declencheur: 'Fin de bloc 3 (CP0) en avance ≥ 45 s',
    },
    {
      id: 'R3',
      bloc: 8,
      coutS: 15,
      contenu: 'La présentation des comptes en trois volets / revue professionnelle',
      declencheur: 'CP3 en avance ≥ 30 s',
    },
  ],

  simulateur: {
    contrat: {
      jours: 10,
      tjmEUR: 1500,
      coutJourEUR: 650,
      structureEUR: 4000,
      outilsPleinGainEUR: 750,
    },
    gainMaxPct: 50,
    hausseTjmMaxPct: 15,
    etage: {
      lignes: [
        { nom: 'Le conseil', metrique: 'au temps', montantEUR: 3000, nature: 'temps' },
        { nom: 'La production', metrique: 'au livrable', montantEUR: 4000, nature: 'livrable' },
        { nom: 'La création', metrique: "en droits d'usage", montantEUR: 2500, nature: 'droits' },
        {
          nom: "L'effet",
          metrique: 'variable, dans les deux sens',
          montantEUR: 4000,
          nature: 'variable',
        },
      ],
      couloir: { basPct: 90, hautPct: 110 },
    },
    calibration: {
      aGainPct: 50,
      contractionRevenu: { minPct: -45, maxPct: -38 },
    },
    hypotheses: [
      {
        cle: 'Prix de journée',
        valeur: "1 500 €, tenté vers ≈ +15 % avec l'IA",
        source: 'Entretien D. Kajman, DAF Havas Paris',
      },
      {
        cle: 'Riposte du client',
        valeur: 'le nombre de jours divisé par deux',
        source: 'Entretien D. Kajman',
      },
      {
        cle: "Coût d'une journée travaillée",
        valeur: '650 € (salaires chargés)',
        source: 'Hypothèse de démonstration',
      },
      {
        cle: 'Frais fixes alloués à la mission',
        valeur: '4 000 € (ne fondent pas avec les jours)',
        source: 'Hypothèse de démonstration',
      },
      {
        cle: 'Coût des outils IA à plein gain',
        valeur: '750 €',
        source: 'Hypothèse de démonstration',
      },
      {
        cle: 'Prix étagé de la même mission',
        valeur: "13 500 € : le client paie moins, l'agence marge mieux",
        source: 'Hypothèse de démonstration, alignée sur les quatre étages',
      },
      {
        cle: "Ligne à l'effet",
        valeur: 'la facture joue entre 90 et 110 selon les résultats mesurés',
        source: 'Feuille de route, bloc 7',
      },
    ],
    etiquetteBascule: 'Autre unité de compte',
    etiquetteCurseur: 'Gain de productivité IA',
    etiquetteValeurClient: 'La valeur créée pour le client',
  },
};
