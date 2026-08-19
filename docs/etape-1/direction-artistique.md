# Direction artistique — proposition d'exécution

Le concept est posé par le cahier des charges : un objet graphique unique qui traverse la soutenance et se métamorphose trois fois. Ce document fixe son exécution.

## 1. L'objet graphique : « l'unité de compte »

L'objet n'est pas un élément décoratif posé sur les écrans : c'est la thèse rendue visible. Il matérialise l'unité de compte, et chaque métamorphose correspond à un déplacement du raisonnement.

- **État 1 (E09, bloc 4) : la barre.** Dix segments blancs = dix journées vendues. Pendant l'arithmétique Kajman, les segments 6 à 10 se vident en 1 400 ms et restent à l'écran en fantômes (filet gris à 45 %). On ne fait pas disparaître la moitié amputée : sa trace hante le bloc 4, rangée en pied d'écran sur E10 à E14. Le jury garde la blessure sous les yeux pendant toute la démonstration.
- **État 2 (E16 geste 3 → E17, bloc 6) : les quatre strates.** La barre se fragmente et se recompose en quatre strates empilées = conseil, production, droits, effet. La métamorphose se joue dans le simulateur, au moment exact où la bascule « prix étagé » est actionnée : le geste de l'orateur déclenche la mutation de l'objet.
- **État 3 (E19, bloc 7) : la frise.** Les quatre strates pivotent et s'alignent en frise horizontale de 24 mois. Le sens est littéral : chaque étage du prix finance un segment du temps (« la grille finance la preuve, la preuve finance le couloir... »). Les segments s'allument en jaune quand ils sont nommés.

**Implémentation : l'objet est une couche persistante** (un seul composant SVG monté en permanence au-dessus des écrans), jamais démonté ni recréé. Les états sont des cibles de position/forme interpolées par le moteur (Motion + interpolation de chemins). C'est plus fort qu'un FLIP entre écrans : la continuité est structurelle, aucune métamorphose ne peut « casser » sur un changement de route.

## 2. Scénographie des fonds

Trois fonds, trois registres, et la progression du récit se lit dans leur alternance :

- **NOIR** : les verdicts et les bascules. E01-E03 (le 3 février), E15 (l'usine sans caisse), E21 (le renversement). Le noir encadre la soutenance : elle s'ouvre et se ferme dessus.
- **PAPIER (#F5F3EE)** : l'exposition. Plan, parcours, problématique, méthode (E04-E07), suites (E20). Registre éditorial clair, encre #10141F, respiration.
- **BLEU (#1F2A7A)** : la démonstration. Tout le cœur argumentatif (E08-E14, E16-E19). C'est le territoire de l'objet graphique.

Les bascules de fond sont des événements rares (5 en 30 minutes) et signifiantes : chaque changement de fond dit « changement de régime de discours ».

## 3. Le jaune : une règle d'exception

\#E8B400 est réservé à **la valeur qui reste**. Trois apparitions en 30 minutes, aucune autre :

1. **E16, geste 2** : la ligne « valeur créée pour le client » qui ne bouge pas pendant que le revenu s'effondre. Première apparition du jaune de toute la soutenance, au moment S5 (« regardez le revenu »). C'est le pivot rhétorique.
2. **E16-E17, geste 3** : la marge qui tient dans le prix étagé.
3. **E19** : les segments de la frise qui s'allument, la valeur en construction.

Le jury ne le formulera pas, mais il le sentira : le jaune n'apparaît que quand quelque chose survit.

## 4. Typographie

- **Fraunces variable** (opsz 9-144, wght 100-900, italique), auto-hébergée. Titres, citations, et **chiffres-événements** : les chiffres qui portent la thèse (−9,24 %, ÷2, −40 %) sont composés en Fraunces opsz 144, où ils deviennent des objets quasi-Didone, spectaculaires en très grande taille. L'axe optique est un outil expressif : opsz bas pour les opérateurs mathématiques (traits pleins), opsz maximal pour les chiffres (contraste extrême). Le poids est animable en continu (compteurs qui « se posent » en gagnant de la graisse).
- **Space Grotesk variable** (300-700), auto-hébergée. Données, axes, étiquettes, le simulateur entier : les **chiffres-instruments**. Les compteurs utilisent des cellules de chiffres à chasse fixe (un span par chiffre), donc aucun tremblement de largeur pendant l'animation.
- La distinction chiffre-événement / chiffre-instrument est la règle de composition centrale : elle dit au jury ce qui est verdict et ce qui est mécanique.
- Corps minimal à l'écran : 28 px (base 1920×1080).

## 5. Motion

- **Trois easings nommés, documentés dans les tokens** : `ease-entree` cubic-bezier(0.22, 1, 0.36, 1) pour les entrées et masques; `ease-morph` cubic-bezier(0.65, 0, 0.35, 1) pour les métamorphoses de l'objet; `ease-fond` cubic-bezier(0.45, 0, 0.15, 1) pour les bascules de fond. Jamais de `linear`, jamais d'`ease` par défaut.
- Durées : 400-900 ms pour les transitions d'écran, 1 200-2 000 ms pour les trois métamorphoses (1 400 / 1 600 / 1 800 ms : elles s'allongent à mesure que l'objet gagne en signification).
- Un seul mouvement à la fois. Chaque animation se justifie en une phrase (la justification est un champ obligatoire du config : `step.pourquoi`).
- Les chiffres entrent en compteur animé ou en masque montant, jamais en pavé.
- `prefers-reduced-motion` : tout retombe en fondus de 300 ms.
- Grain statique à 5 % sur les aplats (SVG turbulence) : évite le banding du vidéoprojecteur et donne une matière aux fonds. Il ne bouge pas.

## 6. Écrans témoins livrés

- `mockups/e03-verdict.html` : le verdict. Fraunces 588 px, opsz 144, wght 560. Le chiffre seul, aucune légende, composition sur l'axe optique légèrement haut.
- `mockups/e09-arithmetique.html` : l'arithmétique Kajman et l'état 1 de l'objet (barre amputée, fantômes). Hiérarchie : deux lignes moyennes, la troisième (≈ −40 %) dominante, étiquette blanche.
- `mockups/e21-renversement.html` : le renversement. Fraunces 82 px wght 360, phrase 1 à 50 % d'opacité, phrase 2 pleine. Aucun autre élément.

Captures 1920×1080 dans `mockups/captures/`.

## 7. Ce que je propose en plus du cahier des charges

1. **La trace fantôme** (état 1) : la moitié amputée ne disparaît jamais pendant le bloc 4. Coût nul, effet mémoriel fort.
2. **Le jaune raconté** (règle des trois apparitions) : transforme une couleur d'accent en dispositif narratif.
3. **La couche persistante** pour l'objet : garantie technique que les métamorphoses sont des morphings vrais, pas des recompositions.
4. **Le grain statique** : matière discrète qui sauve les aplats au vidéoprojecteur.
5. **Les durées de métamorphose croissantes** (1 400 → 1 600 → 1 800 ms) : le rythme de l'objet ralentit à mesure que le propos gagne en gravité, en miroir du débit lent demandé pour la fin.
