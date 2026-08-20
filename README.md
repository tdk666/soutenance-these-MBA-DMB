# Soutenance de thèse MBA DMB — support

Support de soutenance (4 septembre 2026, EFAP, 30 minutes). Un objet graphique unique traverse la présentation et se métamorphose trois fois : barre des journées vendues, quatre strates du prix étagé, frise des 24 mois.

## État du projet

- **Étape 1 (validée)** : table des écrans, direction artistique, écrans témoins (`docs/etape-1/`, `mockups/`).
- **Étape 2 (validée)** : moteur complet (Vite + React + TS + Motion), mode présentateur en fenêtre séparée, chrono à checkpoints, grille Échap, mode salle claire, build offline en un seul fichier.
- **Script v3 intégré** : 40 beats, cibles 8:28 / 13:24 / 16:26 / 23:08 / 27:23 / 30:08, textes d'écran alignés sur le lexique de traduction, baptêmes « montrer puis nommer ».
- **Étape 3 (validée)** : le simulateur, calibré sur l'arithmétique Kajman et couvert par 8 tests.
- **Étape 4 (en validation)** : tous les écrans définitifs; l'objet graphique en dix unités persistantes qui se métamorphosent réellement (barre → strates → frise); révélations typographiques par masque; pyramide de points → diamant avec les recrutements fantômes; verrous en lecture guidée; frise à zone de détail; compteurs sur tous les chiffres; détecteur automatique de textes coupés dans la passe de vérification.
- **Étape 4.2 (en validation)** : 23 écrans (la méthode détaillée sur trois écrans, intervenants nommés); page de garde noire; synchronisation entre onglets de la vue présentateur (`?vue=presentateur`) par BroadcastChannel; transitions au flou et rideau de fond; fonds éclairés; chrome éditorial (bloc + folio); panneau d'hypothèses en verre dépoli.
- **Étape 4.3 (en validation)** : interludes de chapitre (le nom du bloc traverse l'écran à son ouverture); fond bleu vivant (masses de lumière dérivantes); crans d'écrans sur le filet et repères de coin sur papier; pilotage sans ambiguïté dans le présentateur (même écran / changement d'écran, points de gestes); la vue `?vue=presentateur` vit aussi sans onglet scène; compteur de preuves du bloc 4; passe de fil rouge documentée (`docs/passe-fil-rouge.md`).
- **Étape 4.4 (en validation)** : 25 écrans et 40 gestes; tout ce qui est prononcé se voit (citation du financier, constat du client, histoire Deloitte, clause de l'acheteuse, écran des convictions); colophon de fin qui tient pendant les questions; panneau d'hypothèses opaque et lisible; interludes tenus plus longtemps; la problématique entre mot à mot; cascade au flou sur les décisions de la frise.
- Étape suivante : polish final, PDF de secours, README du jour J (5).

## Commandes

- `npm run dev` : développement.
- `npm run build` : produit `dist/index.html`, autonome, s'ouvre en double-clic sans réseau.
- `npm test` : tests du moteur (séquence, chrono, invariants du config).
- `npm run capture` : captures de vérification de tous les écrans + grille + présentateur (`captures-verification/`).
- Déploiement continu : chaque push publie sur Netlify (`these-theophile.netlify.app`).

## Clavier (scène et fenêtre présentateur)

→ / espace / PageDown : avancer · ← / PageUp : reculer · Échap : grille · 1-25 puis Entrée : aller à un écran · S : chrono marche/pause · Maj+R : chrono à zéro · P : fenêtre présentateur · F : plein écran · L : mode salle claire.

Le script de référence est `docs/script-soutenance-v3.md` (avec `docs/journal-revisions-v3.md` et `docs/lexique-traduction-v3.md`). Aucun chiffre n'est inventé : tout vient du script ou de la thèse déposée.
