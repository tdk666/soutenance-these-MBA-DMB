# Soutenance de thèse MBA DMB — support

Support de soutenance (4 septembre 2026, EFAP, 30 minutes). Un objet graphique unique traverse la présentation et se métamorphose trois fois : barre des journées vendues, quatre strates du prix étagé, frise des 24 mois.

## État du projet

- **Étape 1 (validée)** : table des écrans, direction artistique, écrans témoins (`docs/etape-1/`, `mockups/`).
- **Étape 2 (en validation)** : moteur complet (Vite + React + TS + Motion), 33 beats + chaînes, mode présentateur en fenêtre séparée, chrono à checkpoints avec décisions du script, grille Échap, aller-à par numéro, mode salle claire (L), build offline en un seul fichier.
- Étapes suivantes : simulateur calibré (3), tous les écrans définitifs + métamorphoses (4), polish + PDF de secours (5).

## Commandes

- `npm run dev` : développement.
- `npm run build` : produit `dist/index.html`, autonome, s'ouvre en double-clic sans réseau.
- `npm test` : tests du moteur (séquence, chrono, invariants du config).
- `npm run capture` : captures de vérification de tous les écrans + grille + présentateur (`captures-verification/`).
- Déploiement continu : chaque push publie sur Netlify (`these-theophile.netlify.app`).

## Clavier (scène et fenêtre présentateur)

→ / espace / PageDown : avancer · ← / PageUp : reculer · Échap : grille · 1-21 puis Entrée : aller à un écran · S : chrono marche/pause · Maj+R : chrono à zéro · P : fenêtre présentateur · F : plein écran · L : mode salle claire.

Le script de référence est `docs/script-soutenance-v2.md`. Aucun chiffre n'est inventé : tout vient du script ou de la thèse déposée.
