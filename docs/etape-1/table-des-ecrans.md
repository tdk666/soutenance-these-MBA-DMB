# Table des écrans — extraite du script v2, amendée v3

**Addendum v3 (fait foi, voir `docs/journal-revisions-v3.md`)** : la structure des 21 écrans est inchangée. Ce qui change : les six cibles de checkpoint deviennent 8:28 / 13:24 / 16:26 / 23:08 / 27:23 / 30:08; un beat s'ajoute sur E11 (le baptême « déflation latente », seule balise ajoutée), soit **34 beats**; E10 passe à deux lignes (achats extérieurs −13 %, masse salariale inchangée); E11 passe à deux barres (le 3/11 disparaît du discours donc de l'écran); E09 affiche « ≈ +15 % »; E13 ne garde que 300 M€ et 20e trimestre; E12 perd sa sous-ligne Deloitte (l'histoire est racontée avant la balise); l'interrupteur du simulateur porte l'étiquette neutre « autre unité de compte »; tous les textes affichés suivent le lexique de traduction (`docs/lexique-traduction-v3.md`). Les timecodes d'entrée recalculés vivent dans `content/deck.config.ts`.

Source historique : `Livrable_B_Script_Soutenance_v2.md` (archivée : `docs/v3-archive-script-v2.md`); version de référence actuelle : `docs/script-soutenance-v3.md`.
Règle contractuelle : l'écran n'anticipe jamais la parole. Chaque entrée d'écran et chaque déclenchement interne est manuel (flèche ou télécommande). Les timecodes sont des cibles indicatives calculées au débit de 120 mots/minute; le chrono du mode présentateur se cale sur les checkpoints officiels, pas sur ces valeurs intermédiaires.

Fonds : NOIR (écrans de bascule et de verdict) · BLEU #1F2A7A (écrans de démonstration) · PAPIER #F5F3EE (écrans d'exposition : plan, parcours, méthode, suites).

| N° | Bloc | Entrée cible | Fond | Contenu | Objet graphique | Transition entrante |
|----|------|--------------|------|---------|-----------------|---------------------|
| E01 | 1 | 0:00 | Noir | Rien. Noir total pendant l'adresse. | absent | État initial, aucun élément. |
| E02 | 1 | ~0:35 | Noir | Une seule ligne blanche : « 3 février 2026 ». | absent | Fondu lent de la ligne sur le noir (600 ms). |
| E03 | 1 | ~1:15 | Noir | « −9,24 % » plein écran, seul. Fraunces opsz 144. | absent | La date se dissout; le chiffre descend de 0,00 % à −9,24 % en 900 ms puis se pose (S1 se vit sur cet écran). |
| E04 | 2 | 2:30 | Papier | Sommaire en quatre lignes : « D'où vient ce sujet · Comment je l'ai instruit · Ce que j'ai trouvé · Ce que j'en fais ». | absent | Le noir s'ouvre sur le papier (bascule de fond 700 ms); les quatre lignes montent en cascade par masque. |
| E05 | 2 | ~2:45 | Papier | Ligne de parcours sobre (double licence → IAE/McGill → Les Échos → Air Liquide → Havas Paris Social → MBA DMB). | absent | Le sommaire se range en haut; la ligne se déploie de gauche à droite (700 ms). Étapes allumées une à une (déclenchements internes). |
| E06 | 2 | ~4:45 | Papier | La problématique, seule, en serif grande taille. | absent | Tout s'efface en fondu; la problématique entre par masque montant ligne à ligne (600 ms). S2 juste avant. |
| E07 | 3 | 5:00 | Papier | Schéma « deux côtés de la table » : 3 fonctions agence à gauche, l'acheteuse à droite; en dessous 3 pastilles (conférences, enquête n=34, benchmark financier). | absent | Glissement latéral doux (500 ms). Déclenchements internes : chaque entretien apparaît quand il est nommé, puis les 3 pastilles, puis la mention « 4/10 entretiens » assumée, puis la ligne « rédigé avec l'IA, audité ». |
| E08 | 4 | 8:04 | Bleu | Titre plein écran : « Mesuré partout, facturé nulle part ». Première bascule dans le bleu. | latence | Bascule papier → bleu (700 ms); titre serif par masque. |
| E09 | 4 | ~8:50 | Bleu | L'arithmétique en trois lignes : « +13 à 20 % sur le prix » / « ÷2 sur les jours » / « ≈ −40 % de revenu ». Source : David Kajman, DAF Havas Paris. | **État 1 : naissance.** La barre (10 journées) entre sous les trois lignes. Au déclenchement « ÷2 », les segments 6 à 10 se vident et deviennent fantômes (1 400 ms). C'est l'amputation en direct. | Le titre E08 se réduit en kicker; lignes une à une, chiffres en compteurs (S3 sur cet écran). |
| E10 | 4 | ~10:40 | Bleu | Les quatre lignes Havas S1 2026 : revenu net +2,5 % · coûts refacturés −12,9 % · masse salariale 932 M€ stable · marge 11 %. Chute : « l'IA n'apparaît sur aucune ligne, mais dans tous les ratios ». | La barre amputée se range en pied d'écran, mémoire visible. | Balayage vertical; les quatre lignes entrent une à une, compteurs animés. |
| E11 | 4 | ~11:20 | Bleu | Figure d'enquête (D3) : usage du gain de temps. 8/11 agences déclarent ≥ 25 % de temps gagné · 0/11 le restituent · 3/11 annonceurs attendent une baisse. Nombres absolus, jamais de %. | rangée en pied | Fondu croisé; barres dessinées au déclenchement (800 ms). |
| E12 | 4 | ~12:15 | Bleu | « Dette de vérification », seul, très grand. Sous-ligne discrète : Deloitte, le premier remboursement de l'ère générative. | rangée en pied | Tout s'efface; le terme entre par masque typographique (600 ms). |
| E13 | 5 | 13:04 | Bleu | Trois plans en trois colonnes : CoreAI 300 M€ · Converged 400 M€ · Open Pro (WPP vend son usine). Chiffres clés Publicis S1 2026 : +4,7 %, marge 17,5 %. | rangée en pied | Glissement des trois colonnes en cascade (500 ms, une seule vague). |
| E14 | 5 | ~14:25 | Bleu | La pyramide des talents devient un diamant. Au centre du diamant : le senior augmenté. | rangée en pied | **Morphing continu pyramide → diamant** (1 600 ms, SVG interpolé) au déclenchement, pas un changement d'écran. |
| E15 | 5 | ~16:05 | Noir | Plein écran : « Une usine sans caisse enregistreuse ». | absent | Bascule bleu → noir (700 ms); la phrase entre en même temps qu'elle est dite (S4 sur cet écran). |
| E16 | 6 | 16:26 | Bleu | **Le simulateur**, plein écran. Geste 1 : contrat au TJM sain. Geste 2 : curseur gain IA 0 → 50 %, les jours fondent, le revenu s'effondre, la valeur client (jaune) ne bouge pas (S5). Geste 3 : bascule « prix étagé ». Hypothèses affichables d'un clic. | **État 1 vivant** : la barre du contrat est l'objet. Au geste 3, **métamorphose État 1 → État 2** : la barre se fragmente en quatre strates (1 600 ms). | Bascule noir → bleu (700 ms); le contrat se construit ligne à ligne. |
| E17 | 6 | ~17:45 | Bleu | Les quatre étages en colonne : conseil au temps · production au livrable · création aux droits · effet au variable (couloir 90/110). Citations d'ancrage (Kajman, Chevallier, CSPLA, Delta). | **État 2 : les quatre strates**, héritées du simulateur, s'étiquettent une à une. | Continuité directe : les strates du geste 3 glissent en position et deviennent la colonne (800 ms). |
| E18 | 6 | ~19:25 | Bleu | Les trois verrous, barrés un à un : trésorerie (−76 M€, variable architecturé en 4 clauses) · audit (Holmström, Milgrom, clause Pierin) · achats (WFA : 3/4, 58 %, 87 %). | strates en retrait à gauche, réduites | Fondu; chaque verrou se barre au déclenchement (400 ms par verrou). |
| E19 | 7 | 23:02 | Bleu | La frise 24 mois en quatre segments : T1 · T2-T3 · T4 · Année 2. Chaque segment s'allume (jaune) quand il est nommé, avec ses décisions clés. Ligne de crête en fin de bloc : « chaque pièce déménagée est payée par la précédente ». | **Métamorphose État 2 → État 3** : les quatre strates pivotent et s'alignent en frise horizontale (1 800 ms). Chaque étage du prix devient un segment du temps. | Le morphing EST la transition. Segments allumés par déclenchement. |
| E20 | 8 | 27:18 | Papier | Trois lignes de suites : Havas Paris Social en poste (terrain d'épreuve trimestriel) · concepts livrés (déflation latente, dette de vérification, prix étagé) · travaux futurs. Trois convictions et limites dites sans écran dédié. | absent | Bascule bleu → papier (700 ms); lignes en cascade. |
| E21 | 8 | ~29:40 | Noir | La phrase de renversement, blanc sur noir, apparaît au rythme exact de la parole : phrase 1, puis phrase 2 (la phrase 1 recule à 50 %). Rien d'autre, jusqu'au « Je vous remercie » (l'écran ne change pas). | absent | Bascule papier → noir (900 ms), écran vide d'abord (S6); chaque phrase entre par groupes de mots au déclenchement (S7 après). |

## Réserves et coupes

- **R1** (bloc 5, Converged/Open Pro détaillés) et **R2** (bloc 4, Organization Science) se prononcent sur les écrans existants (E13 et E10-E11) : aucun écran supplémentaire, le mode présentateur affiche la consigne. **R3** (bloc 8) se prononce sur E20.
- **C3, C5, C6** sont des coupes de parole : aucun écran ne saute. Le mode présentateur affiche la phrase de raccord au checkpoint concerné.

## Régie des déclenchements (révisée après retour superviseur)

Deux régimes de pas, typés dans le config :

- **beat** : déclenchement manuel, ancré sur un mot précis du script. Réservé aux moments où un chiffre ou une phrase doit tomber exactement sur la parole.
- **chaîne** : séquence automatique lancée par le beat précédent, avec délais écrits dans le config. Réservée aux rythmes internes d'une même respiration (cascade du sommaire, étiquettes des étages, dessin d'une figure).

Budget révisé : **33 beats** (contre 44 dans la v1 de cette table), obtenus en chaînant tout ce qui n'exige pas d'ancrage au mot : les quatre lignes du sommaire (E04), les étapes du parcours (E05), les quatre lignes Havas (E10, annoncées par « quatre lignes suffisent », elles entrent ensemble puis il les parcourt), la figure d'enquête (E11), les étiquettes des étages (E17), le panneau transparence unique d'E07 (4/10 et rédaction IA regroupés), et le verrou 3 qui se barre dans la transition vers la frise.

| Écran | Beats | Ancrages |
|-------|-------|----------|
| E02-E06 | 5 | une entrée par écran |
| E07 | 2 | entrée · « un mot de transparence » |
| E08 | 1 | entrée |
| E09 | 4 | entrée · « 13 à 20 % » · « divise l'assiette par deux » (+ amputation chaînée) · « de l'ordre de 40 % » |
| E10-E13 | 4 | une entrée par écran |
| E14 | 2 | entrée (pyramide) · « devient un diamant » (morph) |
| E15-E17 | 3 | une entrée par écran (les 3 gestes du simulateur sont à la souris, hors télécommande) |
| E18 | 3 | entrée · fin verrou 1 · fin verrou 2 |
| E19 | 5 | entrée (morph frise) · T1 · T2-T3 · T4 · Année 2 |
| E20 | 1 | entrée |
| E21 | 3 | bascule noir · phrase 1 · phrase 2 |

Pourquoi 33 et pas 25 : descendre en dessous obligerait à chaîner des révélations qui doivent tomber sur un mot (l'arithmétique, les segments de la frise, les deux phrases finales). Une chaîne qui court en avance sur une parole dite de tête viole la règle « l'écran n'anticipe jamais », et c'est pire qu'un clic. Trois garde-fous compensent la densité : le mode présentateur affiche en permanence le prochain ancrage (« prochain geste : ÷2 »), la flèche droite pendant une chaîne l'avance sans casser l'état, et après les répétitions (étape 5) tout beat dont le rythme s'avère stable pourra être rétrogradé en chaîne. Densité réelle : 8 beats sur les 8 premières minutes, les pointes sont sur E09 (4 en 90 s) et E19 (5 en 4 min), là où le script lui-même impose le rythme.

## Langage écran (règle ajoutée)

L'écran montre, la parole nomme. Les mots affichés sont toujours plus simples que les mots prononcés : jamais de « assiette », « périmètre », « instrumentation » à l'écran. Quatre concepts nommés au maximum sur toute la soutenance (déflation latente, dette de vérification, prix étagé, l'unité de compte), tout le reste en français ordinaire. Les étiquettes des écrans témoins seront alignées sur cette règle quand la v3 du script sera posée (exemple : E09 « De revenu sur le périmètre » deviendra « Résultat sur le revenu »).

## Checkpoints du chrono (contrat du mode présentateur)

| Checkpoint | Position | Cible | Décision affichée |
|------------|----------|-------|-------------------|
| CP0 | fin bloc 3 (sortie E07) | 8:04 | avance ≥ 45 s → ouvrir R2 dans le bloc 4 |
| CP1 | fin bloc 4 (sortie E12) | 13:04 | avance ≥ 45 s → ouvrir R1 · retard ≥ 45 s → armer C3 |
| CP2 | fin bloc 5 (sortie E15) | 16:26 | retard persistant → confirmer C3 · ne pas toucher au bloc 6 |
| CP3 | fin bloc 6 (sortie E18) | 23:02 | retard ≥ 45 s → C3+C6 · ≥ 90 s → C3+C6+C5 · avance ≥ 30 s → ouvrir R3 |
| Fin | sortie E21 | 30:04 | · |

## Addendum étape 4 : structure à 23 écrans

La découpe a été affinée après la première répétition sur le mode présentateur : tout ce qui est nommé à la parole doit être vu à l'écran. La méthode passe de un à trois écrans, sans changer une ligne du script.

- **E07 · Les entretiens** : les intervenants des quatre entretiens, nommés, côté agence et côté annonceur.
- **E08 · Autour du cœur** : la conférence Trois voix (les trois profils cités), l'enquête (34 répondants), le pilier documentaire (les comptes 2024-2026).
- **E09 · Transparence** : les trois suites (entretiens compensés, IA sous supervision, audit indépendant).

Les écrans E08 à E21 de la table ci-dessus deviennent E10 à E23. Le config (`content/deck.config.ts`) fait foi : 23 écrans, 35 déclenchements manuels, cibles chrono 8:28 / 13:24 / 16:26 / 23:08 / 27:23 / 30:08 (CP0 à la sortie d'E09). La page de garde noire précède E01 et se quitte à la première avancée.
